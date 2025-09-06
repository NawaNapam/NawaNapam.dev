// API route: /api/matching/find-match
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import MatchingQueue from "@/models/matchingQueue.model";
import User from "@/models/users.model";
import {
  ValidationMiddlewares,
  createSuccessResponse,
  createErrorResponse,
  ApiError,
} from "@/lib/apiValidation";
import { CreateMatchingQueueInput } from "@/lib/validationSchemas";

export async function POST(req: NextRequest) {
  return ValidationMiddlewares.createMatchingQueue(
    req,
    async (req: NextRequest, validatedData: CreateMatchingQueueInput) => {
      try {
        await connectDB();

        // Validate that user exists
        let user;
        if (validatedData.userId) {
          user = await User.findById(validatedData.userId);
        } else {
          user = await User.findOne({ socketId: validatedData.socketId });
        }

        if (!user) {
          throw new ApiError("User not found", 404);
        }

        // Check if user is already in queue
        const existingQueue = await MatchingQueue.findOne({
          $or: [
            { userId: validatedData.userId },
            { socketId: validatedData.socketId },
          ],
          status: { $in: ["waiting", "matching"] },
        });

        if (existingQueue) {
          // Update existing queue entry
          existingQueue.preferences = validatedData.preferences;
          existingQueue.interests = validatedData.interests || [];
          existingQueue.priority = validatedData.priority || 1;
          existingQueue.updatedAt = new Date();
          await existingQueue.save();

          return createSuccessResponse(
            existingQueue,
            "Updated position in matching queue",
            200
          );
        }

        // Create new queue entry
        const queueEntry = new MatchingQueue({
          ...validatedData,
          status: "waiting",
          joinedAt: new Date(),
        });

        await queueEntry.save();

        return createSuccessResponse(
          queueEntry,
          "Added to matching queue successfully",
          201
        );
      } catch (error) {
        console.error("Error adding to matching queue:", error);

        if (error instanceof ApiError) {
          return createErrorResponse(
            error.message,
            error.statusCode,
            error.errors
          );
        }

        return createErrorResponse("Failed to add to matching queue", 500);
      }
    }
  );
}

// GET method to find a match for the user
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const socketId = url.searchParams.get("socketId");

    if (!userId && !socketId) {
      throw new ApiError("Either userId or socketId is required", 400);
    }

    // Find user's queue entry
    const userQueue = await MatchingQueue.findOne({
      $or: [{ userId: userId }, { socketId: socketId }],
      status: "waiting",
    });

    if (!userQueue) {
      return createErrorResponse("User not in matching queue", 404);
    }

    // Try to find a match using the smart matching algorithm
    const potentialMatch = await MatchingQueue.findSmartMatch(userQueue);

    if (!potentialMatch) {
      return createSuccessResponse(
        null,
        "No match found yet, continue waiting",
        200
      );
    }

    // Update both queue entries to matched status
    await Promise.all([
      MatchingQueue.findByIdAndUpdate(userQueue._id, {
        status: "matched",
        matchedWith: potentialMatch._id,
      }),
      MatchingQueue.findByIdAndUpdate(potentialMatch._id, {
        status: "matched",
        matchedWith: userQueue._id,
      }),
    ]);

    return createSuccessResponse(
      {
        matchFound: true,
        user: userQueue,
        match: potentialMatch,
      },
      "Match found successfully",
      200
    );
  } catch (error) {
    console.error("Error finding match:", error);

    if (error instanceof ApiError) {
      return createErrorResponse(error.message, error.statusCode, error.errors);
    }

    return createErrorResponse("Failed to find match", 500);
  }
}
