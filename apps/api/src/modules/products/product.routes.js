import { Router } from "express";
import { requireArtisanSession } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  calculatePricing,
  createDraft,
  evaluateProductOffer,
  evaluateStandaloneOffer,
  getProduct,
  getPublished,
  listPublished,
  publishDraft,
  updateDraft,
} from "./product.controller.js";
import {
  validateCalculatePricing,
  validateCreateProduct,
  validateFairDealOffer,
  validatePagination,
  validateProductParams,
  validateUpdateProduct,
} from "./product.validation.js";

export const productRouter = Router();

productRouter.get(
  "/",
  validateRequest({
    query: (input) => validatePagination(input, { allowArtisan: true }),
  }),
  asyncHandler(listPublished),
);
productRouter.get(
  "/published/:productId",
  validateRequest({ params: validateProductParams }),
  asyncHandler(getPublished),
);
productRouter.post(
  "/calculate-pricing",
  requireArtisanSession,
  validateRequest({ body: validateCalculatePricing }),
  asyncHandler(calculatePricing),
);
productRouter.post(
  "/evaluate-offer",
  requireArtisanSession,
  validateRequest({ body: validateFairDealOffer }),
  asyncHandler(evaluateStandaloneOffer),
);
productRouter.post(
  "/",
  requireArtisanSession,
  validateRequest({ body: validateCreateProduct }),
  asyncHandler(createDraft),
);
productRouter.get(
  "/:productId",
  requireArtisanSession,
  validateRequest({ params: validateProductParams }),
  asyncHandler(getProduct),
);
productRouter.patch(
  "/:productId",
  requireArtisanSession,
  validateRequest({ params: validateProductParams, body: validateUpdateProduct }),
  asyncHandler(updateDraft),
);
productRouter.post(
  "/:productId/publish",
  requireArtisanSession,
  validateRequest({ params: validateProductParams }),
  asyncHandler(publishDraft),
);
productRouter.post(
  "/:productId/fair-deal",
  requireArtisanSession,
  validateRequest({ params: validateProductParams, body: validateFairDealOffer }),
  asyncHandler(evaluateProductOffer),
);
