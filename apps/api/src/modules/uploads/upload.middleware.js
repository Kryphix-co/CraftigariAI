import multer from "multer";
import { ApiError } from "../../utils/ApiError.js";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_IMAGE_FILES = 8;
const DECLARED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const multipartImages = multer({
  fileFilter(_request, file, callback) {
    if (!DECLARED_IMAGE_TYPES.has(file.mimetype.toLowerCase())) {
      callback(
        new ApiError(415, "Only JPEG, PNG, and WebP images are supported", {
          code: "UNSUPPORTED_IMAGE_TYPE",
        }),
      );
      return;
    }
    callback(null, true);
  },
  limits: {
    fileSize: MAX_IMAGE_BYTES,
    files: MAX_IMAGE_FILES,
  },
  storage: multer.memoryStorage(),
}).array("images", MAX_IMAGE_FILES);

export function acceptImageUploads(request, response, next) {
  multipartImages(request, response, (error) => {
    if (!error) {
      next();
      return;
    }
    if (error instanceof ApiError) {
      next(error);
      return;
    }
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        next(
          new ApiError(413, "Each image must be 8 MB or smaller", {
            code: "IMAGE_TOO_LARGE",
          }),
        );
        return;
      }
      next(
        new ApiError(400, "Invalid image upload", {
          code: "INVALID_IMAGE_UPLOAD",
        }),
      );
      return;
    }
    next(
      new ApiError(400, "Invalid multipart upload", {
        code: "INVALID_IMAGE_UPLOAD",
      }),
    );
  });
}
