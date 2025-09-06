import mongoose, { Document, model, models, Schema } from "mongoose";

// Subscription model optimized for random video chat platform
export interface ISubscriptionPlan {
  name: string;
  price: number;
  currency: string;
  features: string[];

  // Video chat specific limits
  dailyVideoMinutes?: number; // Daily video chat minutes
  monthlyVideoMinutes?: number; // Monthly video chat minutes
  maxConcurrentSessions?: number; // How many sessions at once

  // Matching preferences
  priorityMatching?: boolean; // Get matched faster
  advancedFilters?: boolean; // Access to more filter options
  interestBasedMatching?: boolean; // Match by interests
  locationBasedMatching?: boolean; // Match by location

  // Safety and moderation
  reportPriority?: boolean; // Higher priority for reports
  moderatorSupport?: boolean; // Access to human moderators

  // Additional features
  adFree?: boolean; // No ads during sessions
  customization?: boolean; // Profile customization options
  analytics?: boolean; // Session analytics and insights
}

export interface IUsageTracking {
  // Daily usage
  dailyVideoMinutes: number;
  dailyTextChats: number;
  dailySessions: number;
  lastDailyReset: Date;

  // Monthly usage
  monthlyVideoMinutes: number;
  monthlyTextChats: number;
  monthlySessions: number;
  lastMonthlyReset: Date;

  // Session tracking
  currentActiveSessions: number;
  longestSessionDuration: number;
  averageSessionDuration: number;
  totalSessionsAllTime: number;
}

export interface ISubscription extends Document {
  user: mongoose.Types.ObjectId;
  plan: ISubscriptionPlan;
  status: "active" | "cancelled" | "expired" | "pending" | "suspended";

  // Billing
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  nextBillingDate?: Date;
  billingCycle: "monthly" | "yearly";

  // Usage tracking
  usage: IUsageTracking;

  // Payment info
  paymentMethod?: string;
  lastPaymentDate?: Date;
  lastPaymentAmount?: number;

  // Trial info
  isTrialActive?: boolean;
  trialEndDate?: Date;
  trialUsed?: boolean;

  // Cancellation
  cancelledAt?: Date;
  cancelledBy?: mongoose.Types.ObjectId;
  cancellationReason?: string;

  // Platform specific
  discountCode?: string;
  discountAmount?: number;
  referralCode?: string;
  referredBy?: mongoose.Types.ObjectId;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD", maxlength: 3 },
    features: [{ type: String, maxlength: 200 }],

    // Video chat limits
    dailyVideoMinutes: { type: Number, min: 0 },
    monthlyVideoMinutes: { type: Number, min: 0 },
    maxConcurrentSessions: { type: Number, min: 1, default: 1 },

    // Matching features
    priorityMatching: { type: Boolean, default: false },
    advancedFilters: { type: Boolean, default: false },
    interestBasedMatching: { type: Boolean, default: true },
    locationBasedMatching: { type: Boolean, default: false },

    // Safety features
    reportPriority: { type: Boolean, default: false },
    moderatorSupport: { type: Boolean, default: false },

    // Additional features
    adFree: { type: Boolean, default: false },
    customization: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
  },
  { _id: false }
);

