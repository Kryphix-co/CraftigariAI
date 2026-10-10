import { uploadImageBuffer } from "../../lib/cloudinary.js";
import { ApiError } from "../../utils/ApiError.js";

const MIME_BY_FORMAT = {
  jpeg: new Set(["image/jpeg", "image/jpg"]),
  png: new Set(["image/png"]),
  webp: new Set(["image/webp"]),
};

export function detectImageFormat(buffer) {
  if (!Buffer.isBuffer(buffer)) return null;
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
  ) {
    return "png";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

export function validateImageFile(file) {
  const format = detectImageFormat(file?.buffer);
  if (!format || !MIME_BY_FORMAT[format].has(file.mimetype?.toLowerCase())) {
    throw new ApiError(415, "Image contents must be valid JPEG, PNG, or WebP", {
      code: "INVALID_IMAGE_CONTENT",
    });
  }
  return format;
}

export async function uploadArtisanImages(
  artisanId,
  files,
  { uploader = uploadImageBuffer } = {},
) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new ApiError(400, "At least one image is required", {
      code: "IMAGES_REQUIRED",
    });
  }

  files.forEach(validateImageFile);
  const images = [];
  for (const file of files) {
    const uploaded = await uploader({ artisanId, buffer: file.buffer });
    images.push({
      ...uploaded,
      originalName: file.originalname,
    });
  }
  return images;
}
