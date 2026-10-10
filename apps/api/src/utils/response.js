export function sendSuccess(response, { data, message, statusCode = 200 }) {
  const body = { success: true, data };
  if (message) body.message = message;
  return response.status(statusCode).json(body);
}

export function ok(response, data, message) {
  return sendSuccess(response, { data, message, statusCode: 200 });
}

export function created(response, data, message) {
  return sendSuccess(response, { data, message, statusCode: 201 });
}
