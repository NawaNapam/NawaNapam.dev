import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  // Basic info (optional for anonymous users)
  username?: string; // Unique username for registered users
  email?: string; // Only for registered users
  password?: string; // Only for registered users
  isAnonymous: boolean; // True for guest users

  // Profile info
  nickname?: string; // Display name (can be random for anonymous)
  avatar?: string; // Profile image URL
  age?: number;
  gender?: "male" | "female" | "other";
  bio?: string;

  // Location (for matching)
  location?: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
  };

  // Interests for matching
  interests: string[]; // Array of interests for better matching

  // Platform preferences
  preferences: {
    sessionType: "video" | "text" | "both";
    ageRange: {
      min: number;
      max: number;
    };
    genderPreference: "male" | "female" | "any";
    locationMatch: boolean; // Match with users from same country/region
    interestMatch: boolean; // Match based on common interests
    languagePreference?: string[];
  };

  // Session history and stats
  sessionStats: {
    totalSessions: number;
    totalDuration: number; // in seconds
    averageSessionDuration: number;
    reportsReceived: number;
    reportsGiven: number;
    lastSessionAt?: Date;
  };

  // Account status
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: Date;

  // Registration info (only for registered users)
  emailVerified?: boolean;
  registeredAt?: Date;
  lastLoginAt?: Date;

  // Privacy and safety
  blockedUsers: mongoose.Types.ObjectId[]; // Blocked user IDs
  reportHistory: {
    reportedUserId: mongoose.Types.ObjectId;
    reason: string;
    timestamp: Date;
  }[];

  // Connection info (for active sessions)
  currentSocketId?: string;
  isOnline: boolean;
  lastSeenAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows null for anonymous users
      trim: true,
      maxlength: 30,
      match: /^[a-zA-Z0-9_]+$/, // Only alphanumeric and underscore
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows null for anonymous users
      lowercase: true,
      trim: true,
      maxlength: 100,
      validate: {
        validator: function (v: string) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    isAnonymous: { type: Boolean, default: true, index: true },

    nickname: { type: String, trim: true, maxlength: 50 },
    avatar: { type: String, maxlength: 500 },
    age: { type: Number, min: 13, max: 100 },
    gender: { type: String, enum: ["male", "female", "other"] },
    bio: { type: String, maxlength: 500 },

    location: {
      country: { type: String, trim: true, maxlength: 100 },
      region: { type: String, trim: true, maxlength: 100 },
      city: { type: String, trim: true, maxlength: 100 },
      timezone: { type: String, maxlength: 50 },
    },

    interests: [
      {
        type: String,
        maxlength: 30,
        lowercase: true,
        trim: true,
      },
    ],

    preferences: {
      sessionType: {
        type: String,
        enum: ["video", "text", "both"],
        default: "video",
      },
      ageRange: {
        min: { type: Number, default: 18, min: 13, max: 100 },
        max: { type: Number, default: 99, min: 13, max: 100 },
      },
      genderPreference: {
        type: String,
        enum: ["male", "female", "any"],
        default: "any",
      },
      locationMatch: { type: Boolean, default: false },
      interestMatch: { type: Boolean, default: true },
      languagePreference: [{ type: String, maxlength: 10 }],
    },

    sessionStats: {
      totalSessions: { type: Number, default: 0, min: 0 },
      totalDuration: { type: Number, default: 0, min: 0 },
      averageSessionDuration: { type: Number, default: 0, min: 0 },
      reportsReceived: { type: Number, default: 0, min: 0 },
      reportsGiven: { type: Number, default: 0, min: 0 },
      lastSessionAt: { type: Date },
    },

    isActive: { type: Boolean, default: true, index: true },
    isBanned: { type: Boolean, default: false, index: true },
    banReason: { type: String, maxlength: 500 },
    banExpiresAt: { type: Date },

    emailVerified: { type: Boolean, default: false },
    registeredAt: { type: Date },
    lastLoginAt: { type: Date },

    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reportHistory: [
      {
        reportedUserId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        reason: { type: String, required: true, maxlength: 500 },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    currentSocketId: { type: String, index: true },
    isOnline: { type: Boolean, default: false, index: true },
    lastSeenAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Don't return sensitive info
        delete ret.password;
        delete ret.email; // Hide email for privacy
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient matching and querying
UserSchema.index({ isAnonymous: 1, isActive: 1 });
UserSchema.index({ isOnline: 1, isActive: 1 });
UserSchema.index({ interests: 1 });
UserSchema.index({ "location.country": 1 });
UserSchema.index({ age: 1, gender: 1 });
UserSchema.index({ currentSocketId: 1 });
UserSchema.index({ isBanned: 1, banExpiresAt: 1 });
UserSchema.index({ "preferences.genderPreference": 1 });

// TTL index for anonymous users (auto-delete after 24 hours of inactivity)
UserSchema.index(
  { lastSeenAt: 1 },
  {
    expireAfterSeconds: 86400, // 24 hours
    partialFilterExpression: { isAnonymous: true, isOnline: false },
  }
);

// Virtual for display name
UserSchema.virtual("displayName").get(function () {
  return this.nickname || this.username || "Anonymous";
});

// Instance methods
UserSchema.methods.updateSessionStats = function (duration: number) {
  this.sessionStats.totalSessions += 1;
  this.sessionStats.totalDuration += duration;
  this.sessionStats.averageSessionDuration = Math.round(
    this.sessionStats.totalDuration / this.sessionStats.totalSessions
  );
  this.sessionStats.lastSessionAt = new Date();
};

UserSchema.methods.blockUser = function (userId: mongoose.Types.ObjectId) {
  if (!this.blockedUsers.includes(userId)) {
    this.blockedUsers.push(userId);
  }
};

UserSchema.methods.reportUser = function (
  userId: mongoose.Types.ObjectId,
  reason: string
) {
  this.reportHistory.push({
    reportedUserId: userId,
    reason: reason.substring(0, 500),
    timestamp: new Date(),
  });
  this.sessionStats.reportsGiven += 1;
};

UserSchema.methods.setOnline = function (socketId: string) {
  this.isOnline = true;
  this.currentSocketId = socketId;
  this.lastSeenAt = new Date();
  this.lastLoginAt = new Date();
};

UserSchema.methods.setOffline = function () {
  this.isOnline = false;
  this.currentSocketId = undefined;
  this.lastSeenAt = new Date();
};

UserSchema.methods.canMatch = function (otherUser: IUser): boolean {
  // Check if users are banned
  if (this.isBanned || otherUser.isBanned) return false;

  // Check if users blocked each other
  if (
    this.blockedUsers.includes(otherUser._id) ||
    otherUser.blockedUsers.includes(this._id)
  )
    return false;

  // Check age preferences
  if (this.age && otherUser.preferences.ageRange) {
    if (
      this.age < otherUser.preferences.ageRange.min ||
      this.age > otherUser.preferences.ageRange.max
    )
      return false;
  }

  // Check gender preferences
  if (this.gender && otherUser.preferences.genderPreference !== "any") {
    if (this.gender !== otherUser.preferences.genderPreference) return false;
  }

  return true;
};

// Static methods
UserSchema.statics.createAnonymousUser = function (
  socketId: string,
  preferences = {}
) {
  const randomNickname = "Guest" + Math.random().toString(36).substr(2, 6);

  return new this({
    isAnonymous: true,
    nickname: randomNickname,
    currentSocketId: socketId,
    isOnline: true,
    preferences: {
      sessionType: "video",
      ageRange: { min: 18, max: 99 },
      genderPreference: "any",
      locationMatch: false,
      interestMatch: true,
      ...preferences,
    },
  });
};

UserSchema.statics.findForMatching = function (user: IUser, limit = 50) {
  const query: Record<string, unknown> = {
    _id: { $ne: user._id },
    isOnline: true,
    isActive: true,
    isBanned: false,
    blockedUsers: { $nin: [user._id] },
  };

  // Gender preference
  if (user.preferences.genderPreference !== "any") {
    query.gender = user.preferences.genderPreference;
  }

  // Age preference
  if (user.preferences.ageRange) {
    query.age = {
      $gte: user.preferences.ageRange.min,
      $lte: user.preferences.ageRange.max,
    };
  }

  // Location preference
  if (user.preferences.locationMatch && user.location?.country) {
    query["location.country"] = user.location.country;
  }

  return this.find(query).limit(limit);
};

UserSchema.statics.findOnlineUsers = function () {
  return this.find({
    isOnline: true,
    isActive: true,
    isBanned: false,
  });
};

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

const UserSchema = new Schema<IUser>(
  {
    name: {
      first: { type: String, trim: true, maxlength: 50 },
      middle: { type: String, trim: true, maxlength: 50 },
      last: { type: String, trim: true, maxlength: 50 },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // Don't include password in queries by default
    },
    image: { type: String, maxlength: 500 },
    isAdmin: { type: Boolean, default: false, index: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    chatReferences: [
      {
        chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
        lastMessage: { type: String, maxlength: 200 },
        lastMessageAt: { type: Date },
        unreadCount: { type: Number, default: 0, min: 0 },
      },
    ],
    provider: { type: String, default: "credentials" },
    location: {
      city: { type: String, trim: true, maxlength: 100 },
      country: { type: String, trim: true, maxlength: 100 },
    },
    subscriptionDetails: { type: Schema.Types.ObjectId, ref: "Subscription" },
    isActive: { type: Boolean, default: true, index: true },
    lastLoginAt: { type: Date },
    emailVerified: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    // Optimize for common queries
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ isActive: 1, isAdmin: 1 });
UserSchema.index({ "chatReferences.chatId": 1 });
UserSchema.index({ subscriptionDetails: 1 });
UserSchema.index({ provider: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for full name
UserSchema.virtual("fullName").get(function () {
  if (!this.name) return "";
  const { first = "", middle = "", last = "" } = this.name;
  return [first, middle, last].filter(Boolean).join(" ").trim();
});

// Instance methods
UserSchema.methods.getActiveChatCount = function () {
  return this.chatReferences?.length || 0;
};

UserSchema.methods.addChatReference = function (
  chatId: mongoose.Types.ObjectId,
  lastMessage?: string
) {
  if (!this.chatReferences) this.chatReferences = [];

  const existingRef = this.chatReferences.find(
    (ref: IChatReference) => ref.chatId.toString() === chatId.toString()
  );
  if (!existingRef) {
    this.chatReferences.push({
      chatId,
      lastMessage: lastMessage?.substring(0, 200),
      lastMessageAt: new Date(),
      unreadCount: 0,
    });
  }
};

// Static methods
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true });
};

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
