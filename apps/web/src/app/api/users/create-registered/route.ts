// API route: /api/users/create-registered
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

        // Check if user already exists
        if (validatedData.email) {
          const existingUser = await User.findOne({
            email: validatedData.email,
          });
          if (existingUser) {
            throw new ApiError("User with this email already exists", 409);
          }
        }

        // Check username uniqueness
        if (validatedData.username) {
          const existingUsername = await User.findOne({
            username: validatedData.username,
          });
          if (existingUsername) {
            throw new ApiError("Username is already taken", 409);
          }
        }

        // Create the user
        const user = new User({
          ...validatedData,
          isAnonymous: false,
          isGuest: false,
        });
        await user.save();

        // Remove sensitive data from response
        const userResponse = user.toObject();
        delete userResponse.password;

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
