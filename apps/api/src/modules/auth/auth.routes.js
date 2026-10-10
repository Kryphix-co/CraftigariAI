import { Router } from "express";
import { env } from "../../config/env.js";
import {
  optionalArtisanSession,
  requireArtisanSession,
} from "../../middleware/auth.js";
import { createRateLimiter } from "../../middleware/rateLimit.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getMe, logout, sendOtp, verifyOtp } from "./auth.controller.js";
import { validateSendOtp, validateVerifyOtp } from "./auth.validation.js";

export const authRouter = Router();
const authRateLimit = env.otpLimitsDisabled
  ? (_request, _response, next) => next()
  : createRateLimiter({
      max: env.authRateLimitMax,
      windowMs: env.authRateLimitWindowMs,
    });

authRouter.post(
  "/send-otp",
  authRateLimit,
  validateRequest({ body: validateSendOtp }),
  asyncHandler(sendOtp),
);
authRouter.post(
  "/verify-otp",
  authRateLimit,
  validateRequest({ body: validateVerifyOtp }),
  asyncHandler(verifyOtp),
);
authRouter.get("/me", requireArtisanSession, asyncHandler(getMe));
authRouter.post("/logout", optionalArtisanSession, asyncHandler(logout));
