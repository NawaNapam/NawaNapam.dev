// API route: /api/users/create-anonymous
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/users.model";
import {
  ValidationMiddlewares,
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/apiValidation";
import { AnonymousUserInput } from "@/lib/validationSchemas";

export async function POST(req: NextRequest) {
  return ValidationMiddlewares.createAnonymousUser(
    req,
    async (req: NextRequest, validatedData: AnonymousUserInput) => {
      try {
        await connectDB();

        // Create anonymous user
        const userData = {
          isAnonymous: true,
          isGuest: true,
          socketId: validatedData.socketId,
          preferences: validatedData.preferences,
          nickname: validatedData.nickname,
          interests: validatedData.interests || [],
          // Auto-expire anonymous users after 24 hours
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };

        const user = new User(userData);
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        return createSuccessResponse(
          userResponse,
          "Anonymous user created successfully",
          201
        );
      } catch (error) {
        console.error("Error creating anonymous user:", error);
        return createErrorResponse("Failed to create anonymous user", 500);
      }
    }
  );
}