const UsageTrackingSchema = new Schema<IUsageTracking>(
  {
    // Daily tracking
    dailyVideoMinutes: { type: Number, default: 0, min: 0 },
    dailyTextChats: { type: Number, default: 0, min: 0 },
    dailySessions: { type: Number, default: 0, min: 0 },
    lastDailyReset: { type: Date, default: Date.now },

    // Monthly tracking
    monthlyVideoMinutes: { type: Number, default: 0, min: 0 },
    monthlyTextChats: { type: Number, default: 0, min: 0 },
    monthlySessions: { type: Number, default: 0, min: 0 },
    lastMonthlyReset: { type: Date, default: Date.now },

    // Session tracking
    currentActiveSessions: { type: Number, default: 0, min: 0 },
    longestSessionDuration: { type: Number, default: 0, min: 0 },
    averageSessionDuration: { type: Number, default: 0, min: 0 },
    totalSessionsAllTime: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
      unique: true,
    },
    plan: {
      type: SubscriptionPlanSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "pending", "suspended"],
      default: "pending",
      index: true,
    },

    // Billing
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true, index: true },
    nextBillingDate: { type: Date, index: true },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
      index: true,
    },

    // Usage
    usage: {
      type: UsageTrackingSchema,
      default: () => ({}),
    },

    // Payment
    paymentMethod: { type: String, maxlength: 50 },
    lastPaymentDate: { type: Date },
    lastPaymentAmount: { type: Number, min: 0 },

    // Trial
    isTrialActive: { type: Boolean, default: false, index: true },
    trialEndDate: { type: Date },
    trialUsed: { type: Boolean, default: false },

    // Cancellation
    cancelledAt: { type: Date },
    cancelledBy: { type: Schema.Types.ObjectId, ref: "User" },
    cancellationReason: { type: String, maxlength: 500 },

    // Platform specific
    discountCode: { type: String, maxlength: 50 },
    discountAmount: { type: Number, min: 0 },
    referralCode: { type: String, maxlength: 50 },
    referredBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
SubscriptionSchema.index({ user: 1, status: 1 });
SubscriptionSchema.index({ endDate: 1, status: 1 });
SubscriptionSchema.index({ nextBillingDate: 1, autoRenew: 1 });
SubscriptionSchema.index({ status: 1, endDate: 1 });

// Virtual fields
SubscriptionSchema.virtual("isExpired").get(function () {
  return this.endDate < new Date();
});

