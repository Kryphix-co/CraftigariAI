"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { useProductDraft } from "@/features/product/ProductDraftContext";
import { apiGet, apiPost } from "@/lib/api";

export default function ArtisanFairDealPage({ params }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams?.id || "demo";
  const { draft } = useProductDraft();

  const initialCost =
    draft?.pricing?.totalCost && draft.pricing.totalCost > 0
      ? draft.pricing.totalCost
      : 600;

  const initialPreviousQuote =
    draft?.pricing?.finalPrice && draft.pricing.finalPrice > 0
      ? draft.pricing.finalPrice
      : 750;

  const [totalCost, setTotalCost] = useState(initialCost);
  const [offerPrice, setOfferPrice] = useState(450);
  const [previousQuote, setPreviousQuote] = useState(initialPreviousQuote);
  const [counterOfferPrice, setCounterOfferPrice] = useState(700);
  const [hasBuyerOffer, setHasBuyerOffer] = useState(true);
  const [productTitle, setProductTitle] = useState("");
  const [isEditingCosts, setIsEditingCosts] = useState(false);
  const [actionNotice, setActionNotice] = useState("");
  const [isLoading, setIsLoading] = useState(id !== "demo");

  // Load real inquiry fair deal evaluation from backend
  useEffect(() => {
    let isCancelled = false;

    async function loadRealFairDeal() {
      setIsLoading(true);
      try {
        const data = await apiGet(`/api/inquiries/${id}/fair-deal`);
        if (isCancelled) return;

        if (data.productTitle) setProductTitle(data.productTitle);
        if (data.totalCost) setTotalCost(data.totalCost);
        if (data.suggestedPrice) setPreviousQuote(data.suggestedPrice);
        if (data.counterOfferPrice) setCounterOfferPrice(data.counterOfferPrice);

        if (data.hasBuyerOffer === false) {
          setHasBuyerOffer(false);
        } else if (data.offerPrice !== undefined) {
          setOfferPrice(data.offerPrice);
          setHasBuyerOffer(true);
        }
      } catch {
        // Fall back gracefully to local draft or defaults
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    if (id && id !== "demo") {
      loadRealFairDeal();
    }

    return () => {
      isCancelled = true;
    };
  }, [id]);

  // Real calculation based on artisan-provided costs
  const evaluation = useMemo(() => {
    const cost = Math.max(0, Math.round(Number(totalCost) || 0));
    const offer = Math.max(0, Math.round(Number(offerPrice) || 0));
    const diff = offer - cost;
    const isBelowCost = cost > 0 && offer < cost;
    const belowCostAmount = isBelowCost ? cost - offer : 0;
    const profitAmount = cost > 0 && offer > cost ? offer - cost : 0;

    let warning = "";
    if (!hasBuyerOffer) {
      warning = "खरीदार ने कोई लक्षित दर प्रस्तावित नहीं की है। आप अपनी पसंद का कोटेशन भेज सकते हैं।";
    } else if (cost === 0) {
      warning = "No declared production costs recorded for this craft. Enter cost to evaluate.";
    } else if (isBelowCost) {
      warning = `Warning: This offer is ₹${belowCostAmount.toLocaleString("en-IN")} below your declared production cost.`;
    } else if (offer === cost) {
      warning = "This offer covers only your declared production costs with zero profit.";
    } else {
      warning = `Estimated profit: ₹${profitAmount.toLocaleString("en-IN")} before any unaccounted fees.`;
    }

    return {
      cost,
      offer,
      diff,
      isBelowCost,
      belowCostAmount,
      profitAmount,
      warning,
    };
  }, [totalCost, offerPrice, hasBuyerOffer]);

  const handleSendCounterOffer = async (e) => {
    e.preventDefault();
    try {
      if (id && id !== "demo") {
        await apiPost(`/api/inquiries/${id}/messages`, {
          message: `कारीगर का जवाबी प्रस्ताव: ₹${counterOfferPrice} प्रति पीस।`,
          counterOfferPrice,
        });
      }
      setActionNotice(
        `जवाबी प्रस्ताव (₹${counterOfferPrice.toLocaleString("en-IN")}) सफलतापूर्वक दर्ज किया गया। अब आप कोटेशन भेज सकते हैं।`,
      );
    } catch {
      setActionNotice(
        `जवाबी प्रस्ताव: ₹${counterOfferPrice.toLocaleString("en-IN")} तैयार है।`,
      );
    }
  };

  const handleDecline = () => {
    setActionNotice("प्रस्ताव अस्वीकार करने का निर्णय दर्ज किया गया।");
  };

  const handleAcceptAnyway = () => {
    setActionNotice("चेतावनी स्वीकार कर इस दर पर आगे बढ़ने का निर्णय लिया गया।");
  };

  if (isLoading) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[32px] text-[#1A1A1A]">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] font-sans antialiased min-h-screen flex flex-col">
      <ArtisanHeader activeTab="inquiries" />

      <main className="w-full flex-1 px-4 sm:px-6 lg:px-12 py-8 flex justify-center">
        <div className="w-full max-w-[900px] flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#666666] text-[12px] font-medium">
              <span
                className={`w-2 h-2 rounded-full ${
                  !hasBuyerOffer
                    ? "bg-blue-500"
                    : evaluation.isBelowCost
                    ? "bg-[#EAB308]"
                    : "bg-emerald-500"
                }`}
              ></span>
              <span>क्रेता का प्रस्ताव मूल्यांकन (Fair Deal Shield)</span>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingCosts(!isEditingCosts)}
              className="text-[12px] font-semibold text-[#92400E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">tune</span>
              <span>{isEditingCosts ? "मूल्यांकन देखें" : "उत्पाद लागत समायोजित करें"}</span>
            </button>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
            {/* Header / Shield Visual */}
            <div
              className={`p-6 sm:p-8 border-b border-[#E5E5E5] ${
                !hasBuyerOffer
                  ? "bg-blue-50/50"
                  : evaluation.isBelowCost
                  ? "bg-[#FEFCE8]"
                  : "bg-emerald-50/40"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    !hasBuyerOffer
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : evaluation.isBelowCost
                      ? "bg-[#FEF08A] text-[#854D0E] border-[#FDE047]"
                      : "bg-emerald-100 text-emerald-800 border-emerald-200"
                  }`}
                >
                  <span className="material-symbols-outlined text-[28px]">
                    {!hasBuyerOffer ? "info" : evaluation.isBelowCost ? "warning" : "verified"}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                    {!hasBuyerOffer
                      ? "खरीदार ने दर प्रस्तावित नहीं की"
                      : evaluation.isBelowCost
                      ? "लागत से कम प्रस्ताव — नुकसान की चेतावनी"
                      : "उचित लाभप्रद प्रस्ताव (Profitable Offer)"}
                  </h1>
                  <p className="text-[14px] text-[#666666] mt-1 leading-relaxed">
                    {productTitle && <strong>{productTitle} • </strong>}
                    {evaluation.warning}
                  </p>
                </div>
              </div>
            </div>

            {/* Editable production costs panel */}
            {isEditingCosts && (
              <div className="p-6 bg-[#FAFAFA] border-b border-[#E5E5E5] text-[13px] space-y-3">
                <span className="font-bold text-[#1A1A1A] block">
                  उत्पादन लागत समायोजित करें (Declared Cost):
                </span>
                <div className="flex items-center gap-3">
                  <label className="text-[#666666]">कुल लागत (₹):</label>
                  <input
                    type="number"
                    min="0"
                    value={totalCost}
                    onChange={(e) =>
                      setTotalCost(Math.max(0, Math.round(Number(e.target.value) || 0)))
                    }
                    className="w-32 px-3 py-1.5 border border-[#CCCCCC] rounded-lg text-[14px] font-bold bg-white"
                  />
                  <span className="text-[12px] text-[#666666]">प्रति पीस</span>
                </div>
              </div>
            )}

            {/* Content Body */}
            <div className="p-6 sm:p-8">
              {/* Cost / Price Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {/* Buyer Offer */}
                <div
                  className={`p-4 border rounded-lg flex flex-col items-center sm:items-start text-center sm:text-left ${
                    !hasBuyerOffer
                      ? "bg-slate-50 border-slate-200"
                      : evaluation.isBelowCost
                      ? "bg-[#FEFCE8] border-[#FEF08A]"
                      : "bg-emerald-50/50 border-emerald-200"
                  }`}
                >
                  <span className="text-[12px] font-semibold text-[#666666] uppercase tracking-wide">
                    खरीदार का प्रस्ताव
                    <br />
                    (Buyer Offer)
                  </span>
                  <span
                    className={`text-[24px] font-bold mt-2 ${
                      !hasBuyerOffer
                        ? "text-slate-600 text-[18px]"
                        : evaluation.isBelowCost
                        ? "text-[#854D0E]"
                        : "text-emerald-700"
                    }`}
                  >
                    {hasBuyerOffer ? (
                      <>
                        ₹{evaluation.offer.toLocaleString("en-IN")}{" "}
                        <span className="text-[12px] font-medium text-[#666666]">/ pc</span>
                      </>
                    ) : (
                      "दर तय नहीं की"
                    )}
                  </span>
                </div>

                {/* Declared Cost */}
                <div className="p-4 border border-[#FDE68A] rounded-lg bg-[#FFFBEB] flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-[12px] font-semibold text-[#92400E] uppercase tracking-wide">
                    आपकी घोषित लागत
                    <br />
                    (Minimum Safe Price)
                  </span>
                  <span className="text-[24px] font-bold text-[#92400E] mt-2">
                    ₹{evaluation.cost.toLocaleString("en-IN")}{" "}
                    <span className="text-[12px] font-medium text-[#B45309]">/ pc</span>
                  </span>
                </div>

                {/* Previous Quote / Suggested Price */}
                <div className="p-4 border border-[#E5E5E5] rounded-lg bg-white flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-[12px] font-semibold text-[#666666] uppercase tracking-wide">
                    आपकी मानक कीमत
                    <br />
                    (Base Selling Price)
                  </span>
                  <span className="text-[24px] font-bold text-[#1A1A1A] mt-2">
                    ₹{previousQuote.toLocaleString("en-IN")}{" "}
                    <span className="text-[12px] font-medium text-[#666666]">/ pc</span>
                  </span>
                </div>
              </div>

              {/* Counter-Offer Configuration */}
              <div className="bg-[#FAFAFA] p-4 rounded-lg mb-6 border border-[#E5E5E5] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#1A1A1A]">
                    आपका जवाबी प्रस्ताव (Adjust Counter Offer):
                  </span>
                  <span className="text-[11px] text-[#666666]">
                    लागत पर उचित लाभ सुनिश्चित करने के लिए दर तय करें
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-[#1A1A1A]">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={counterOfferPrice}
                    onChange={(e) =>
                      setCounterOfferPrice(Math.max(0, Math.round(Number(e.target.value) || 0)))
                    }
                    className="w-28 px-3 py-1.5 border border-[#CCCCCC] rounded-lg text-[15px] font-bold text-right bg-white outline-none focus:border-[#1A1A1A]"
                  />
                  <span className="text-[12px] text-[#666666]">/ pc</span>
                </div>
              </div>

              {actionNotice && (
                <div className="mb-6 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[13px] font-medium">
                  {actionNotice}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-[#E5E5E5] pt-6">
                <button
                  type="button"
                  onClick={handleSendCounterOffer}
                  className="w-full sm:w-auto flex-1 bg-[#1A1A1A] text-white py-3.5 px-6 rounded-lg text-[15px] font-bold hover:bg-[#333333] transition-colors shadow-sm text-center cursor-pointer"
                >
                  जवाबी दर दर्ज करें (Counter: ₹{counterOfferPrice.toLocaleString("en-IN")})
                </button>
                <Link
                  href={`/artisan/inquiries/${id}/quote`}
                  className="w-full sm:w-auto flex-1 bg-white border border-[#1A1A1A] text-[#1A1A1A] py-3.5 px-6 rounded-lg text-[15px] font-bold hover:bg-[#F3F4F6] transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <span className="material-symbols-outlined text-[18px]">request_quote</span>
                  कोटेशन तैयार करें (Create Quote) →
                </Link>
              </div>

              <div className="text-center sm:text-right mt-4">
                <button
                  type="button"
                  onClick={handleDecline}
                  className="text-[12px] text-[#666666] hover:text-[#1A1A1A] underline decoration-[#CCCCCC] underline-offset-4 font-medium mr-4 cursor-pointer"
                >
                  प्रस्ताव अस्वीकार करें (Decline)
                </button>
                {evaluation.isBelowCost && (
                  <button
                    type="button"
                    onClick={handleAcceptAnyway}
                    className="text-[12px] text-[#92400E] hover:text-[#B45309] underline decoration-[#FCD34D] underline-offset-4 font-medium cursor-pointer"
                  >
                    फिर भी स्वीकार करें (Accept Anyway)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
