import { Router } from "express";
import { requireArtisanSession } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadImages } from "./upload.controller.js";
import { acceptImageUploads } from "./upload.middleware.js";

export const uploadRouter = Router();

uploadRouter.post(
  "/images",
  requireArtisanSession,
  acceptImageUploads,
  asyncHandler(uploadImages),
);
