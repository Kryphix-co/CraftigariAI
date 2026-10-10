import { Router } from "express";
import { optionalArtisanSession, requireArtisanSession } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createQuotation,
  getQuotation,
  updateQuotationStatus,
} from "./quotation.controller.js";
import {
  validateCreateQuotation,
  validateUpdateQuotationStatus,
} from "./quotation.validation.js";

export const quotationRouter = Router();

// 1. Create quotation (artisan only)
quotationRouter.post(
  "/",
  requireArtisanSession,
  validateRequest({ body: validateCreateQuotation }),
  asyncHandler(createQuotation),
);

// 2. View quotation (buyer via token or artisan via session)
quotationRouter.get(
  "/:quotationId",
  optionalArtisanSession,
  asyncHandler(getQuotation),
);

// 3. Update quotation status (accept/decline by buyer or artisan)
quotationRouter.patch(
  "/:quotationId/status",
  optionalArtisanSession,
  validateRequest({ body: validateUpdateQuotationStatus }),
  asyncHandler(updateQuotationStatus),
);
