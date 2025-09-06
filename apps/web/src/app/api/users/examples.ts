// Example API route: /api/users/create
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/users.model";
import {
  ValidationMiddlewares,
  createSuccessResponse,
  createErrorResponse,
  ApiError,
} from "@/lib/apiValidation";
import { CreateUserInput } from "@/lib/validationSchemas";

export async function POST(req: NextRequest) {
  return ValidationMiddlewares.createUser(
    req,
    async (req: NextRequest, validatedData: CreateUserInput) => {
      try {
        await connectDB();

        // Check if user already exists (for registered users)
        if (!validatedData.isAnonymous && validatedData.email) {
          const existingUser = await User.findOne({
            email: validatedData.email,
          });
          if (existingUser) {
            throw new ApiError("User with this email already exists", 409);
          }
        }

        // Check username uniqueness (for registered users)
        if (!validatedData.isAnonymous && validatedData.username) {
          const existingUsername = await User.findOne({
            username: validatedData.username,
          });
          if (existingUsername) {
            throw new ApiError("Username is already taken", 409);
          }
        }

        // Create the user
        const user = new User(validatedData);
        await user.save();

        // Remove sensitive data from response
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.email; // For privacy

        return createSuccessResponse(
          userResponse,
          "User created successfully",
          201
        );
      } catch (error) {
        console.error("Error creating user:", error);

        if (error instanceof ApiError) {
          return createErrorResponse(
            error.message,
            error.statusCode,
            error.errors
          );
        }

        return createErrorResponse("Failed to create user", 500);
      }
    }
  );
}

// Example API route: /api/users/anonymous
import { AnonymousUserInput } from "@/lib/validationSchemas";

export async function POST(req: NextRequest) {
  return ValidationMiddlewares.createAnonymousUser(
    req,
    async (req: NextRequest, validatedData: AnonymousUserInput) => {
      try {
        await connectDB();

        // Create anonymous user
        const user = await User.createAnonymousUser(
          validatedData.socketId,
          validatedData.preferences
        );

        if (validatedData.nickname) {
          user.nickname = validatedData.nickname;
        }

        if (validatedData.interests && validatedData.interests.length > 0) {
          user.interests = validatedData.interests;
        }

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
