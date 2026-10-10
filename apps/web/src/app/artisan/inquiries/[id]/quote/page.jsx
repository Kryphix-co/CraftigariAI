"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";

export default function DealSummaryQuotePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id || "demo";

  const [inquiry, setInquiry] = useState(null);
  const [productTitle, setProductTitle] = useState("टेराकोटा कलश");
  const [quantity, setQuantity] = useState(80);
  const [unitPrice, setUnitPrice] = useState(750);
  const [discount, setDiscount] = useState(0);
  const [timeline, setTimeline] = useState("15 दिन");
  const [customization, setCustomization] = useState("पारंपरिक लाल फिनिश (Custom Glaze)");
  const [notes, setNotes] = useState("कस्टम फिनिश और सुरक्षित पैकेजिंग शामिल है।");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(id !== "demo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuedQuote, setIssuedQuote] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadInquiry() {
      setIsLoading(true);
      try {
        const inq = await apiGet(`/api/inquiries/${id}`);
        if (isCancelled) return;
        setInquiry(inq);

        if (inq.product?.title) setProductTitle(inq.product.title);
        if (inq.quantity) setQuantity(inq.quantity);
        if (inq.counterOfferPrice) {
          setUnitPrice(inq.counterOfferPrice);
        } else if (inq.product?.price) {
          setUnitPrice(inq.product.price);
        }
        if (inq.expectedTimeline) setTimeline(inq.expectedTimeline);
        if (inq.buyerMessage) setCustomization(inq.buyerMessage.slice(0, 100));
      } catch {
        // Fall back gracefully to defaults
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    if (id && id !== "demo") {
      loadInquiry();
    }

    return () => {
      isCancelled = true;
    };
  }, [id]);

  const toggleAudio = () => {
    if ("speechSynthesis" in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const text = `आपका प्रस्ताव: ${quantity} पीस, ₹${unitPrice} प्रति पीस, कुल ${finalAmount.toLocaleString("en-IN")} रुपये।`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "hi-IN";
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const subtotal = Math.max(0, Math.round((Number(quantity) || 0) * (Number(unitPrice) || 0)));
  const discountVal = Math.min(subtotal, Math.max(0, Math.round(Number(discount) || 0)));
  const finalAmount = Math.max(0, subtotal - discountVal);

  const handleConfirmAndSendQuote = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        inquiryId: id,
        quantity: Math.max(1, Number(quantity) || 1),
        unitPrice: Math.max(0, Number(unitPrice) || 0),
        discount: discountVal,
        timeline,
        customization,
        notes,
        status: "issued",
      };

      const result = await apiPost("/api/quotations", payload);
      setIssuedQuote(result);
    } catch (error) {
      alert(error?.message || "कोटेशन तैयार करने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBuyerLink = () => {
    if (!issuedQuote?.quotation?.quotationId) return;
    const url = `${window.location.origin}/quote/${issuedQuote.quotation.quotationId}?token=${issuedQuote.accessToken}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-24 lg:pb-0">
      <div className="w-full min-h-[calc(100vh-56px)] flex flex-col">
        {/* Top Bar Navigation */}
        <header className="w-full sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-4 lg:px-12 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
          <button
            onClick={() => router.back()}
            aria-label="वापस जाएं"
            className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-primary active:scale-95 transition-transform hover:bg-surface-container-low"
            type="button"
          >
            <span className="material-symbols-outlined text-primary text-[22px]">arrow_back</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-accent-terracotta"></span>
            <span className="font-title text-[15px] font-semibold text-primary">
              प्रस्ताव समीक्षा (Deal Summary)
            </span>
          </div>

          <button
            onClick={toggleAudio}
            aria-label="सुनें"
            className={`w-10 h-10 -mr-2 rounded-xl flex items-center justify-center active:scale-95 transition-transform ${
              isPlaying
                ? "bg-tertiary-fixed text-tertiary"
                : "text-secondary hover:bg-surface-container-low"
            }`}
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                isPlaying ? "animate-pulse" : ""
              }`}
            >
              {isPlaying ? "graphic_eq" : "volume_up"}
            </span>
          </button>
        </header>

        {/* Scrollable Content Canvas */}
        <main className="flex-1 px-4 lg:px-12 pt-6 pb-32 flex flex-col lg:justify-center overflow-y-auto">
          {issuedQuote ? (
            <div className="max-w-[700px] mx-auto w-full bg-white border border-outline rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm my-6">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[36px]">check_circle</span>
              </div>
              <h2 className="text-2xl font-bold text-primary">कोटेशन सफलतापूर्वक जारी किया गया!</h2>
              <p className="text-[14px] text-secondary max-w-[480px] mx-auto leading-relaxed">
                कोटेशन ID: <strong>{issuedQuote.quotation.quotationId}</strong>
                <br />
                कुल राशि: <strong>₹{issuedQuote.quotation.finalAmount.toLocaleString("en-IN")}</strong>
              </p>

              <div className="bg-surface-muted/30 border border-border p-4 rounded-xl text-left text-[13px] space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary">खरीदार का सुरक्षित लिंक:</span>
                  <button
                    onClick={copyBuyerLink}
                    type="button"
                    className="text-terracotta font-bold text-[12px] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedLink ? "check" : "content_copy"}
                    </span>
                    {copiedLink ? "Copied!" : "Copy Link"}
                  </button>
                </div>
                <p className="text-[11px] font-mono text-tertiary break-all bg-white p-2.5 rounded border border-border">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/quote/${issuedQuote.quotation.quotationId}?token=${issuedQuote.accessToken}`
                    : ""}
                </p>
                <p className="text-[11px] text-tertiary">
                  यह लिंक गुप्त टोकन के साथ सुरक्षित है। इसे सीधे खरीदार के साथ साझा करें।
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/artisan/inquiries"
                  className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-[14px] hover:bg-neutral-800 transition-colors"
                >
                  सभी पूछताछ देखें
                </Link>
                <a
                  href={`/quote/${issuedQuote.quotation.quotationId}?token=${issuedQuote.accessToken}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border border-border text-primary px-6 py-3 rounded-xl font-bold text-[14px] hover:bg-surface-muted transition-colors"
                >
                  खरीदार का कोटेशन पेज देखें ↗
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1 text-center lg:text-left">
                <div className="inline-flex items-center justify-center lg:justify-start gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline text-[12px] font-label font-medium text-secondary mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  <span>प्रस्ताव तैयार है</span>
                </div>
                <h1 className="font-display text-[24px] lg:text-[28px] font-bold text-primary tracking-tight">
                  कोटेशन तैयार करें
                </h1>
                <p className="font-body text-[14px] text-secondary">
                  खरीदार को भेजने से पहले विवरण जांचें और आवश्यकतानुसार बदलें
                </p>
              </div>

              <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 mt-4 lg:mt-6">
                {/* Left Column (Voice/Buyer Summary Context) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="material-symbols-outlined text-accent-terracotta text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          handshake
                        </span>
                        <span className="font-label text-[13px] font-semibold text-accent-terracotta">
                          खरीदार का संदर्भ:
                        </span>
                      </div>
                      <span className="font-label-small text-[10px] text-secondary tracking-wider bg-surface px-2 py-0.5 rounded border border-outline-variant uppercase">
                        Inquiry Context
                      </span>
                    </div>
                    <p className="font-body text-[14px] text-primary leading-relaxed bg-surface p-3 rounded-lg border border-outline-variant font-medium">
                      “{inquiry?.buyerMessage || "80 पीस दे सकता हूं। 15 दिन लगेंगे। लाल रंग हो जाएगा।" }”
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] font-label text-secondary">
                      <span
                        className="material-symbols-outlined text-success text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <span>खरीदार: {inquiry?.buyerName || "Aditi Rao"}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant">
                    <span
                      className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified_user
                    </span>
                    <p className="font-body text-[13px] text-secondary leading-relaxed">
                      कोटेशन भेजने पर खरीदार को सुरक्षित टोकन लिंक मिलेगा। आपकी निजी उत्पादन लागत कभी उजागर नहीं होगी।
                    </p>
                  </div>
                </div>

                {/* Right Column (Editable Quotation Form) */}
                <div className="lg:col-span-7 mt-6 lg:mt-0">
                  <div className="rounded-xl border border-outline bg-surface p-4 lg:p-6 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] relative overflow-hidden">
                    <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
                      <span className="font-title text-[16px] font-bold text-primary">
                        सौदा विवरण (Quotation Details)
                      </span>
                      <span className="font-label text-[12px] text-secondary bg-surface-container px-2.5 py-1 rounded-full">
                        अंतिम चरण
                      </span>
                    </div>

                    {/* Spec 1: Product */}
                    <div className="flex items-start justify-between py-2 border-b border-outline-variant/60">
                      <div className="space-y-0.5">
                        <span className="font-label text-[12px] text-secondary block">
                          उत्पाद (Product)
                        </span>
                        <span className="font-title text-[15px] text-primary font-semibold">
                          {productTitle}
                        </span>
                      </div>
                      <span className="font-label text-[11px] bg-surface-container text-on-surface px-2.5 py-1 rounded-full border border-outline-variant mt-1">
                        हस्तनिर्मित
                      </span>
                    </div>

                    {/* Spec 2: Quantity (Editable) */}
                    <div className="flex items-center justify-between py-2 border-b border-outline-variant/60">
                      <div>
                        <span className="font-label text-[12px] text-secondary block">
                          मात्रा (Quantity)
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                            className="w-24 px-2 py-1 text-[15px] font-bold border border-outline rounded-lg bg-surface"
                          />
                          <span className="text-[13px] text-secondary">पीस</span>
                        </div>
                      </div>
                    </div>

                    {/* Spec 3: Unit Price (Editable) */}
                    <div className="flex items-center justify-between py-3 border-b border-outline-variant/60 bg-surface-container-low -mx-4 lg:-mx-6 px-4 lg:px-6 border-y">
                      <div>
                        <span className="font-label text-[12px] text-secondary">
                          प्रति पीस दर (Unit Price)
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[16px] font-bold">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(Math.max(0, Number(e.target.value) || 0))}
                            className="w-28 px-2 py-1 text-[16px] font-bold border border-outline rounded-lg bg-white"
                          />
                          <span className="font-label-small text-[11px] text-secondary">
                            / प्रति पीस
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Spec 4: Optional Discount */}
                    <div className="flex items-center justify-between py-2 border-b border-outline-variant/60">
                      <div>
                        <span className="font-label text-[12px] text-secondary block">
                          विशेष छूट (Discount - Optional)
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[14px] font-bold">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={discount}
                            onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
                            className="w-28 px-2 py-1 text-[14px] font-semibold border border-outline rounded-lg bg-surface"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Spec 5: Timeline */}
                    <div className="flex items-center justify-between py-2 border-b border-outline-variant/60">
                      <div className="w-full">
                        <span className="font-label text-[12px] text-secondary block">
                          निर्माण समय (Timeline)
                        </span>
                        <input
                          type="text"
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 text-[14px] border border-outline rounded-lg bg-surface"
                        />
                      </div>
                    </div>

                    {/* Spec 6: Customization Notes */}
                    <div className="py-2 border-b border-outline-variant/60">
                      <span className="font-label text-[12px] text-secondary block">
                        विशेष विवरण / नोट्स (Customization & Notes)
                      </span>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full mt-1 p-2 text-[13px] border border-outline rounded-lg bg-surface resize-none"
                      ></textarea>
                    </div>

                    {/* Highlight Total Deal Value */}
                    <div className="pt-3 bg-[#f8f9fa] lg:bg-surface-container-low rounded-xl p-4 border border-outline flex items-center justify-between mt-2">
                      <div>
                        <span className="font-label text-[12px] text-secondary block uppercase tracking-wider font-bold">
                          कुल राशि (Total Deal Value)
                        </span>
                        <span className="font-label-small text-[12px] text-secondary mt-0.5">
                          {quantity} पीस × ₹{unitPrice} {discountVal > 0 ? `- ₹${discountVal} छूट` : ""}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-[26px] leading-tight font-bold text-primary block">
                          ₹{finalAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Bottom Actions */}
                <div className="hidden lg:flex w-full mt-6 gap-3 lg:col-span-12">
                  <button
                    disabled={isSubmitting}
                    onClick={handleConfirmAndSendQuote}
                    className="h-[52px] flex-1 bg-primary text-white rounded-xl font-title text-[16px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-neutral-800 shadow-sm disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[20px]">
                          progress_activity
                        </span>
                        <span>कोटेशन तैयार किया जा रहा है...</span>
                      </>
                    ) : (
                      <>
                        <span>प्रस्ताव भेजें / Confirm & Send Quote</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Mobile Sticky Bottom Actions Container */}
      {!issuedQuote && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-outline-variant p-4 space-y-3 z-50">
          <button
            disabled={isSubmitting}
            onClick={handleConfirmAndSendQuote}
            className="w-full h-[52px] bg-primary text-white rounded-xl font-title text-[16px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>तैयार किया जा रहा है...</span>
            ) : (
              <>
                <span>प्रस्ताव भेजें / Confirm & Send Quote</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
