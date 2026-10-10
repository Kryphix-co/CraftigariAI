import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createRateLimiter } from "../../middleware/rateLimit.js";
import {
  validateInitiatePayment,
  validateVerifyPayment,
} from "./payment.validation.js";
import {
  initiatePayment,
  verifyPayment,
  handleWebhook,
} from "./payment.controller.js";

export const paymentRouter = Router();

const paymentRateLimiter = createRateLimiter({
  max: 30,
  windowMs: 15 * 60 * 1000,
  keyGenerator: (req) => `${req.ip}-${req.body?.quotationId || ""}`,
});

paymentRouter.post(
  "/initiate",
  paymentRateLimiter,
  validateRequest({ body: validateInitiatePayment }),
  initiatePayment,
);

paymentRouter.post(
  "/verify",
  validateRequest({ body: validateVerifyPayment }),
  verifyPayment,
);

paymentRouter.post("/webhook", handleWebhook);
