import { Router } from "express";
import {
  requireArtisanOwnership,
  requireArtisanSession,
} from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  getPublicProfile,
  getMyProfile,
  listArtisanProducts,
  updateMyProfile,
} from "./artisan.controller.js";
import { validateProfileUpdate } from "./artisan.validation.js";
import {
  validateArtisanParams,
  validatePagination,
} from "../products/product.validation.js";

export const artisanRouter = Router();

artisanRouter.get("/me", requireArtisanSession, asyncHandler(getMyProfile));
artisanRouter.patch(
  "/me",
  requireArtisanSession,
  validateRequest({ body: validateProfileUpdate }),
  asyncHandler(updateMyProfile),
);

artisanRouter.get(
  "/:artisanId",
  validateRequest({ params: validateArtisanParams }),
  asyncHandler(getPublicProfile),
);

artisanRouter.get(
  "/:artisanId/products",
  requireArtisanSession,
  validateRequest({
    params: validateArtisanParams,
    query: (input) => validatePagination(input, { allowStatus: true }),
  }),
  requireArtisanOwnership,
  asyncHandler(listArtisanProducts),
);
