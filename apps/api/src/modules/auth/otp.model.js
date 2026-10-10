import mongoose from "mongoose";

const otpChallengeSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    otpHash: { type: String, required: true, select: false },
    otpSalt: { type: String, required: true, select: false },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    resendAvailableAt: { type: Date, required: true },
    attempts: { type: Number, default: 0, min: 0 },
    consumedAt: { type: Date, default: null },
    deliveryStatus: {
      type: String,
      enum: ["pending", "accepted", "failed"],
      default: "pending",
    },
  },
  { timestamps: true, versionKey: false },
);

export const OtpChallenge =
  mongoose.models.OtpChallenge ??
  mongoose.model("OtpChallenge", otpChallengeSchema);
