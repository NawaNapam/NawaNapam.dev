import mongoose, { Document, model, models, Schema } from "mongoose";

// Report system for safety and moderation in random video chat
export interface IReport extends Document {
  // Reporter info
  reporterId?: mongoose.Types.ObjectId; // Optional for anonymous users
  reporterSocketId: string;
  reporterIP?: string; // For tracking anonymous reports

  // Reported user info
  reportedUserId?: mongoose.Types.ObjectId;
  reportedSocketId?: string;

  // Session info
  sessionId?: string; // Video session where incident occurred

  // Report details
  reportType:
    | "inappropriate_content"
    | "harassment"
    | "spam"
    | "nudity"
    | "violence"
    | "underage"
    | "other";
  description: string;
  severity: "low" | "medium" | "high" | "critical";

  // Evidence
  screenshots?: string[]; // URLs to uploaded screenshots
  chatLogs?: {
    timestamp: Date;
    senderId: string;
    message: string;
  }[];

  // Status and resolution
  status: "pending" | "under_review" | "resolved" | "dismissed" | "escalated";
  reviewedBy?: mongoose.Types.ObjectId; // Admin/moderator who reviewed
  reviewedAt?: Date;
  resolution?: string;
  actionTaken?: "warning" | "temporary_ban" | "permanent_ban" | "no_action";

  // Metadata
  priority: number; // 1-10, higher = more urgent
  isValidated: boolean; // If report has been validated by system
  duplicateOf?: mongoose.Types.ObjectId; // If this is a duplicate report
  relatedReports: mongoose.Types.ObjectId[]; // Related reports about same user
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: "User" },
    reporterSocketId: { type: String, required: true, index: true },
    reporterIP: { type: String, maxlength: 45 }, // IPv6 support

    reportedUserId: { type: Schema.Types.ObjectId, ref: "User" },
    reportedSocketId: { type: String, index: true },

    sessionId: { type: String, index: true },

    reportType: {
      type: String,
      enum: [
        "inappropriate_content",
        "harassment",
        "spam",
        "nudity",
        "violence",
        "underage",
        "other",
      ],
      required: true,
      index: true,
    },
    description: { type: String, required: true, maxlength: 2000 },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      index: true,
    },

    screenshots: [{ type: String, maxlength: 500 }],
    chatLogs: [
      {
        timestamp: { type: Date, required: true },
        senderId: { type: String, required: true },
        message: { type: String, required: true, maxlength: 1000 },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "under_review", "resolved", "dismissed", "escalated"],
      default: "pending",
      index: true,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    resolution: { type: String, maxlength: 1000 },
    actionTaken: {
      type: String,
      enum: ["warning", "temporary_ban", "permanent_ban", "no_action"],
    },

    priority: { type: Number, default: 5, min: 1, max: 10, index: true },
    isValidated: { type: Boolean, default: false, index: true },
    duplicateOf: { type: Schema.Types.ObjectId, ref: "Report" },
    relatedReports: [{ type: Schema.Types.ObjectId, ref: "Report" }],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
ReportSchema.index({ status: 1, priority: -1, createdAt: -1 });
ReportSchema.index({ reportedUserId: 1, status: 1 });
ReportSchema.index({ reportType: 1, severity: 1 });
ReportSchema.index({ sessionId: 1 });

// Pre-save middleware to set priority based on report type and severity
ReportSchema.pre("save", function () {
  if (this.isNew) {
    // Auto-set priority based on severity and type
    let basePriority = 5;

    // Severity modifiers
    switch (this.severity) {
      case "critical":
        basePriority = 10;
        break;
      case "high":
        basePriority = 8;
        break;
      case "medium":
        basePriority = 5;
        break;
      case "low":
        basePriority = 3;
        break;
    }

    // Type modifiers
    switch (this.reportType) {
      case "underage":
      case "violence":
        basePriority = Math.max(basePriority, 9);
        break;
      case "nudity":
      case "harassment":
        basePriority = Math.max(basePriority, 7);
        break;
      case "inappropriate_content":
        basePriority = Math.max(basePriority, 6);
        break;
    }

    this.priority = Math.min(basePriority, 10);
  }
});

// Instance methods
ReportSchema.methods.markAsReviewed = function (
  reviewerId: mongoose.Types.ObjectId,
  resolution: string,
  action?: string
) {
  this.status = "resolved";
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.resolution = resolution;
  if (action) {
    this.actionTaken = action;
  }
};

ReportSchema.methods.escalate = function () {
  this.status = "escalated";
  this.priority = Math.min(this.priority + 2, 10);
};

ReportSchema.methods.dismiss = function (
  reviewerId: mongoose.Types.ObjectId,
  reason: string
) {
  this.status = "dismissed";
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.resolution = reason;
  this.actionTaken = "no_action";
};

ReportSchema.methods.addRelatedReport = function (
  reportId: mongoose.Types.ObjectId
) {
  if (!this.relatedReports.includes(reportId)) {
    this.relatedReports.push(reportId);
  }
};

// Static methods
ReportSchema.statics.findPendingReports = function () {
  return this.find({
    status: { $in: ["pending", "under_review"] },
  }).sort({ priority: -1, createdAt: 1 });
};

ReportSchema.statics.findReportsByUser = function (
  userId: mongoose.Types.ObjectId
) {
  return this.find({
    reportedUserId: userId,
  }).sort({ createdAt: -1 });
};

ReportSchema.statics.findDuplicateReports = function (
  reportedUserId: mongoose.Types.ObjectId,
  reportType: string,
  timeWindow = 3600000
) {
  // 1 hour
  const timeThreshold = new Date(Date.now() - timeWindow);

  return this.find({
    reportedUserId,
    reportType,
    createdAt: { $gte: timeThreshold },
    status: { $ne: "dismissed" },
  });
};

ReportSchema.statics.getReportStatsByUser = function (
  userId: mongoose.Types.ObjectId
) {
  return this.aggregate([
    { $match: { reportedUserId: userId } },
    {
      $group: {
        _id: "$reportType",
        count: { $sum: 1 },
        latestReport: { $max: "$createdAt" },
      },
    },
  ]);
};

ReportSchema.statics.findHighPriorityReports = function (minPriority = 7) {
  return this.find({
    priority: { $gte: minPriority },
    status: { $in: ["pending", "under_review"] },
  }).sort({ priority: -1, createdAt: 1 });
};

// Auto-validation for certain report types
ReportSchema.statics.validateReport = function (
  reportId: mongoose.Types.ObjectId
) {
  // This would integrate with AI/ML systems to validate reports
  // For now, it's a placeholder for future implementation
  return this.findByIdAndUpdate(reportId, { isValidated: true }, { new: true });
};

export default models.Report || model<IReport>("Report", ReportSchema);