SubscriptionSchema.virtual("daysRemaining").get(function () {
  const now = new Date();
  const diff = this.endDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

SubscriptionSchema.virtual("canUseVideo").get(function () {
  if (this.status !== "active") return false;

  // Check daily limits
  if (
    this.plan.dailyVideoMinutes &&
    this.usage.dailyVideoMinutes >= this.plan.dailyVideoMinutes
  ) {
    return false;
  }

  // Check monthly limits
  if (
    this.plan.monthlyVideoMinutes &&
    this.usage.monthlyVideoMinutes >= this.plan.monthlyVideoMinutes
  ) {
    return false;
  }

  // Check concurrent sessions
  if (
    this.usage.currentActiveSessions >= (this.plan.maxConcurrentSessions || 1)
  ) {
    return false;
  }

  return true;
});

// Pre-save middleware
SubscriptionSchema.pre("save", function () {
  const now = new Date();

  // Reset daily usage if needed
  const lastReset = new Date(this.usage.lastDailyReset);
  if (
    now.getDate() !== lastReset.getDate() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()
  ) {
    this.usage.dailyVideoMinutes = 0;
    this.usage.dailyTextChats = 0;
    this.usage.dailySessions = 0;
    this.usage.lastDailyReset = now;
  }

  // Reset monthly usage if needed
  const lastMonthlyReset = new Date(this.usage.lastMonthlyReset);
  if (
    now.getMonth() !== lastMonthlyReset.getMonth() ||
    now.getFullYear() !== lastMonthlyReset.getFullYear()
  ) {
    this.usage.monthlyVideoMinutes = 0;
    this.usage.monthlyTextChats = 0;
    this.usage.monthlySessions = 0;
    this.usage.lastMonthlyReset = now;
  }

  // Update status based on dates
  if (this.endDate < now && this.status === "active") {
    this.status = "expired";
  }

  // End trial if expired
  if (this.isTrialActive && this.trialEndDate && this.trialEndDate < now) {
    this.isTrialActive = false;
  }
});

// Instance methods
SubscriptionSchema.methods.canUseFeature = function (feature: string): boolean {
  if (this.status !== "active") return false;

  switch (feature) {
    case "priorityMatching":
      return this.plan.priorityMatching || false;
    case "advancedFilters":
      return this.plan.advancedFilters || false;
    case "interestBasedMatching":
      return this.plan.interestBasedMatching || false;
    case "locationBasedMatching":
      return this.plan.locationBasedMatching || false;
    case "reportPriority":
      return this.plan.reportPriority || false;
    case "moderatorSupport":
      return this.plan.moderatorSupport || false;
    case "adFree":
      return this.plan.adFree || false;
    case "customization":
      return this.plan.customization || false;
    case "analytics":
      return this.plan.analytics || false;
    default:
      return false;
  }
};

SubscriptionSchema.methods.startVideoSession = function (): boolean {
  if (!this.canUseVideo) return false;

  this.usage.currentActiveSessions += 1;
  this.usage.dailySessions += 1;
  this.usage.monthlySessions += 1;
  this.usage.totalSessionsAllTime += 1;

  return true;
};

SubscriptionSchema.methods.endVideoSession = function (
  durationMinutes: number
) {
  this.usage.currentActiveSessions = Math.max(
    0,
    this.usage.currentActiveSessions - 1
  );
  this.usage.dailyVideoMinutes += durationMinutes;
  this.usage.monthlyVideoMinutes += durationMinutes;

  // Update longest session
  const durationSeconds = durationMinutes * 60;
  if (durationSeconds > this.usage.longestSessionDuration) {
    this.usage.longestSessionDuration = durationSeconds;
  }

  // Update average session duration
  if (this.usage.totalSessionsAllTime > 0) {
    const totalDuration =
      this.usage.averageSessionDuration *
        (this.usage.totalSessionsAllTime - 1) +
      durationSeconds;
    this.usage.averageSessionDuration = Math.round(
      totalDuration / this.usage.totalSessionsAllTime
    );
  }
};

SubscriptionSchema.methods.addTextChat = function () {
  this.usage.dailyTextChats += 1;
  this.usage.monthlyTextChats += 1;
};

SubscriptionSchema.methods.getRemainingVideoMinutes = function (): {
  daily: number | null;
  monthly: number | null;
} {
  return {
    daily: this.plan.dailyVideoMinutes
      ? Math.max(0, this.plan.dailyVideoMinutes - this.usage.dailyVideoMinutes)
      : null,
    monthly: this.plan.monthlyVideoMinutes
      ? Math.max(
          0,
          this.plan.monthlyVideoMinutes - this.usage.monthlyVideoMinutes
        )
      : null,
  };
};

// Static methods
SubscriptionSchema.statics.findActiveSubscriptions = function () {
  return this.find({ status: "active" });
};

SubscriptionSchema.statics.findExpiringSubscriptions = function (
  days: number = 7
) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return this.find({
    status: "active",
    endDate: { $lte: futureDate },
    autoRenew: true,
  });
};

SubscriptionSchema.statics.findByUser = function (
  userId: mongoose.Types.ObjectId
) {
  return this.findOne({ user: userId });
};

SubscriptionSchema.statics.createFreeTrial = function (
  userId: mongoose.Types.ObjectId,
  trialDays = 7
) {
  const now = new Date();
  const trialEnd = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);

  return new this({
    user: userId,
    plan: {
      name: "Free Trial",
      price: 0,
      currency: "USD",
      features: ["Basic video chat", "Text chat"],
      dailyVideoMinutes: 60,
      monthlyVideoMinutes: 1800, // 30 hours
      maxConcurrentSessions: 1,
      priorityMatching: false,
      advancedFilters: false,
      interestBasedMatching: true,
      locationBasedMatching: false,
      reportPriority: false,
      moderatorSupport: false,
      adFree: false,
      customization: false,
      analytics: false,
    },
    status: "active",
    startDate: now,
    endDate: trialEnd,
    isTrialActive: true,
    trialEndDate: trialEnd,
    trialUsed: true,
    autoRenew: false,
  });
};

export default models.Subscription ||
  model<ISubscription>("Subscription", SubscriptionSchema);

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD", maxlength: 3 },
    features: [{ type: String, maxlength: 200 }],
    chatLimit: { type: Number, min: 0 },
    storageLimit: { type: Number, min: 0 },
    videoCallDuration: { type: Number, min: 0 },
  },
  { _id: false }
);

