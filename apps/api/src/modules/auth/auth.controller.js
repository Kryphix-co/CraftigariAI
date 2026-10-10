import { env } from "../../config/env.js";
import { sendSuccess } from "../../utils/response.js";
import { authService, isProfileComplete } from "./auth.service.js";
import {
  assertSessionConfigured,
  createSessionToken,
  getClearCookieOptions,
  getSessionCookieOptions,
} from "./session.js";

function serializeArtisan(artisan) {
  return typeof artisan.toJSON === "function" ? artisan.toJSON() : artisan;
}

export async function sendOtp(request, response) {
  const result = await authService.sendOtp(request.validated.body.phone);
  return sendSuccess(response, {
    data: result,
    message: result.demoOtp
      ? "Development OTP generated for an approved test number"
      : "OTP request accepted",
    statusCode: 201,
  });
}

export async function verifyOtp(request, response) {
  assertSessionConfigured();
  const { phone, otp } = request.validated.body;
  const result = await authService.verifyOtp(phone, otp);
  const token = createSessionToken({
    artisanId: result.artisan._id,
    sessionVersion: result.artisan.authSessionVersion ?? 0,
  });
  response.cookie(env.authCookieName, token, getSessionCookieOptions());
  return sendSuccess(response, {
    data: {
      artisan: serializeArtisan(result.artisan),
      isNewArtisan: result.isNewArtisan,
      profileComplete: result.profileComplete,
    },
    message: "Phone verified",
  });
}

export async function getMe(request, response) {
  return sendSuccess(response, {
    data: {
      artisan: serializeArtisan(request.auth.artisan),
      profileComplete: isProfileComplete(request.auth.artisan),
    },
  });
}

export async function logout(request, response) {
  await authService.logout(request.auth?.artisanId);
  response.clearCookie(env.authCookieName, getClearCookieOptions());
  return sendSuccess(response, { data: null, message: "Logged out" });
}
