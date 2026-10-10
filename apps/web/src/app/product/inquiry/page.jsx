"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { useCatalogProduct } from "@/hooks/useCatalog";
import { getStaticProductById } from "@/lib/catalog";
import { apiPost } from "@/lib/api";

function ProductInquiryContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") || "p1";
  const { product } = useCatalogProduct(productId);
  const selectedProduct = product ?? getStaticProductById("p1");

  const [quantity, setQuantity] = useState(selectedProduct?.minQty || 80);
  const [expectedTimeline, setExpectedTimeline] = useState("Standard (15 Days)");
  const [buyerMessage, setBuyerMessage] = useState(
    "Looking for custom architectural units for our project. Require traditional finish and secure packaging.",
  );
  const [proposedPrice, setProposedPrice] = useState(selectedProduct?.price || 750);
  const [buyerName, setBuyerName] = useState("Aditi Rao");
  const [buyerPhone, setBuyerPhone] = useState("+91 98765 43210");
  const [buyerEmail, setBuyerEmail] = useState("aditi@studio.com");
  const [buyerOrganization, setBuyerOrganization] = useState("Studio Architecture");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        productId: selectedProduct.id,
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim(),
        buyerEmail: buyerEmail.trim(),
        buyerOrganization: buyerOrganization.trim(),
        quantity: Math.max(1, Number(quantity) || 1),
        buyerMessage: buyerMessage.trim(),
        expectedTimeline,
        proposedPrice: proposedPrice ? Math.max(0, Number(proposedPrice)) : undefined,
      };

      if (selectedProduct.isSampleProduct || selectedProduct.isLocalDemo) {
        const demoInquiryId = `DEMO-${Date.now().toString(36).toUpperCase()}`;
        const demoResult = {
          inquiry: {
            ...payload,
            inquiryId: demoInquiryId,
            productName: selectedProduct.name,
            status: "submitted",
          },
          isDemo: true,
        };
        sessionStorage.setItem(
          `craftigari.demo-inquiry.${demoInquiryId}`,
          JSON.stringify(demoResult),
        );
        setSubmissionResult(demoResult);
        return;
      }

      const result = await apiPost("/api/inquiries", payload);
      setSubmissionResult(result);
    } catch (error) {
      setErrorMessage(
        error?.message || "Failed to submit inquiry. Please verify your details and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyStatusLink = () => {
    if (!submissionResult?.inquiry?.inquiryId) return;
    const url = `${window.location.origin}/quote/${submissionResult.inquiry.inquiryId}?token=${submissionResult.accessToken}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />

      <main className="flex-1 w-full flex flex-col items-center py-8 sm:py-16 px-4 sm:px-6 lg:px-12 bg-surface-muted/20">
        <div className="w-full max-w-[840px]">
          <div className="mb-6 sm:mb-10">
            <Link
              href={`/products/${selectedProduct.id}`}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-secondary hover:text-primary transition-colors mb-6"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Product</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary leading-tight">
              Direct Buyer Inquiry
            </h1>
            <p className="mt-2 break-words text-[14px] text-secondary">
              Direct craftsman allocation request for {selectedProduct.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Product Summary */}
            <div className="border border-border bg-white p-5 shadow-sm sm:p-6 md:sticky md:top-24 md:col-span-5">
              <div className="aspect-[4/3] w-full mb-5 overflow-hidden border border-border">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[30px]">image_not_supported</span>
                  </div>
                )}
              </div>
              <h3 className="break-words text-[15px] font-bold text-primary">{selectedProduct.name}</h3>
              <p className="mt-1 break-words text-[13px] text-secondary">
                {selectedProduct.artisan} • {selectedProduct.region}
              </p>

              <div className="mt-5 pt-5 border-t border-border flex justify-between items-baseline">
                <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">
                  Base Rate
                </span>
                <div className="text-right">
                  <span className="text-[18px] font-bold text-primary">
                    ₹{selectedProduct.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[12px] text-secondary"> / piece</span>
                </div>
              </div>
              <p className="text-[11px] text-tertiary font-mono mt-1 text-right">
                MOQ: {selectedProduct.minQty} pieces
              </p>
            </div>

            {/* Right: Inquiry Form or Success State */}
            <div className="relative overflow-hidden border border-border bg-white p-4 shadow-sm sm:p-8 md:col-span-7">
              {submissionResult ? (
                <div className="bg-white z-10 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-forest text-[32px]">check_circle</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-secondary">
                      Inquiry #{submissionResult.inquiry?.inquiryId}
                    </span>
                    <h3 className="text-xl font-bold text-primary mt-1">Inquiry Sent to Artisan</h3>
                  </div>
                  <p className="text-[13px] text-secondary max-w-[340px] leading-relaxed">
                    {submissionResult.isDemo ? (
                      <>
                        Prototype inquiry created for <strong>{selectedProduct.artisan}</strong> using the
                        sample catalog. No live message was sent.
                      </>
                    ) : (
                      <>
                        Your inquiry has been stored securely and dispatched to{" "}
                        <strong>{selectedProduct.artisan}</strong>. The artisan will review your requirements via
                        Deal Saathi and prepare a quotation.
                      </>
                    )}
                  </p>

                  {submissionResult.accessToken && (
                    <div className="w-full bg-surface-muted/30 border border-border p-3 rounded-lg text-left text-[12px] space-y-1.5 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-primary">Your Private Access Token:</span>
                        <button
                          onClick={copyStatusLink}
                          type="button"
                          className="text-terracotta hover:underline font-medium inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {copiedLink ? "check" : "content_copy"}
                          </span>
                          {copiedLink ? "Copied!" : "Copy Link"}
                        </button>
                      </div>
                      <p className="text-[11px] text-tertiary font-mono truncate">
                        {submissionResult.accessToken}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full">
                    <Link
                      href="/products"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-center text-[13px] font-bold text-white transition-colors hover:bg-neutral-800"
                    >
                      Browse More Crafts
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-[12px] font-semibold text-primary">
                        Your Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="e.g. Aditi Rao"
                        className="w-full bg-surface-muted/30 border border-border px-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[12px] font-semibold text-primary">
                        Organization / Studio
                      </label>
                      <input
                        type="text"
                        value={buyerOrganization}
                        onChange={(e) => setBuyerOrganization(e.target.value)}
                        placeholder="e.g. Studio Architecture"
                        className="w-full bg-surface-muted/30 border border-border px-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-[12px] font-semibold text-primary">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-surface-muted/30 border border-border px-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[12px] font-semibold text-primary">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-surface-muted/30 border border-border px-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-[12px] font-semibold text-primary">
                        Target Quantity *
                      </label>
                      <input
                        required
                        min={1}
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full bg-surface-muted/30 border border-border px-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[12px] font-semibold text-primary">
                        Expected Timeline
                      </label>
                      <select
                        value={expectedTimeline}
                        onChange={(e) => setExpectedTimeline(e.target.value)}
                        className="w-full bg-surface-muted/30 border border-border px-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors appearance-none"
                      >
                        <option>Standard (15 Days)</option>
                        <option>Expedited (10 Days)</option>
                        <option>Flexible (30+ Days)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[12px] font-semibold text-primary">
                      Customization & Project Notes *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={buyerMessage}
                      onChange={(e) => setBuyerMessage(e.target.value)}
                      placeholder="Specify dimensions, finishing, event details, or requirements..."
                      className="w-full bg-surface-muted/30 border border-border px-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <label className="block text-[12px] font-semibold text-primary">
                        Proposed Price per Unit (Optional)
                      </label>
                      <span className="text-[10px] text-tertiary font-mono">Fair Deal Shield</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[14px]">
                        ₹
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={proposedPrice}
                        onChange={(e) => setProposedPrice(e.target.value)}
                        className="w-full bg-surface-muted/30 border border-border pl-8 pr-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full bg-primary text-white py-4 px-6 text-[14px] font-bold tracking-tight hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 rounded-xl disabled:opacity-70 shadow-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">
                            progress_activity
                          </span>
                          <span>Submitting to Artisan...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">send</span>
                          <span>Submit Genuine Inquiry</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-tertiary mt-3">
                      Your inquiry will be registered directly with the craftsperson. Private production
                      costs are never exposed.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <BuyerFooter />
    </div>
  );
}

export default function ProductInquiryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductInquiryContent />
    </Suspense>
  );
}
