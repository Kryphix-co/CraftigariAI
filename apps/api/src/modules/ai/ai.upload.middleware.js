import multer from "multer";
import { ApiError } from "../../utils/ApiError.js";

export const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const ALLOWED_AUDIO_TYPES = new Set([
  "audio/webm",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/mp4",
  "audio/m4a",
  "audio/mpeg",
  "audio/mp3",
  "audio/aac",
  "audio/x-m4a",
]);

const audioMulter = multer({
  fileFilter(_request, file, callback) {
    const mime = file.mimetype.toLowerCase();
    const isAllowedMime =
      ALLOWED_AUDIO_TYPES.has(mime) ||
      (mime === "application/octet-stream" &&
        /\.(webm|ogg|wav|mp3|m4a|mp4|aac)$/i.test(file.originalname));

    if (!isAllowedMime) {
      callback(
        new ApiError(
          415,
          "Only WebM, OGG, WAV, MP4, AAC, and MP3 audio files are supported",
          { code: "UNSUPPORTED_AUDIO_TYPE" },
        ),
      );
      return;
    }
    callback(null, true);
  },
  limits: {
    fileSize: MAX_AUDIO_BYTES,
    files: 1,
  },
  storage: multer.memoryStorage(),
}).single("audio");

export function acceptAudioUpload(request, response, next) {
  const contentType = request.headers["content-type"] || "";
  if (contentType.includes("application/json")) {
    next();
    return;
  }

  audioMulter(request, response, (error) => {
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
          new ApiError(413, "Audio recording must be 10 MB or smaller", {
            code: "AUDIO_TOO_LARGE",
          }),
        );
        return;
      }
      next(
        new ApiError(400, "Invalid audio upload", {
          code: "INVALID_AUDIO_UPLOAD",
        }),
      );
      return;
    }
    next(
      new ApiError(400, "Invalid multipart upload", {
        code: "INVALID_AUDIO_UPLOAD",
      }),
    );
  });
}
