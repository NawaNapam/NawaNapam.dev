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

const MessageSchema = new Schema<IMessage>(
  {
    content: { type: String, required: true, maxlength: 5000 },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "video"],
      default: "text",
      index: true,
    },
    fileUrl: { type: String, maxlength: 500 },
    fileName: { type: String, maxlength: 255 },
    fileSize: { type: Number, min: 0 },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    replyTo: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  {
    timestamps: true,
    _id: true,
  }
);

const ChatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
    ],
    messages: [MessageSchema],
    chatType: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
      index: true,
    },
    groupName: {
      type: String,
      maxlength: 100,
      trim: true,
      // Required only for group chats
      validate: {
        validator: function (this: IChat, v: string) {
          return (
            this.chatType === "direct" ||
            (this.chatType === "group" && Boolean(v))
          );
        },
        message: "Group name is required for group chats",
      },
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // Required only for group chats
      validate: {
        validator: function (this: IChat, v: mongoose.Types.ObjectId) {
          return (
            this.chatType === "direct" ||
            (this.chatType === "group" && Boolean(v))
          );
        },
        message: "Group admin is required for group chats",
      },
    },
    lastMessage: {
      content: { type: String, maxlength: 200 },
      senderId: { type: Schema.Types.ObjectId, ref: "User" },
      timestamp: { type: Date },
    },
    isActive: { type: Boolean, default: true, index: true },
    messageCount: { type: Number, default: 0, min: 0 },
    unreadCounts: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  {
    timestamps: true,
    // Optimize for common queries
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for better query performance
ChatSchema.index({ participants: 1, isActive: 1 });
ChatSchema.index({ "lastMessage.timestamp": -1 });
ChatSchema.index({ chatType: 1, isActive: 1 });
ChatSchema.index({ participants: 1, "lastMessage.timestamp": -1 });

// For pagination and sorting
ChatSchema.index({ updatedAt: -1 });
ChatSchema.index({ createdAt: -1 });

// Text search index for messages
ChatSchema.index({ "messages.content": "text" });

// Validation for participants
ChatSchema.pre("validate", function (this: IChat) {
  if (this.chatType === "direct" && this.participants.length !== 2) {
    throw new Error("Direct chats must have exactly 2 participants");
  }
  if (this.chatType === "group" && this.participants.length < 2) {
    throw new Error("Group chats must have at least 2 participants");
  }
});

// Instance methods
ChatSchema.methods.addMessage = function (
  senderId: mongoose.Types.ObjectId,
  content: string,
  messageType: "text" | "image" | "file" | "video" = "text"
) {
  const message: IMessage = {
    content: content.substring(0, 5000), // Enforce max length
    messageType,
  };

  this.messages.push(message);
  this.messageCount = this.messages.length;

  // Update last message
  this.lastMessage = {
    content: content.substring(0, 200),
    senderId,
    timestamp: new Date(),
  };

  // Update unread counts for other participants
  this.participants.forEach((participantId: mongoose.Types.ObjectId) => {
    if (!participantId.equals(senderId)) {
      const currentCount = this.unreadCounts.get(participantId.toString()) || 0;
      this.unreadCounts.set(participantId.toString(), currentCount + 1);
    }
  });

  this.updatedAt = new Date();
  return message;
};

ChatSchema.methods.markAsRead = function (userId: mongoose.Types.ObjectId) {
  this.unreadCounts.set(userId.toString(), 0);
};

ChatSchema.methods.getUnreadCount = function (userId: mongoose.Types.ObjectId) {
  return this.unreadCounts.get(userId.toString()) || 0;
};

// Static methods
ChatSchema.statics.findByParticipants = function (
  userIds: mongoose.Types.ObjectId[]
) {
  return this.find({
    participants: { $all: userIds },
    chatType: userIds.length === 2 ? "direct" : "group",
  });
};

ChatSchema.statics.findActiveChatsForUser = function (
  userId: mongoose.Types.ObjectId
) {
  return this.find({
    participants: userId,
    isActive: true,
  }).sort({ "lastMessage.timestamp": -1 });
};

export default models.Chat || model<IChat>("Chat", ChatSchema);
