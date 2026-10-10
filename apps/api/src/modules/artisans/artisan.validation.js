const PROFILE_FIELDS = new Set([
  "name",
  "location",
  "craftSpecialization",
  "bio",
  "profilePhoto",
]);

function isHttpUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProfileUpdate(input) {
  const errors = [];
  const value = {};
  const limits = {
    name: 120,
    location: 180,
    craftSpecialization: 160,
    bio: 2000,
    profilePhoto: 2000,
  };

  for (const field of Object.keys(input)) {
    if (!PROFILE_FIELDS.has(field)) {
      errors.push({ field, message: "Profile field cannot be changed" });
      continue;
    }
    if (typeof input[field] !== "string") {
      errors.push({ field, message: "Must be a string" });
      continue;
    }
    const normalized = input[field].trim();
    if (normalized.length > limits[field]) {
      errors.push({
        field,
        message: `Must be at most ${limits[field]} characters`,
      });
      continue;
    }
    value[field] = normalized;
  }

  if (value.profilePhoto !== undefined && !isHttpUrl(value.profilePhoto)) {
    errors.push({
      field: "profilePhoto",
      message: "Must be an HTTP or HTTPS URL",
    });
  }
  if (!Object.keys(value).length && !errors.length) {
    errors.push({ field: "body", message: "At least one profile field is required" });
  }
  return { value, errors };
}
