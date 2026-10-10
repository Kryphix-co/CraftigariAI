import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { env } from "./config/env.js";
import { ApiError } from "./utils/ApiError.js";
import { artisanRouter } from "./modules/artisans/artisan.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { productRouter } from "./modules/products/product.routes.js";
import { uploadRouter } from "./modules/uploads/upload.routes.js";
import { aiRouter } from "./modules/ai/ai.routes.js";
import { inquiryRouter } from "./modules/inquiries/inquiry.routes.js";
import { quotationRouter } from "./modules/quotations/quotation.routes.js";
import { paymentRouter } from "./modules/payments/payment.routes.js";
import { orderRouter } from "./modules/orders/order.routes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";

function createCorsOptions() {
  return {
    allowedHeaders: ["Content-Type", "x-quotation-token", "x-order-token", "x-razorpay-signature"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    origin(origin, callback) {
      if (!origin || env.corsAllowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(
        new ApiError(403, "Origin is not allowed", {
          code: "CORS_ORIGIN_DENIED",
        }),
      );
    },
  };
}

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors(createCorsOptions()));
  app.use(
    express.json({
      limit: env.jsonBodyLimit,
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(cookieParser());
  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/products", productRouter);
  app.use("/api/artisans", artisanRouter);
  app.use("/api/uploads", uploadRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/inquiries", inquiryRouter);
  app.use("/api/quotations", quotationRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/orders", orderRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
