export function validateUpdateOrderStatus(body = {}) {
  const errors = [];
  const value = {};

  const allowedStatuses = new Set(["processing", "completed", "cancelled"]);
  if (!body.orderStatus || !allowedStatuses.has(body.orderStatus)) {
    errors.push({
      field: "orderStatus",
      message: "Order status must be one of: processing, completed, cancelled",
    });
  } else {
    value.orderStatus = body.orderStatus;
  }

  return { errors, value };
}

export function validateOrderQuery(query = {}) {
  const value = {};
  if (query.status && typeof query.status === "string") {
    value.status = query.status.trim().toLowerCase();
  } else {
    value.status = "all";
  }

  return { errors: [], value };
}
