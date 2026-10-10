import { connectToDatabase } from "../../config/database.js";
import { ApiError } from "../../utils/ApiError.js";
import { Artisan } from "./artisan.model.js";

const artisanRepository = {
  async getPublicProfile(artisanId) {
    await connectToDatabase();
    return Artisan.findById(artisanId).select(
      "name location craftSpecialization profilePhoto bio createdAt",
    );
  },

  async updateProfile(artisanId, input) {
    await connectToDatabase();
    return Artisan.findByIdAndUpdate(
      artisanId,
      { $set: input },
      { new: true, runValidators: true },
    );
  },
};

export function createArtisanService({ repository = artisanRepository } = {}) {
  return {
    async getPublicProfile(artisanId) {
      const artisan = await repository.getPublicProfile(artisanId);
      if (!artisan) {
        throw new ApiError(404, "Artisan not found", {
          code: "ARTISAN_NOT_FOUND",
        });
      }
      return artisan;
    },

    async updateProfile(artisanId, input) {
      const artisan = await repository.updateProfile(artisanId, input);
      if (!artisan) {
        throw new ApiError(404, "Artisan not found", {
          code: "ARTISAN_NOT_FOUND",
        });
      }
      return artisan;
    },
  };
}

const artisanService = createArtisanService();

export const updateArtisanProfile = (...arguments_) =>
  artisanService.updateProfile(...arguments_);

export const getPublicArtisanProfile = (...arguments_) =>
  artisanService.getPublicProfile(...arguments_);
