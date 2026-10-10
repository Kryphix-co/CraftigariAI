"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { apiGet, apiPatch } from "@/lib/api";

function BuyerQuotationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id || "demo";
  const token = searchParams.get("token") || "";

  const [quotation, setQuotation] = useState(null);
  const [isLoading, setIsLoading] = useState(id !== "demo");
  const [statusActionMessage, setStatusActionMessage] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadQuotation() {
      setIsLoading(true);
      try {
        const query = token ? `?token=${encodeURIComponent(token)}` : "";
        const data = await apiGet(`/api/quotations/${id}${query}`);
        if (!isCancelled) {
          setQuotation(data);
        }
      } catch {
        // Fall back gracefully to demo quote if token is not provided or demo id
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    if (id && id !== "demo") {
      loadQuotation();
    }

    return () => {
      isCancelled = true;
    };
  }, [id, token]);

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const query = token ? `?token=${encodeURIComponent(token)}` : "";
      const updated = await apiPatch(`/api/quotations/${id}/status${query}`, {
        status: newStatus,
      });
      setQuotation(updated);
      setStatusActionMessage(
        newStatus === "accepted"
          ? "You have accepted this quotation. The artisan has been notified!"
          : "You have declined this quotation. The artisan has been notified.",
      );
    } catch (error) {
      alert(error?.message || "Failed to update quotation status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const productImg =
    quotation?.product?.images?.[0] ||
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop";
  const productTitle = quotation?.product?.title || "Amer High-Fire Terracotta Water Urn";
  const artisanName = quotation?.artisan?.name || "Master Ram Singh";
  const artisanLocation = quotation?.artisan?.location || "Amer, Rajasthan Cluster";
  const qty = quotation?.quantity ?? 80;
  const unitPrice = quotation?.unitPrice ?? 750;
  const finalAmount = quotation?.finalAmount ?? 60000;
  const timeline = quotation?.timeline || "15 Days";
  const customization = quotation?.customization || "Red Finish (Custom Glaze)";
  const notes =
    quotation?.notes ||
    "I have accounted for the custom red glaze in this price. The kiln is ready for your batch.";
  const currentStatus = quotation?.status || "issued";

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />

      <main className="flex-1 w-full flex flex-col bg-surface-muted/20 items-center py-8 sm:py-16 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-[1000px] bg-white border border-border shadow-sm p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-6">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-terracotta block mb-2">
                Official Deal Offer
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                Quotation Confirmation
              </h1>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[11px] font-mono text-tertiary uppercase mb-1">
                Reference No.
              </div>
              <div className="break-all font-mono text-[14px] font-bold text-primary">
                {quotation?.quotationId ? quotation.quotationId.toUpperCase() : `QTN-${id.toUpperCase()}`}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-16 text-center text-secondary text-[14px] flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
                progress_activity
              </span>
              <span>Loading quotation details...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              {/* Left: Product & Artisan Context */}
              <div className="md:col-span-5 flex flex-col gap-5">
                <div className="aspect-[4/3] bg-surface-muted border border-border overflow-hidden">
                  <img
                    src={productImg}
                    alt={productTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-primary mb-1">{productTitle}</h2>
                  <div className="flex items-center gap-2 text-[12px] text-secondary mt-2">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span className="font-medium text-primary">{artisanName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-secondary mt-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span>{artisanLocation}</span>
                  </div>
                </div>
              </div>

              {/* Right: Terms & Actions */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
                    <h3 className="text-[14px] font-bold text-primary uppercase tracking-wider">
                      Proposed Terms
                    </h3>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${
                        currentStatus === "accepted"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : currentStatus === "declined"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }`}
                    >
                      Status: {currentStatus}
                    </span>
                  </div>

                  <div className="space-y-3 text-[13px] sm:text-[14px]">
                    <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2">
                      <span className="text-secondary">Quantity</span>
                      <span className="text-right font-bold text-primary">{qty} Pieces</span>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2">
                      <span className="text-secondary">Unit Price</span>
                      <span className="text-right font-bold text-primary">₹{unitPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2">
                      <span className="text-secondary">Production Timeline</span>
                      <span className="text-right font-bold text-primary">{timeline}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2">
                      <span className="text-secondary">Customization</span>
                      <span className="max-w-[60%] break-words text-right font-bold text-primary">
                        {customization}
                      </span>
                    </div>
                    {quotation?.discount > 0 && (
                      <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2 text-green-700">
                        <span>Discount Applied</span>
                        <span className="text-right font-bold">- ₹{quotation.discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 bg-surface-muted p-4 border border-border flex justify-between items-center">
                    <span className="text-[14px] font-semibold text-secondary">Final Quoted Amount</span>
                    <span className="text-xl sm:text-2xl font-bold text-primary">
                      ₹{finalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {notes && (
                    <div className="mt-4 p-4 border-l-2 border-terracotta bg-terracotta/5">
                      <p className="text-[12px] text-primary italic leading-relaxed">
                        &ldquo;{notes}&rdquo; <span className="font-semibold">— {artisanName}</span>
                      </p>
                    </div>
                  )}

                  {statusActionMessage && (
                    <div className="mt-4 p-3 rounded bg-blue-50 border border-blue-200 text-blue-900 text-[13px] font-medium">
                      {statusActionMessage}
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-border">
                  {currentStatus === "accepted" ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded text-center text-green-800 space-y-3">
                      <div className="flex items-center justify-center gap-1.5 font-bold text-[15px]">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span>Quotation Accepted</span>
                      </div>
                      <p className="text-[12px] text-green-700 max-w-[420px] mx-auto">
                        Your agreement is confirmed with {artisanName}. Complete payment securely to start production.
                      </p>
                      <div className="pt-2">
                        <Link
                          href={`/quote/${quotation?.quotationId || id}/payment${token ? `?token=${encodeURIComponent(token)}` : ""}`}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-8 text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">lock</span>
                          Proceed to Payment (₹{finalAmount.toLocaleString("en-IN")})
                        </Link>
                      </div>
                    </div>
                  ) : currentStatus === "declined" ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded text-center text-amber-800 space-y-1">
                      <span className="font-bold text-[14px]">Quotation Declined</span>
                      <p className="text-[12px] text-amber-700">
                        You have declined this quotation. You can submit another inquiry anytime.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          disabled={isUpdatingStatus}
                          onClick={() => handleUpdateStatus("accepted")}
                          className="flex-1 bg-primary text-white text-center py-3.5 px-6 text-[14px] font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {isUpdatingStatus ? "Processing..." : "Accept Quote"}
                        </button>
                        <button
                          disabled={isUpdatingStatus}
                          onClick={() => handleUpdateStatus("declined")}
                          className="flex-1 bg-white border border-border text-primary text-center py-3.5 px-6 text-[14px] font-bold hover:border-primary transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Decline Offer
                        </button>
                      </div>
                      <div className="text-center pt-2">
                        <Link
                          href="/products"
                          className="text-[12px] font-medium text-tertiary hover:text-secondary underline underline-offset-2"
                        >
                          Explore Other Clusters
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <BuyerFooter />
    </div>
  );
}

export default function BuyerQuotationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <BuyerQuotationContent />
    </Suspense>
  );
}
