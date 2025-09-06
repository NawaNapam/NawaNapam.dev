import { z } from "zod";

// Common validation patterns
const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const usernamePattern = /^[a-zA-Z0-9_]{3,30}$/;
const socketIdPattern = /^[a-zA-Z0-9_-]+$/;

// Base validation schemas
export const ValidationSchemas = {
  // ObjectId validation
  objectId: z.string().regex(objectIdPattern, "Invalid ObjectId format"),

  // User validation
  user: {
    create: z
      .object({
        username: z
          .string()
          .min(3, "Username must be at least 3 characters")
          .max(30, "Username must not exceed 30 characters")
          .regex(
            usernamePattern,
            "Username can only contain letters, numbers, and underscores"
          )
          .optional(),

        email: z
          .string()
          .email("Invalid email format")
          .max(100, "Email must not exceed 100 characters")
          .optional(),

        password: z
          .string()
          .min(6, "Password must be at least 6 characters")
          .max(128, "Password must not exceed 128 characters")
          .optional(),

        isAnonymous: z.boolean().default(true),

        nickname: z
          .string()
          .min(1, "Nickname is required")
          .max(50, "Nickname must not exceed 50 characters")
          .trim()
          .optional(),

        avatar: z
          .string()
          .url("Avatar must be a valid URL")
          .max(500, "Avatar URL must not exceed 500 characters")
          .optional(),

        age: z
          .number()
          .int("Age must be a whole number")
          .min(13, "Must be at least 13 years old")
          .max(100, "Age must not exceed 100")
          .optional(),

        gender: z.enum(["male", "female", "other"]).optional(),

        bio: z
          .string()
          .max(500, "Bio must not exceed 500 characters")
          .trim()
          .optional(),

        location: z
          .object({
            country: z.string().max(100).trim().optional(),
            region: z.string().max(100).trim().optional(),
            city: z.string().max(100).trim().optional(),
            timezone: z.string().max(50).optional(),
          })
          .optional(),

        interests: z
          .array(
            z
              .string()
              .min(1, "Interest cannot be empty")
              .max(30, "Interest must not exceed 30 characters")
              .trim()
              .toLowerCase()
          )
          .max(20, "Cannot have more than 20 interests"),

        preferences: z.object({
          sessionType: z.enum(["video", "text", "both"]).default("video"),
          ageRange: z
            .object({
              min: z.number().int().min(13).max(100).default(18),
              max: z.number().int().min(13).max(100).default(99),
            })
            .refine((data) => data.min <= data.max, {
              message: "Minimum age must be less than or equal to maximum age",
            }),
          genderPreference: z.enum(["male", "female", "any"]).default("any"),
          locationMatch: z.boolean().default(false),
          interestMatch: z.boolean().default(true),
          languagePreference: z.array(z.string().max(10)).max(5).optional(),
        }),
      })
      .refine(
        (data) => {
          // If not anonymous, email and username are required
          if (!data.isAnonymous) {
            return data.email && data.username;
          }
          return true;
        },
        {
          message: "Email and username are required for registered users",
        }
      ),

    update: z.object({
      username: z.string().min(3).max(30).regex(usernamePattern).optional(),
      email: z.string().email().max(100).optional(),
      nickname: z.string().min(1).max(50).trim().optional(),
      avatar: z.string().url().max(500).optional(),
      age: z.number().int().min(13).max(100).optional(),
      gender: z.enum(["male", "female", "other"]).optional(),
      bio: z.string().max(500).trim().optional(),
      location: z
        .object({
          country: z.string().max(100).trim().optional(),
          region: z.string().max(100).trim().optional(),
          city: z.string().max(100).trim().optional(),
          timezone: z.string().max(50).optional(),
        })
        .optional(),
      interests: z
        .array(z.string().min(1).max(30).trim().toLowerCase())
        .max(20)
        .optional(),
      preferences: z
        .object({
          sessionType: z.enum(["video", "text", "both"]).optional(),
          ageRange: z
            .object({
              min: z.number().int().min(13).max(100),
              max: z.number().int().min(13).max(100),
            })
            .refine((data) => data.min <= data.max)
            .optional(),
          genderPreference: z.enum(["male", "female", "any"]).optional(),
          locationMatch: z.boolean().optional(),
          interestMatch: z.boolean().optional(),
          languagePreference: z.array(z.string().max(10)).max(5).optional(),
        })
        .optional(),
    }),

    // without registration
    anonymous: z.object({
      socketId: z
        .string()
        .min(1, "Socket ID is required")
        .regex(socketIdPattern, "Invalid socket ID format"),
      nickname: z.string().max(50).trim().optional(),
      interests: z
        .array(z.string().min(1).max(30).trim().toLowerCase())
        .max(10)
        .default([]),
      preferences: z
        .object({
          sessionType: z.enum(["video", "text", "both"]).default("video"),
          ageRange: z.object({
            min: z.number().int().min(13).max(100).default(18),
            max: z.number().int().min(13).max(100).default(99),
          }),
          genderPreference: z.enum(["male", "female", "any"]).default("any"),
          locationMatch: z.boolean().default(false),
          interestMatch: z.boolean().default(true),
        })
        .default(() => ({
          sessionType: "video" as const,
          ageRange: { min: 18, max: 99 },
          genderPreference: "any" as const,
          locationMatch: false,
          interestMatch: true,
        })),
    }),
  },

  // Video Session validation
  videoSession: {
    create: z.object({
      sessionId: z
        .string()
        .min(1, "Session ID is required")
        .max(100, "Session ID too long"),

      participants: z.object({
        user1: z.object({
          userId: z.string().regex(objectIdPattern).optional(),
          socketId: z
            .string()
            .min(1, "Socket ID is required")
            .regex(socketIdPattern),
          isAnonymous: z.boolean().default(true),
          nickname: z.string().max(50).trim().optional(),
          interests: z.array(z.string().max(30)).max(20).optional(),
          location: z
            .object({
              country: z.string().max(100).optional(),
              region: z.string().max(100).optional(),
            })
            .optional(),
        }),
        user2: z
          .object({
            userId: z.string().regex(objectIdPattern).optional(),
            socketId: z.string().min(1).regex(socketIdPattern),
            isAnonymous: z.boolean().default(true),
            nickname: z.string().max(50).trim().optional(),
            interests: z.array(z.string().max(30)).max(20).optional(),
            location: z
              .object({
                country: z.string().max(100).optional(),
                region: z.string().max(100).optional(),
              })
              .optional(),
          })
          .optional(),
      }),

      sessionType: z.enum(["video", "text", "both"]).default("video"),
      status: z
        .enum(["waiting", "connected", "ended", "disconnected"])
        .default("waiting"),

      matchingCriteria: z
        .object({
          interests: z.array(z.string().max(30)).max(20).optional(),
          ageRange: z
            .object({
              min: z.number().int().min(13).max(100),
              max: z.number().int().min(13).max(100),
            })
            .refine((data) => data.min <= data.max)
            .optional(),
          gender: z.enum(["male", "female", "any"]).optional(),
          location: z.string().max(100).optional(),
        })
        .optional(),
    }),

    addMessage: z.object({
      senderId: z.string().min(1, "Sender ID is required"),
      content: z
        .string()
        .min(1, "Message content is required")
        .max(1000, "Message too long")
        .trim(),
      messageType: z.enum(["text", "emoji", "system"]).default("text"),
    }),

    updateStatus: z.object({
      status: z.enum(["waiting", "connected", "ended", "disconnected"]),
      endReason: z
        .enum([
          "user_disconnect",
          "partner_disconnect",
          "report",
          "error",
          "timeout",
        ])
        .optional(),
    }),
  },

  // Matching Queue validation
  matchingQueue: {
    create: z.object({
      userId: z.string().regex(objectIdPattern).optional(),
      socketId: z.string().min(1).regex(socketIdPattern),
      sessionType: z.enum(["video", "text", "both"]).default("video"),
      isAnonymous: z.boolean().default(true),

      preferences: z.object({
        ageRange: z
          .object({
            min: z.number().int().min(13).max(100).default(18),
            max: z.number().int().min(13).max(100).default(99),
          })
          .refine((data) => data.min <= data.max),
        genderPreference: z.enum(["male", "female", "any"]).default("any"),
        interests: z
          .array(z.string().max(30).toLowerCase())
          .max(20)
          .default([]),
        locationMatch: z.boolean().default(false),
        languagePreference: z.array(z.string().max(10)).max(5).optional(),
      }),

      userInfo: z.object({
        age: z.number().int().min(13).max(100).optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        interests: z
          .array(z.string().max(30).toLowerCase())
          .max(20)
          .default([]),
        location: z
          .object({
            country: z.string().max(100).optional(),
            region: z.string().max(100).optional(),
          })
          .optional(),
        language: z.string().max(10).optional(),
      }),

      priority: z.number().int().min(1).max(10).default(1),
    }),
  },

  // Report validation
  report: {
    create: z
      .object({
        reporterSocketId: z.string().min(1).regex(socketIdPattern),
        reportedSocketId: z.string().min(1).regex(socketIdPattern).optional(),
        reportedUserId: z.string().regex(objectIdPattern).optional(),
        sessionId: z.string().min(1).optional(),

        reportType: z.enum([
          "inappropriate_content",
          "harassment",
          "spam",
          "nudity",
          "violence",
          "underage",
          "other",
        ]),

        description: z
          .string()
          .min(10, "Description must be at least 10 characters")
          .max(2000, "Description too long")
          .trim(),

        severity: z
          .enum(["low", "medium", "high", "critical"])
          .default("medium"),

        screenshots: z
          .array(z.string().url("Invalid screenshot URL").max(500))
          .max(5, "Maximum 5 screenshots allowed")
          .optional(),

        chatLogs: z
          .array(
            z.object({
              timestamp: z.date(),
              senderId: z.string().min(1),
              message: z.string().max(1000),
            })
          )
          .max(50, "Maximum 50 chat logs allowed")
          .optional(),
      })
      .refine(
        (data) => {
          // Must have either reportedSocketId or reportedUserId
          return data.reportedSocketId || data.reportedUserId;
        },
        {
          message: "Either reportedSocketId or reportedUserId is required",
        }
      ),
  },

  // Subscription validation
  subscription: {
    create: z.object({
      userId: z.string().regex(objectIdPattern),
      planName: z.string().min(1).max(100),
      billingCycle: z.enum(["monthly", "yearly"]).default("monthly"),
      paymentMethod: z.string().max(50).optional(),
      autoRenew: z.boolean().default(true),
    }),

    usage: z.object({
      sessionType: z.enum(["video", "text"]),
      duration: z.number().min(0).max(86400), // Max 24 hours per session
      action: z.enum(["start", "end"]),
    }),
  },
};

