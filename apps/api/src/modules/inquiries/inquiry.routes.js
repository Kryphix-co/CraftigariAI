import { Router } from "express";
import { optionalArtisanSession, requireArtisanSession } from "../../middleware/auth.js";
import { createRateLimiter } from "../../middleware/rateLimit.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  addInquiryMessage,
  createInquiry,
  getInquiryDealSaathi,
  getInquiryDetails,
  getInquiryFairDeal,
  listArtisanInquiries,
} from "./inquiry.controller.js";
import {
  validateCreateInquiry,
  validateInquiryMessage,
  validateInquiryPagination,
} from "./inquiry.validation.js";

const guestInquiryLimiter = createRateLimiter({
  max: 20,
  windowMs: 10 * 60 * 1000,
});

export const inquiryRouter = Router();

// 1. Submit buyer inquiry (public guest or authenticated)
inquiryRouter.post(
  "/",
  guestInquiryLimiter,
  validateRequest({ body: validateCreateInquiry }),
  asyncHandler(createInquiry),
);

// 2. List inquiries for logged-in artisan
inquiryRouter.get(
  "/",
  requireArtisanSession,
  validateRequest({ query: validateInquiryPagination }),
  asyncHandler(listArtisanInquiries),
);

// 3. Get single inquiry details (artisan session or guest token)
inquiryRouter.get(
  "/:inquiryId",
  optionalArtisanSession,
  asyncHandler(getInquiryDetails),
);

// 4. Send negotiation message (artisan session or guest token)
inquiryRouter.post(
  "/:inquiryId/messages",
  optionalArtisanSession,
  validateRequest({ body: validateInquiryMessage }),
  asyncHandler(addInquiryMessage),
);

// 5. Fair Deal evaluation for inquiry's proposed offer
inquiryRouter.get(
  "/:inquiryId/fair-deal",
  requireArtisanSession,
  asyncHandler(getInquiryFairDeal),
);

// 6. Deal Saathi AI analysis for inquiry
inquiryRouter.post(
  "/:inquiryId/deal-saathi",
  requireArtisanSession,
  asyncHandler(getInquiryDealSaathi),
);
