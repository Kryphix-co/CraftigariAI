import { ok, created } from "../../utils/response.js";
import {
  addInquiryMessageService,
  createInquiryService,
  getInquiryDealSaathiService,
  getInquiryDetailsService,
  getInquiryFairDealService,
  listArtisanInquiriesService,
} from "./inquiry.service.js";

export async function createInquiry(request, response) {
  const result = await createInquiryService(request.validated.body);
  created(response, result);
}

export async function listArtisanInquiries(request, response) {
  const artisanId = request.auth.artisanId;
  const result = await listArtisanInquiriesService(artisanId, request.validated.query);
  ok(response, result);
}

export async function getInquiryDetails(request, response) {
  const inquiryId = request.params.inquiryId;
  const artisanId = request.auth?.artisanId;
  const accessToken = request.query.token;

  const result = await getInquiryDetailsService({
    inquiryId,
    artisanId,
    accessToken,
  });
  ok(response, result);
}

export async function addInquiryMessage(request, response) {
  const inquiryId = request.params.inquiryId;
  const artisanId = request.auth?.artisanId;
  const accessToken = request.query.token;

  const result = await addInquiryMessageService({
    inquiryId,
    artisanId,
    accessToken,
    ...request.validated.body,
  });
  ok(response, result);
}

export async function getInquiryFairDeal(request, response) {
  const inquiryId = request.params.inquiryId;
  const artisanId = request.auth.artisanId;
  const result = await getInquiryFairDealService({ inquiryId, artisanId });
  ok(response, result);
}

export async function getInquiryDealSaathi(request, response) {
  const inquiryId = request.params.inquiryId;
  const artisanId = request.auth.artisanId;
  const language = request.query.lang || request.body?.language || "hi";
  const result = await getInquiryDealSaathiService({
    inquiryId,
    artisanId,
    language,
  });
  ok(response, result);
}
