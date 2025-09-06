import mongoose, { Document, model, models, Schema } from "mongoose";

// Matching queue for random video chat platform
export interface IMatchingQueue extends Document {
  userId?: mongoose.Types.ObjectId; // Optional for anonymous users
  socketId: string; // Required for real-time matching
  sessionType: "video" | "text" | "both";
  isAnonymous: boolean;

  // User preferences for matching
  preferences: {
    ageRange: {
      min: number;
      max: number;
    };
    genderPreference: "male" | "female" | "any";
    interests: string[];
    locationMatch: boolean;
    languagePreference?: string[];
  };

  // User info for matching
  userInfo: {
    age?: number;
    gender?: "male" | "female" | "other";
    interests: string[];
    location?: {
      country?: string;
      region?: string;
    };
    language?: string;
  };

  // Queue management
  priority: number; // Higher priority = matched first
  waitingTime: number; // How long user has been waiting (seconds)
  retryCount: number; // Number of failed matches
  status: "waiting" | "matching" | "matched" | "cancelled";

  // Metadata
  joinedAt: Date;
  lastMatchAttempt?: Date;
  matchedWith?: string; // Socket ID of matched user

  // Performance tracking
  matchingCriteria: {
    exactMatch: boolean; // If looking for exact interest matches
    flexibleAge: boolean; // If age range can be extended
    flexibleLocation: boolean; // If location matching can be relaxed
  };
}

const MatchingQueueSchema = new Schema<IMatchingQueue>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    socketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sessionType: {
      type: String,
      enum: ["video", "text", "both"],
      default: "video",
      index: true,
    },
    isAnonymous: { type: Boolean, default: true, index: true },

    preferences: {
      ageRange: {
        min: { type: Number, default: 18, min: 13, max: 100 },
        max: { type: Number, default: 99, min: 13, max: 100 },
      },
      genderPreference: {
        type: String,
        enum: ["male", "female", "any"],
        default: "any",
        index: true,
      },
      interests: [{ type: String, maxlength: 30, lowercase: true }],
      locationMatch: { type: Boolean, default: false },
      languagePreference: [{ type: String, maxlength: 10 }],
    },

    userInfo: {
      age: { type: Number, min: 13, max: 100 },
      gender: { type: String, enum: ["male", "female", "other"] },
      interests: [{ type: String, maxlength: 30, lowercase: true }],
      location: {
        country: { type: String, maxlength: 100 },
        region: { type: String, maxlength: 100 },
      },
      language: { type: String, maxlength: 10 },
    },

    priority: { type: Number, default: 1, min: 1, max: 10, index: true },
    waitingTime: { type: Number, default: 0, min: 0 },
    retryCount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["waiting", "matching", "matched", "cancelled"],
      default: "waiting",
      index: true,
    },

    joinedAt: { type: Date, default: Date.now, index: true },
    lastMatchAttempt: { type: Date },
    matchedWith: { type: String },

    matchingCriteria: {
      exactMatch: { type: Boolean, default: false },
      flexibleAge: { type: Boolean, default: true },
      flexibleLocation: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    expires: 3600, // Auto-delete after 1 hour if not matched
  }
);

// Compound indexes for efficient matching
MatchingQueueSchema.index({
  status: 1,
  sessionType: 1,
  "preferences.genderPreference": 1,
  priority: -1,
  joinedAt: 1,
});

MatchingQueueSchema.index({
  "userInfo.interests": 1,
  status: 1,
});

MatchingQueueSchema.index({
  "userInfo.location.country": 1,
  status: 1,
});

MatchingQueueSchema.index({
  "userInfo.age": 1,
  status: 1,
});

// Pre-save middleware to update waiting time
MatchingQueueSchema.pre("save", function () {
  if (this.status === "waiting") {
    this.waitingTime = Math.floor(
      (Date.now() - this.joinedAt.getTime()) / 1000
    );

    // Increase priority based on waiting time
    if (this.waitingTime > 300) {
      // 5 minutes
      this.priority = Math.min(this.priority + 1, 10);
    }

    // Make matching more flexible after long wait
    if (this.waitingTime > 600) {
      // 10 minutes
      this.matchingCriteria.flexibleAge = true;
      this.matchingCriteria.flexibleLocation = true;
      this.matchingCriteria.exactMatch = false;
    }
  }
});

