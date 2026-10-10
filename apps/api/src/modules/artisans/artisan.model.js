import mongoose from "mongoose";

const artisanSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "", maxlength: 120 },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 20,
    },
    location: { type: String, trim: true, default: "", maxlength: 180 },
    craftSpecialization: {
      type: String,
      trim: true,
      default: "",
      maxlength: 160,
    },
    profilePhoto: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "", maxlength: 2000 },
    phoneVerifiedAt: { type: Date, default: null, select: false },
    authSessionVersion: { type: Number, default: 0, min: 0, select: false },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_document, value) {
        value.id = value._id.toString();
        delete value._id;
        delete value.phoneVerifiedAt;
        delete value.authSessionVersion;
        return value;
      },
    },
  },
);

artisanSchema.index({ craftSpecialization: 1, location: 1 });

export const Artisan =
  mongoose.models.Artisan ?? mongoose.model("Artisan", artisanSchema);
