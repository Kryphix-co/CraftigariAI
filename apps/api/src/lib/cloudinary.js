import { createHash } from "node:crypto";
import { Readable } from "node:stream";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const UPLOAD_TIMEOUT_MS = 15000;
let configuredSignature = "";

function assertConfigured(config) {
  if (
    !config.cloudinaryCloudName ||
    !config.cloudinaryApiKey ||
    !config.cloudinaryApiSecret
  ) {
    throw new ApiError(503, "Image storage is not configured", {
      code: "IMAGE_STORAGE_NOT_CONFIGURED",
    });
  }
}

export function getCloudinaryClient(config = env) {
  assertConfigured(config);
  const signature = `${config.cloudinaryCloudName}:${config.cloudinaryApiKey}`;
  if (configuredSignature !== signature) {
    cloudinary.config({
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret,
      cloud_name: config.cloudinaryCloudName,
      secure: true,
    });
    configuredSignature = signature;
  }
  return cloudinary;
}

export async function uploadImageBuffer(
  { artisanId, buffer },
  { client, config = env, timeoutMs = UPLOAD_TIMEOUT_MS } = {},
) {
  const cloudinaryClient = client ?? getCloudinaryClient(config);
  if (client) assertConfigured(config);

  const contentHash = createHash("sha256").update(buffer).digest("hex");
  const publicId = `image-${contentHash.slice(0, 32)}`;
  const folder = `craftigari/artisans/${artisanId}/products`;

  const result = await new Promise((resolve, reject) => {
    let settled = false;
    let stream;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      callback(value);
    };
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      stream?.destroy();
      reject(
        new ApiError(504, "Image upload timed out", {
          code: "IMAGE_UPLOAD_TIMEOUT",
        }),
      );
    }, timeoutMs);

    try {
      stream = cloudinaryClient.uploader.upload_stream(
        {
          folder,
          overwrite: true,
          public_id: publicId,
          resource_type: "image",
          timeout: timeoutMs,
        },
        (error, uploadResult) => {
          if (error) {
            finish(
              reject,
              new ApiError(502, "Image upload failed", {
                code: "IMAGE_UPLOAD_FAILED",
              }),
            );
            return;
          }
          finish(resolve, uploadResult);
        },
      );
      Readable.from(buffer).pipe(stream);
    } catch {
      finish(
        reject,
        new ApiError(502, "Image upload failed", {
          code: "IMAGE_UPLOAD_FAILED",
        }),
      );
    }
  });

  if (
    result?.resource_type !== "image" ||
    typeof result.public_id !== "string" ||
    !result.public_id ||
    typeof result.secure_url !== "string" ||
    !result.secure_url.startsWith("https://")
  ) {
    throw new ApiError(502, "Image storage returned an invalid response", {
      code: "IMAGE_UPLOAD_INVALID_RESPONSE",
    });
  }

  return {
    format: result.format,
    height: result.height,
    publicId: result.public_id,
    url: cloudinaryClient.url(result.public_id, {
      crop: "limit",
      fetch_format: "auto",
      quality: "auto",
      secure: true,
      width: 1600,
    }),
    width: result.width,
  };
}