// Instance methods
MatchingQueueSchema.methods.updateWaitingTime = function () {
  this.waitingTime = Math.floor((Date.now() - this.joinedAt.getTime()) / 1000);

  // Adjust priority based on waiting time
  if (this.waitingTime > 120 && this.priority < 5) {
    // 2 minutes
    this.priority += 1;
  } else if (this.waitingTime > 300 && this.priority < 8) {
    // 5 minutes
    this.priority += 2;
  }
};

MatchingQueueSchema.methods.incrementRetry = function () {
  this.retryCount += 1;
  this.lastMatchAttempt = new Date();

  // Increase priority after failed matches
  if (this.retryCount > 2 && this.priority < 10) {
    this.priority += 1;
  }
};

MatchingQueueSchema.methods.setMatched = function (partnerSocketId: string) {
  this.status = "matched";
  this.matchedWith = partnerSocketId;
};

// Static methods for matching algorithm
MatchingQueueSchema.statics.findBestMatch = function (
  userEntry: IMatchingQueue
) {
  const pipeline = [
    // Match basic criteria
    {
      $match: {
        socketId: { $ne: userEntry.socketId },
        status: "waiting",
        sessionType: userEntry.sessionType,
        // Gender preference matching
        $or: [
          { "preferences.genderPreference": "any" },
          { "preferences.genderPreference": userEntry.userInfo.gender },
          { "userInfo.gender": userEntry.preferences.genderPreference },
          {
            $and: [
              {
                "preferences.genderPreference":
                  userEntry.preferences.genderPreference,
              },
              { "userInfo.gender": userEntry.userInfo.gender },
            ],
          },
        ],
      },
    },

    // Add matching score
    {
      $addFields: {
        matchScore: {
          $add: [
            // Interest matching score (0-50 points)
            {
              $multiply: [
                {
                  $size: {
                    $setIntersection: [
                      "$userInfo.interests",
                      userEntry.userInfo.interests,
                    ],
                  },
                },
                10,
              ],
            },

            // Location matching score (0-20 points)
            {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        "$userInfo.location.country",
                        userEntry.userInfo.location?.country,
                      ],
                    },
                    { $ne: [userEntry.userInfo.location?.country, null] },
                  ],
                },
                20,
                0,
              ],
            },

            // Age compatibility score (0-20 points)
            {
              $cond: [
                {
                  $and: [
                    {
                      $gte: [
                        userEntry.userInfo.age,
                        "$preferences.ageRange.min",
                      ],
                    },
                    {
                      $lte: [
                        userEntry.userInfo.age,
                        "$preferences.ageRange.max",
                      ],
                    },
                    {
                      $gte: [
                        "$userInfo.age",
                        userEntry.preferences.ageRange.min,
                      ],
                    },
                    {
                      $lte: [
                        "$userInfo.age",
                        userEntry.preferences.ageRange.max,
                      ],
                    },
                  ],
                },
                20,
                0,
              ],
            },

            // Priority bonus (0-10 points)
            "$priority",
          ],
        },
      },
    },

    // Sort by match score and waiting time
    {
      $sort: {
        matchScore: -1 as const,
        waitingTime: -1 as const,
        joinedAt: 1 as const,
      },
    },

    { $limit: 1 },
  ];

  return this.aggregate(pipeline);
};

MatchingQueueSchema.statics.findWaitingUsers = function (sessionType?: string) {
  const query: Record<string, unknown> = { status: "waiting" };
  if (sessionType) {
    query.sessionType = sessionType;
  }

  return this.find(query)
    .sort({ priority: -1, waitingTime: -1, joinedAt: 1 })
    .limit(100);
};

MatchingQueueSchema.statics.removeFromQueue = function (socketId: string) {
  return this.findOneAndDelete({ socketId });
};

MatchingQueueSchema.statics.updateQueuePosition = function () {
  // Update waiting times and priorities for all waiting users
  return this.updateMany({ status: "waiting" }, [
    {
      $set: {
        waitingTime: {
          $divide: [{ $subtract: [new Date(), "$joinedAt"] }, 1000],
        },
      },
    },
  ]);
};

export default models.MatchingQueue ||
  model<IMatchingQueue>("MatchingQueue", MatchingQueueSchema);
