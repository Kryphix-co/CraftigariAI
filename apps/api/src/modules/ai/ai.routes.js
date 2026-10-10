import { Router } from "express";
import { requireArtisanSession } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  analyzeMakingProcess,
  analyzeProduct,
  transcribeVoice,
  translateText,
} from "./ai.controller.js";
import { acceptAudioUpload } from "./ai.upload.middleware.js";
import {
  validateMakingProcessAnalysis,
  validateProductAnalysis,
  validateTranslation,
} from "./ai.validation.js";

export const aiRouter = Router();

aiRouter.post(
  "/product-analysis",
  requireArtisanSession,
  validateRequest({ body: validateProductAnalysis }),
  asyncHandler(analyzeProduct),
);
aiRouter.post(
  "/making-process-analysis",
  requireArtisanSession,
  validateRequest({ body: validateMakingProcessAnalysis }),
  asyncHandler(analyzeMakingProcess),
);
aiRouter.post(
  "/voice-transcription",
  requireArtisanSession,
  acceptAudioUpload,
  asyncHandler(transcribeVoice),
);
aiRouter.post(
  "/translate",
  requireArtisanSession,
  validateRequest({ body: validateTranslation }),
  asyncHandler(translateText),
);
