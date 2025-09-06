import mongoose, { Document, model, models, Schema } from "mongoose";

// For random video chat platform like Omegle
export interface IVideoSession extends Document {
  sessionId: string; // Unique session identifier
  participants: {
    user1: {
      userId?: mongoose.Types.ObjectId; // Optional for anonymous users
      socketId: string;
      isAnonymous: boolean;
      nickname?: string;
      interests?: string[];
      location?: {
        country?: string;
        region?: string;
      };
    };
    user2?: {
      userId?: mongoose.Types.ObjectId;
      socketId: string;
      isAnonymous: boolean;
      nickname?: string;
      interests?: string[];
      location?: {
        country?: string;
        region?: string;
      };
    };
  };
  sessionType: "video" | "text" | "both";
  status: "waiting" | "connected" | "ended" | "disconnected";
  matchingCriteria: {
    interests?: string[];
    ageRange?: {
      min: number;
      max: number;
    };
    gender?: "male" | "female" | "any";
    location?: string;
  };
  connectionStartedAt?: Date;
  connectionEndedAt?: Date;
  duration?: number; // in seconds
  endReason?:
    | "user_disconnect"
    | "partner_disconnect"
    | "report"
    | "error"
    | "timeout";
  // Chat messages during video session
  messages: {
    senderId: string; // socket id or user id
    content: string;
    timestamp: Date;
    messageType: "text" | "emoji" | "system";
  }[];
  // Session metadata
  reportedBy?: string[]; // socket ids of users who reported
  isReported: boolean;
  quality?: {
    videoQuality: "low" | "medium" | "high";
    audioQuality: "low" | "medium" | "high";
    connectionIssues: number;
  };
}

const VideoSessionSchema = new Schema<IVideoSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    participants: {
      user1: {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        socketId: { type: String, required: true },
        isAnonymous: { type: Boolean, default: true },
        nickname: { type: String, maxlength: 50 },
        interests: [{ type: String, maxlength: 30 }],
        location: {
          country: { type: String, maxlength: 100 },
          region: { type: String, maxlength: 100 },
        },
      },
      user2: {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        socketId: { type: String },
        isAnonymous: { type: Boolean, default: true },
        nickname: { type: String, maxlength: 50 },
        interests: [{ type: String, maxlength: 30 }],
        location: {
          country: { type: String, maxlength: 100 },
          region: { type: String, maxlength: 100 },
        },
      },
    },
    sessionType: {
      type: String,
      enum: ["video", "text", "both"],
      default: "video",
      index: true,
    },
    status: {
      type: String,
      enum: ["waiting", "connected", "ended", "disconnected"],
      default: "waiting",
      index: true,
    },
    matchingCriteria: {
      interests: [{ type: String, maxlength: 30 }],
      ageRange: {
        min: { type: Number, min: 13, max: 100 },
        max: { type: Number, min: 13, max: 100 },
      },
      gender: { type: String, enum: ["male", "female", "any"], default: "any" },
      location: { type: String, maxlength: 100 },
    },
    connectionStartedAt: { type: Date },
    connectionEndedAt: { type: Date },
    duration: { type: Number, min: 0 }, // in seconds
    endReason: {
      type: String,
      enum: [
        "user_disconnect",
        "partner_disconnect",
        "report",
        "error",
        "timeout",
      ],
    },
    messages: [
      {
        senderId: { type: String, required: true },
        content: { type: String, required: true, maxlength: 1000 },
        timestamp: { type: Date, default: Date.now },
        messageType: {
          type: String,
          enum: ["text", "emoji", "system"],
          default: "text",
        },
      },
    ],
    reportedBy: [{ type: String }],
    isReported: { type: Boolean, default: false, index: true },
    quality: {
      videoQuality: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
      },
      audioQuality: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
      },
      connectionIssues: { type: Number, default: 0, min: 0 },
    },
  },
  {
    timestamps: true,
    expires: 86400, // Auto-delete after 24 hours
  }
);

// Indexes for efficient matching and querying
VideoSessionSchema.index({ status: 1, sessionType: 1 });
VideoSessionSchema.index({ "matchingCriteria.interests": 1 });
VideoSessionSchema.index({ "participants.user1.socketId": 1 });
VideoSessionSchema.index({ "participants.user2.socketId": 1 });
VideoSessionSchema.index({ createdAt: -1 });
VideoSessionSchema.index({ isReported: 1, status: 1 });

// Instance methods
VideoSessionSchema.methods.addMessage = function (
  senderId: string,
  content: string,
  messageType: string = "text"
) {
  this.messages.push({
    senderId,
    content: content.substring(0, 1000),
    timestamp: new Date(),
    messageType,
  });
};

VideoSessionSchema.methods.startConnection = function () {
  this.status = "connected";
  this.connectionStartedAt = new Date();
};

VideoSessionSchema.methods.endConnection = function (reason: string) {
  this.status = "ended";
  this.connectionEndedAt = new Date();
  this.endReason = reason;
  if (this.connectionStartedAt) {
    this.duration = Math.floor(
      (this.connectionEndedAt.getTime() - this.connectionStartedAt.getTime()) /
        1000
    );
  }
};

VideoSessionSchema.methods.reportSession = function (reporterSocketId: string) {
  if (!this.reportedBy.includes(reporterSocketId)) {
    this.reportedBy.push(reporterSocketId);
    this.isReported = true;
  }
};

// Static methods for matching
VideoSessionSchema.statics.findWaitingSessions = function (
  criteria: Record<string, unknown> = {}
) {
  return this.find({
    status: "waiting",
    "participants.user2": { $exists: false },
    ...criteria,
  }).sort({ createdAt: 1 });
};

VideoSessionSchema.statics.findBySocketId = function (socketId: string) {
  return this.findOne({
    $or: [
      { "participants.user1.socketId": socketId },
      { "participants.user2.socketId": socketId },
    ],
    status: { $in: ["waiting", "connected"] },
  });
};

export default models.VideoSession ||
  model<IVideoSession>("VideoSession", VideoSessionSchema);
