import { connectToDatabase } from "../../config/database.js";
import { Artisan } from "../artisans/artisan.model.js";
import { OtpChallenge } from "./otp.model.js";

export const authRepository = {
  async getChallenge(phone) {
    await connectToDatabase();
    return OtpChallenge.findOne({ phone }).select("+otpHash +otpSalt");
  },

  async saveChallenge(phone, values) {
    await connectToDatabase();
    return OtpChallenge.findOneAndUpdate(
      { phone },
      {
        $set: {
          ...values,
          attempts: 0,
          consumedAt: null,
          deliveryStatus: "pending",
        },
      },
      { new: true, runValidators: true, upsert: true },
    ).select("+otpHash +otpSalt");
  },

  async markDeliveryAccepted(phone) {
    await connectToDatabase();
    return OtpChallenge.findOneAndUpdate(
      { phone, consumedAt: null },
      { $set: { deliveryStatus: "accepted" } },
      { new: true, runValidators: true },
    );
  },

  async markDeliveryFailed(phone, values) {
    await connectToDatabase();
    return OtpChallenge.findOneAndUpdate(
      { phone, consumedAt: null },
      {
        $set: {
          consumedAt: values.failedAt,
          deliveryStatus: "failed",
          expiresAt: values.expiresAt,
          resendAvailableAt: values.resendAvailableAt,
        },
      },
      { new: true, runValidators: true },
    );
  },

  async invalidateChallenge(phone) {
    await connectToDatabase();
    await OtpChallenge.deleteOne({ phone });
  },

  async recordFailedAttempt(challengeId, maxAttempts) {
    await connectToDatabase();
    return OtpChallenge.findOneAndUpdate(
      {
        _id: challengeId,
        attempts: { $lt: maxAttempts },
        consumedAt: null,
      },
      { $inc: { attempts: 1 } },
      { new: true },
    );
  },

  async consumeChallenge(challengeId, consumedAt) {
    await connectToDatabase();
    return OtpChallenge.findOneAndUpdate(
      { _id: challengeId, consumedAt: null },
      { $set: { consumedAt } },
      { new: true },
    );
  },

  async findOrCreateArtisan(phone, verifiedAt) {
    await connectToDatabase();
    let artisan = await Artisan.findOne({ phone }).select(
      "+authSessionVersion +phoneVerifiedAt",
    );
    if (artisan) {
      if (!artisan.phoneVerifiedAt) {
        artisan.phoneVerifiedAt = verifiedAt;
        await artisan.save();
      }
      return { artisan, isNewArtisan: false };
    }

    try {
      artisan = await Artisan.create({ phone, phoneVerifiedAt: verifiedAt });
      return { artisan, isNewArtisan: true };
    } catch (error) {
      if (error?.code !== 11000) throw error;
      artisan = await Artisan.findOne({ phone }).select(
        "+authSessionVersion +phoneVerifiedAt",
      );
      return { artisan, isNewArtisan: false };
    }
  },

  async incrementSessionVersion(artisanId) {
    await connectToDatabase();
    return Artisan.findByIdAndUpdate(
      artisanId,
      { $inc: { authSessionVersion: 1 } },
      { new: true },
    ).select("+authSessionVersion");
  },
};
