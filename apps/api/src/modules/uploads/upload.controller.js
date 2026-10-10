import { sendSuccess } from "../../utils/response.js";
import { uploadArtisanImages } from "./upload.service.js";

export async function uploadImages(request, response) {
  const images = await uploadArtisanImages(
    request.auth.artisanId,
    request.files,
  );
  return sendSuccess(response, {
    data: { images },
    message: "Images uploaded",
    statusCode: 201,
  });
}
