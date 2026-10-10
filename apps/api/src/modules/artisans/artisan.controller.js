import { sendSuccess } from "../../utils/response.js";
import { isProfileComplete } from "../auth/auth.service.js";
import { listForArtisan as listArtisanProducts } from "../products/product.controller.js";
import { updateArtisanProfile } from "./artisan.service.js";
import { getPublicArtisanProfile } from "./artisan.service.js";

export { listArtisanProducts };

function serializeArtisan(artisan) {
  return typeof artisan.toJSON === "function" ? artisan.toJSON() : artisan;
}

export async function getMyProfile(request, response) {
  return sendSuccess(response, {
    data: {
      artisan: serializeArtisan(request.auth.artisan),
      profileComplete: isProfileComplete(request.auth.artisan),
    },
  });
}

export async function updateMyProfile(request, response) {
  const artisan = await updateArtisanProfile(
    request.auth.artisanId,
    request.validated.body,
  );
  return sendSuccess(response, {
    data: {
      artisan: serializeArtisan(artisan),
      profileComplete: isProfileComplete(artisan),
    },
    message: "Artisan profile updated",
  });
}

export async function getPublicProfile(request, response) {
  const artisan = await getPublicArtisanProfile(
    request.validated.params.artisanId,
  );
  const serialized = serializeArtisan(artisan);
  delete serialized.phone;
  return sendSuccess(response, { data: { artisan: serialized } });
}
