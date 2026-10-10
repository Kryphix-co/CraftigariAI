import { ok, created } from "../../utils/response.js";
import {
  createQuotationService,
  getQuotationService,
  updateQuotationStatusService,
} from "./quotation.service.js";

export async function createQuotation(request, response) {
  const artisanId = request.auth.artisanId;
  const result = await createQuotationService(artisanId, request.validated.body);
  created(response, result);
}

export async function getQuotation(request, response) {
  const quotationId = request.params.quotationId;
  const artisanId = request.auth?.artisanId;
  const accessToken = request.query.token;

  const result = await getQuotationService({
    quotationId,
    artisanId,
    accessToken,
  });
  ok(response, result);
}

export async function updateQuotationStatus(request, response) {
  const quotationId = request.params.quotationId;
  const artisanId = request.auth?.artisanId;
  const accessToken = request.query.token;

  const result = await updateQuotationStatusService({
    quotationId,
    artisanId,
    accessToken,
    status: request.validated.body.status,
  });
  ok(response, result);
}
