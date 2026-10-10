import { ok } from "../../utils/response.js";
import {
  getOrderByNumberService,
  getArtisanOrdersService,
  updateArtisanOrderStatusService,
} from "./order.service.js";

export async function getOrderByNumber(request, response) {
  const orderNumber = request.params.orderNumber;
  const token = request.query.token || request.headers["x-order-token"];
  const artisanId = request.auth?.artisanId;

  const result = await getOrderByNumberService({
    orderNumber,
    token,
    artisanId,
  });
  ok(response, result);
}

export async function getArtisanOrders(request, response) {
  const artisanId = request.auth.artisanId;
  const result = await getArtisanOrdersService(
    artisanId,
    request.validated?.query || {},
  );
  ok(response, result);
}

export async function updateArtisanOrderStatus(request, response) {
  const orderNumber = request.params.orderNumber;
  const artisanId = request.auth.artisanId;
  const result = await updateArtisanOrderStatusService({
    orderNumber,
    artisanId,
    orderStatus: request.validated.body.orderStatus,
  });
  ok(response, result);
}