// Type exports for use in controllers
export type CreateUserInput = z.infer<typeof ValidationSchemas.user.create>;
export type UpdateUserInput = z.infer<typeof ValidationSchemas.user.update>;
export type AnonymousUserInput = z.infer<
  typeof ValidationSchemas.user.anonymous
>;
export type CreateVideoSessionInput = z.infer<
  typeof ValidationSchemas.videoSession.create
>;
export type AddMessageInput = z.infer<
  typeof ValidationSchemas.videoSession.addMessage
>;
export type CreateMatchingQueueInput = z.infer<
  typeof ValidationSchemas.matchingQueue.create
>;
export type CreateReportInput = z.infer<typeof ValidationSchemas.report.create>;

// Validation middleware helper
export const validateInput = <T>(schema: z.ZodSchema<T>) => {
  return (
    data: unknown
  ): { success: true; data: T } | { success: false; errors: string[] } => {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(
          (err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`
        );
        return { success: false, errors };
      }
      return { success: false, errors: ["Unknown validation error"] };
    }
  };
};

// Custom validation functions for business logic
export const CustomValidators = {
  // Check if age preferences are compatible
  isAgeRangeCompatible: (
    userAge: number,
    targetAgeRange: { min: number; max: number }
  ): boolean => {
    return userAge >= targetAgeRange.min && userAge <= targetAgeRange.max;
  },

  // Validate session duration
  isValidSessionDuration: (duration: number): boolean => {
    return duration >= 0 && duration <= 86400; // Max 24 hours
  },

  // Check if interests have common elements
  hasCommonInterests: (interests1: string[], interests2: string[]): boolean => {
    return interests1.some((interest) => interests2.includes(interest));
  },

  // Validate nickname for appropriateness (basic check)
  isAppropriateNickname: (nickname: string): boolean => {
    const inappropriateWords = [
      "admin",
      "moderator",
      "omegle",
      "test",
      "null",
      "undefined",
    ];
    const lowerNickname = nickname.toLowerCase();
    return !inappropriateWords.some((word) => lowerNickname.includes(word));
  },

  // Check if user can create new session (rate limiting)
  canCreateNewSession: (
    lastSessionTime: Date | undefined,
    cooldownMinutes: number = 1
  ): boolean => {
    if (!lastSessionTime) return true;
    const now = new Date();
    const timeDiff = now.getTime() - lastSessionTime.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    return minutesDiff >= cooldownMinutes;
  },
};

// Error messages for common validation failures
export const ValidationMessages = {
  INVALID_EMAIL: "Please provide a valid email address",
  WEAK_PASSWORD: "Password must be at least 6 characters long",
  INVALID_AGE: "Age must be between 13 and 100",
  TOO_MANY_INTERESTS: "You can have at most 20 interests",
  INAPPROPRIATE_CONTENT: "Content contains inappropriate language",
  RATE_LIMITED: "Please wait before starting a new session",
  INVALID_SESSION: "Invalid session data provided",
  UNAUTHORIZED: "You are not authorized to perform this action",
  SESSION_EXPIRED: "Your session has expired, please refresh",
};
