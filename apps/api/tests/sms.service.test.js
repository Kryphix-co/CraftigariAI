import assert from "node:assert/strict";
import { test } from "node:test";
import {
  deliverOtp,
  resolveOtpDelivery,
  sendStartMessagingOtp,
} from "../src/modules/auth/sms.service.js";

const PHONE = "+919876543210";
const OTP = "123456";

function config(overrides = {}) {
  return {
    nodeEnv: "development",
    otpApiKey: "test-api-key",
    otpProvider: "startmessaging",
    otpResendCooldownSeconds: 60,
    otpTestModeRequested: false,
    otpTestPhoneNumbers: [],
    ...overrides,
  };
}

function acceptedResponse(overrides = {}) {
  return new Response(
    JSON.stringify({
      data: {
        messageId: "message-123",
        otpRequestId: "otp-request-123",
        status: "queued",
      },
      requestId: "request-123",
      statusCode: 201,
      success: true,
      ...overrides,
    }),
    { headers: { "content-type": "application/json" }, status: 201 },
  );
}

test("StartMessaging receives the normalized phone, API key, OTP, and app name", async () => {
  let request;
  const result = await sendStartMessagingOtp(
    { otp: OTP, phone: PHONE },
    {
      config: config(),
      fetchImpl: async (url, options) => {
        request = { options, url };
        return acceptedResponse();
      },
    },
  );

  assert.equal(request.url, "https://api.startmessaging.com/otp/send");
  assert.equal(request.options.method, "POST");
  assert.equal(request.options.headers["Content-Type"], "application/json");
  assert.equal(request.options.headers["X-API-Key"], "test-api-key");
  assert.deepEqual(JSON.parse(request.options.body), {
    phoneNumber: PHONE,
    variables: { appName: "Craftigari", otp: OTP },
  });
  assert.equal(result.accepted, true);
  assert.equal(result.status, "queued");
  assert.equal(result.messageId, "message-123");
});

test("missing StartMessaging credentials fail before an HTTP request", async () => {
  let calls = 0;
  const settings = config({ otpApiKey: "" });
  assert.throws(
    () => resolveOtpDelivery(PHONE, settings),
    (error) => error.code === "OTP_PROVIDER_NOT_CONFIGURED",
  );
  await assert.rejects(
    () =>
      sendStartMessagingOtp(
        { otp: OTP, phone: PHONE },
        {
          config: settings,
          fetchImpl: async () => {
            calls += 1;
          },
        },
      ),
    (error) => error.code === "OTP_PROVIDER_NOT_CONFIGURED",
  );
  assert.equal(calls, 0);
});

test("invalid Indian numbers are rejected before calling StartMessaging", async () => {
  let calls = 0;
  await assert.rejects(
    () =>
      sendStartMessagingOtp(
        { otp: OTP, phone: "+911234567890" },
        {
          config: config(),
          fetchImpl: async () => {
            calls += 1;
          },
        },
      ),
    (error) => error.code === "INVALID_PHONE",
  );
  assert.equal(calls, 0);
});

test("provider HTTP rejection is sanitized and marked as confirmed", async () => {
  await assert.rejects(
    () =>
      sendStartMessagingOtp(
        { otp: OTP, phone: PHONE },
        {
          config: config(),
          fetchImpl: async () =>
            new Response("private provider error", { status: 400 }),
        },
      ),
    (error) => {
      assert.equal(error.code, "OTP_PROVIDER_REJECTED");
      assert.equal(error.deliveryOutcome, "confirmed-failure");
      assert.doesNotMatch(error.message, /private provider error/);
      return true;
    },
  );
});

test("provider rate limits preserve Retry-After without exposing its body", async () => {
  await assert.rejects(
    () =>
      sendStartMessagingOtp(
        { otp: OTP, phone: PHONE },
        {
          config: config(),
          fetchImpl: async () =>
            new Response("account details", {
              headers: { "retry-after": "120" },
              status: 429,
            }),
        },
      ),
    (error) => {
      assert.equal(error.code, "OTP_PROVIDER_RATE_LIMITED");
      assert.equal(error.statusCode, 429);
      assert.equal(error.retryAfterSeconds, 120);
      assert.deepEqual(error.details, [{ retryAfterSeconds: 120 }]);
      assert.doesNotMatch(error.message, /account details/);
      return true;
    },
  );
});

test("provider timeout is reported as an uncertain delivery outcome", async () => {
  await assert.rejects(
    () =>
      sendStartMessagingOtp(
        { otp: OTP, phone: PHONE },
        {
          config: config(),
          fetchImpl: (_url, { signal }) =>
            new Promise((_resolve, reject) => {
              signal.addEventListener("abort", () => {
                reject(new DOMException("Aborted", "AbortError"));
              });
            }),
          timeoutMs: 5,
        },
      ),
    (error) => {
      assert.equal(error.code, "OTP_PROVIDER_TIMEOUT");
      assert.equal(error.deliveryOutcome, "uncertain");
      return true;
    },
  );
});

test("provider network failures are not retried automatically", async () => {
  let calls = 0;
  await assert.rejects(
    () =>
      sendStartMessagingOtp(
        { otp: OTP, phone: PHONE },
        {
          config: config(),
          fetchImpl: async () => {
            calls += 1;
            throw new TypeError("connection failed");
          },
        },
      ),
    (error) => {
      assert.equal(error.code, "OTP_PROVIDER_UNAVAILABLE");
      assert.equal(error.deliveryOutcome, "uncertain");
      return true;
    },
  );
  assert.equal(calls, 1);
});

test("minimal successful provider envelopes are accepted", async () => {
  const result = await sendStartMessagingOtp(
    { otp: OTP, phone: PHONE },
    {
      config: config(),
      fetchImpl: async () =>
        new Response(JSON.stringify({ success: true }), {
          headers: { "content-type": "application/json" },
          status: 200,
        }),
    },
  );

  assert.equal(result.accepted, true);
  assert.equal(result.status, "accepted");
});

test("explicit provider failures are rejected even with a 2xx response", async () => {
  await assert.rejects(
    () =>
      sendStartMessagingOtp(
        { otp: OTP, phone: PHONE },
        {
          config: config(),
          fetchImpl: async () =>
            new Response(
              JSON.stringify({ data: { status: "failed" }, success: false }),
              {
                headers: { "content-type": "application/json" },
                status: 200,
              },
            ),
        },
      ),
    (error) => error.code === "OTP_PROVIDER_INVALID_RESPONSE",
  );
});

test("whitelisted development test mode bypasses StartMessaging", async () => {
  let calls = 0;
  const settings = config({
    otpTestModeRequested: true,
    otpTestPhoneNumbers: [PHONE],
  });
  const mode = resolveOtpDelivery(PHONE, settings);
  const result = await deliverOtp(
    { mode, otp: OTP, phone: PHONE },
    {
      config: settings,
      fetchImpl: async () => {
        calls += 1;
      },
    },
  );

  assert.deepEqual(result, { demoOtp: OTP, mode: "test" });
  assert.equal(calls, 0);
});

test("live StartMessaging mode never returns the OTP", async () => {
  const settings = config();
  const mode = resolveOtpDelivery(PHONE, settings);
  const result = await deliverOtp(
    { mode, otp: OTP, phone: PHONE },
    { config: settings, fetchImpl: async () => acceptedResponse() },
  );

  assert.equal(mode, "startmessaging");
  assert.equal("demoOtp" in result, false);
  assert.equal(JSON.stringify(result).includes(OTP), false);
});