const PaymentHistorySchema = new Schema<IPaymentHistory>(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD", maxlength: 3 },
    paymentMethod: { type: String, required: true, maxlength: 50 },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paymentDate: { type: Date, required: true },
    description: { type: String, maxlength: 500 },
  },
  {
    timestamps: true,
    _id: true,
  }
);

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
      unique: true, // One subscription per user
    },
    plan: {
      type: SubscriptionPlanSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "pending", "suspended"],
      default: "pending",
      index: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true, index: true },
    paymentHistory: [PaymentHistorySchema],
    currentUsage: {
      chatsUsed: { type: Number, default: 0, min: 0 },
      storageUsed: { type: Number, default: 0, min: 0 },
      videoCallMinutesUsed: { type: Number, default: 0, min: 0 },
    },
    nextBillingDate: { type: Date, index: true },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
      index: true,
    },
    cancelledAt: { type: Date },
    cancelledBy: { type: Schema.Types.ObjectId, ref: "User" },
    cancellationReason: { type: String, maxlength: 500 },
    trialEndDate: { type: Date },
    isTrialActive: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
SubscriptionSchema.index({ user: 1, status: 1 });
SubscriptionSchema.index({ endDate: 1, status: 1 });
SubscriptionSchema.index({ nextBillingDate: 1, autoRenew: 1 });
SubscriptionSchema.index({ status: 1, endDate: 1 });
SubscriptionSchema.index({ "paymentHistory.transactionId": 1 });

// Virtual for checking if subscription is expired
SubscriptionSchema.virtual("isExpired").get(function () {
  return this.endDate < new Date();
});

// Virtual for checking if trial is expired
SubscriptionSchema.virtual("isTrialExpired").get(function () {
  return this.trialEndDate ? this.trialEndDate < new Date() : false;
});

// Virtual for days remaining
SubscriptionSchema.virtual("daysRemaining").get(function () {
  const now = new Date();
  const diff = this.endDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update status based on dates
SubscriptionSchema.pre("save", function () {
  const now = new Date();

  if (this.isTrialActive && this.trialEndDate && this.trialEndDate < now) {
    this.isTrialActive = false;
  }

  if (this.endDate < now && this.status === "active") {
    this.status = "expired";
  }
});

// Instance methods
SubscriptionSchema.methods.canUseFeature = function (feature: string) {
  return this.status === "active" && this.plan.features.includes(feature);
};

SubscriptionSchema.methods.incrementUsage = function (
  type: "chats" | "storage" | "videoCall",
  amount: number
) {
  switch (type) {
    case "chats":
      this.currentUsage.chatsUsed += amount;
      break;
    case "storage":
      this.currentUsage.storageUsed += amount;
      break;
    case "videoCall":
      this.currentUsage.videoCallMinutesUsed += amount;
      break;
  }
};

SubscriptionSchema.methods.hasReachedLimit = function (
  type: "chats" | "storage" | "videoCall"
) {
  switch (type) {
    case "chats":
      return this.plan.chatLimit
        ? this.currentUsage.chatsUsed >= this.plan.chatLimit
        : false;
    case "storage":
      return this.plan.storageLimit
        ? this.currentUsage.storageUsed >= this.plan.storageLimit * 1024
        : false;
    case "videoCall":
      return this.plan.videoCallDuration
        ? this.currentUsage.videoCallMinutesUsed >= this.plan.videoCallDuration
        : false;
    default:
      return false;
  }
};

SubscriptionSchema.methods.addPayment = function (
  paymentData: Omit<IPaymentHistory, "paymentDate">
) {
  this.paymentHistory.push({
    ...paymentData,
    paymentDate: new Date(),
  });
};

SubscriptionSchema.methods.cancel = function (
  cancelledBy: mongoose.Types.ObjectId,
  reason?: string
) {
  this.status = "cancelled";
  this.cancelledAt = new Date();
  this.cancelledBy = cancelledBy;
  this.cancellationReason = reason;
  this.autoRenew = false;
};

// Static methods
SubscriptionSchema.statics.findActiveSubscriptions = function () {
  return this.find({ status: "active" });
};

SubscriptionSchema.statics.findExpiringSubscriptions = function (
  days: number = 7
) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return this.find({
    status: "active",
    endDate: { $lte: futureDate },
    autoRenew: true,
  });
};

SubscriptionSchema.statics.findByUser = function (
  userId: mongoose.Types.ObjectId
) {
  return this.findOne({ user: userId });
};

export default models.Subscription ||
  model<ISubscription>("Subscription", SubscriptionSchema);
