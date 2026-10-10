import { ApiError } from "../utils/ApiError.js";

export function validateRequest(validators = {}) {
  return (request, _response, next) => {
    const validated = {};
    const errors = [];

    for (const source of ["params", "query", "body"]) {
      const validator = validators[source];
      if (!validator) continue;
      const result = validator(request[source] ?? {});
      if (result.errors?.length) errors.push(...result.errors);
      validated[source] = result.value;
    }

    if (errors.length) {
      return next(
        new ApiError(400, "Request validation failed", {
          code: "VALIDATION_ERROR",
          details: errors,
        }),
      );
    }

    request.validated = { ...(request.validated ?? {}), ...validated };
    return next();
  };
}
