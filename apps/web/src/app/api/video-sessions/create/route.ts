// API route: /api/video-sessions/create
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import VideoSession from "@/models/videoSession.model";
import {
  ValidationMiddlewares,
  createSuccessResponse,
  createErrorResponse,
  ApiError,
} from "@/lib/apiValidation";
import { CreateVideoSessionInput } from "@/lib/validationSchemas";

export async function POST(req: NextRequest) {
  return ValidationMiddlewares.createVideoSession(
    req,
    async (req: NextRequest, validatedData: CreateVideoSessionInput) => {
      try {
        await connectDB();

        // Validate that users exist and are available
        const User = (await import("@/models/users.model")).default;

        const userQueries = [];

        // Check user1
        if (validatedData.participants.user1.userId) {
          userQueries.push(
            User.findById(validatedData.participants.user1.userId)
          );
        } else {
          userQueries.push(
            User.findOne({
              socketId: validatedData.participants.user1.socketId,
            })
          );
        }

        // Check user2 if provided
        if (validatedData.participants.user2) {
          if (validatedData.participants.user2.userId) {
            userQueries.push(
              User.findById(validatedData.participants.user2.userId)
            );
          } else {
            userQueries.push(
              User.findOne({
                socketId: validatedData.participants.user2.socketId,
              })
            );
          }
        }

        const users = await Promise.all(userQueries);
        const user1 = users[0];

        if (!user1) {
          throw new ApiError("User1 not found", 404);
        }

        // Check if users are already in a session
        const sessionQuery = {
          status: { $in: ["waiting", "connected"] },
          $or: [
            {
              "participants.user1.socketId":
                validatedData.participants.user1.socketId,
            },
            {
              "participants.user2.socketId":
                validatedData.participants.user1.socketId,
            },
          ],
        };

        if (validatedData.participants.user2) {
          sessionQuery.$or.push(
            {
              "participants.user1.socketId":
                validatedData.participants.user2.socketId,
            },
            {
              "participants.user2.socketId":
                validatedData.participants.user2.socketId,
            }
          );
        }

        const existingSession = await VideoSession.findOne(sessionQuery);

        if (existingSession) {
          throw new ApiError(
            "One or both users are already in an active session",
            409
          );
        }

        // Create video session
        const session = new VideoSession(validatedData);
        await session.save();

        return createSuccessResponse(
          session,
          "Video session created successfully",
          201
        );
      } catch (error) {
        console.error("Error creating video session:", error);

        if (error instanceof ApiError) {
          return createErrorResponse(
            error.message,
            error.statusCode,
            error.errors
          );
        }

        return createErrorResponse("Failed to create video session", 500);
      }
    }
  );
}
