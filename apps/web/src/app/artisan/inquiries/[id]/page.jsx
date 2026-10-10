"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";

export default function DealSaathiInquiryPage() {
  const params = useParams();
  const id = params?.id || "demo";

  const [inquiry, setInquiry] = useState(null);
  const [dealSaathi, setDealSaathi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replySuccessMessage, setReplySuccessMessage] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadInquiryAndAi() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const inqData = await apiGet(`/api/inquiries/${id}`);
        if (isCancelled) return;
        setInquiry(inqData);

        // Preload cached dealSaathi or request from AI service
        if (inqData.dealSaathi) {
          setDealSaathi(inqData.dealSaathi);
          setReplyText(inqData.dealSaathi.suggestedReply || "");
        } else {
          setIsAiLoading(true);
          try {
            const aiData = await apiPost(`/api/inquiries/${id}/deal-saathi`, {
              language: "hi",
            });
            if (!isCancelled) {
              setDealSaathi(aiData);
              setReplyText(aiData.suggestedReply || "");
            }
          } catch {
            // Non-blocking: fallback will still render or allow manual reply
          } finally {
            if (!isCancelled) setIsAiLoading(false);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error?.message || "Failed to load inquiry details.");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    if (id) {
      loadInquiryAndAi();
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
        const textToSpeak = dealSaathi?.explanation || inquiry?.buyerMessage || "नई पूछताछ";
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
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

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSendingReply(true);
    setReplySuccessMessage("");

    try {
      const updated = await apiPost(`/api/inquiries/${id}/messages`, {
        message: replyText.trim(),
      });
      setInquiry(updated);
      setReplySuccessMessage("संदेश सफलतापूर्वक भेजा गया (Reply sent)");
      setTimeout(() => setReplySuccessMessage(""), 4000);
    } catch (error) {
      alert(error?.message || "Could not send reply");
    } finally {
      setIsSendingReply(false);
    }
  };

  const productImg =
    inquiry?.product?.images?.[0] ||
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop";
  const productTitle = inquiry?.product?.title || "हस्तनिर्मित उत्पाद";
  const buyerName = inquiry?.buyerName || "खरीदार";
  const buyerLocation =
    inquiry?.buyerContact?.organization || inquiry?.expectedTimeline || "भारत";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
          progress_activity
        </span>
        <p className="text-[14px] font-medium text-secondary">
          पूछताछ लोड हो रही है... (Loading Inquiry)
        </p>
      </div>
    );
  }

  if (errorMessage && !inquiry) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h2 className="text-xl font-bold text-primary">Inquiry Not Found</h2>
        <p className="text-[14px] text-secondary max-w-[320px]">{errorMessage}</p>
        <Link
          href="/artisan/inquiries"
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-[13px] font-bold"
        >
          Back to Inquiries
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-24 lg:pb-0">
      <div className="w-full min-h-[calc(100vh-56px)] flex flex-col">
        {/* Top App Bar */}
        <header className="w-full sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-4 lg:px-12 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
          <div className="flex items-center space-x-3">
            <Link
              href="/artisan/inquiries"
              aria-label="वापस जाएं"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <span className="font-title text-[15px] text-on-surface tracking-tight font-semibold lg:hidden">
              पूछताछ विवरण
            </span>
            <span className="font-headline text-[20px] text-primary tracking-tight font-bold hidden lg:block">
              Craftigari डील साथी
            </span>
          </div>

          <nav className="hidden lg:flex items-center space-x-6 text-[14px] font-medium h-full">
            <Link
              href="/artisan/dashboard"
              className="h-full flex items-center text-secondary hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/artisan/inquiries"
              className="h-full flex items-center text-primary border-b-2 border-primary"
            >
              Inquiries
            </Link>
            <Link
              href="/artisan/profile"
              className="h-full flex items-center text-secondary hover:text-primary transition-colors"
            >
              Profile
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleAudio}
              aria-label="ध्वनि सहायता"
              className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${
                isPlaying
                  ? "bg-tertiary-fixed border-tertiary-fixed-dim text-tertiary"
                  : "bg-surface border-transparent hover:bg-surface-container text-on-surface-variant"
              }`}
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isPlaying ? "animate-pulse" : ""
                }`}
              >
                {isPlaying ? "graphic_eq" : "volume_up"}
              </span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="w-full flex-1 px-4 lg:px-12 pt-6 pb-12 flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 overflow-y-auto">
          {/* Left Column (Context & Original Buyer Message) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <section className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline text-on-surface-variant text-[12px] font-label font-medium">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span>डील साथी • AI सहायता सक्रिय</span>
              </div>
              <h1 className="font-display text-[26px] lg:text-[32px] text-primary tracking-tight font-bold mt-2">
                नई पूछताछ
              </h1>
              <p className="font-body-medium text-[14px] text-secondary">
                {buyerName} ने आपके उत्पाद के लिए अनुरोध भेजा है
              </p>
            </section>

            {/* Buyer & Product Context Unit */}
            <section className="p-3 lg:p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface border border-outline-variant">
                <img className="w-full h-full object-cover" alt="Product" src={productImg} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-label-small text-[11px] text-secondary tracking-wide uppercase">
                  उत्पाद संदर्भ
                </p>
                <p className="font-body-medium text-[14px] text-primary font-semibold truncate mt-0.5">
                  {productTitle}
                </p>
                <div className="flex items-center gap-1.5 font-label text-[12px] text-on-surface-variant mt-1.5">
                  <span className="material-symbols-outlined text-[14px] text-secondary">person</span>
                  <span className="truncate">
                    {buyerName} ({buyerLocation})
                  </span>
                </div>
              </div>
            </section>

            {/* Original Buyer Message */}
            <section className="rounded-xl bg-surface-container-low lg:bg-surface border border-outline-variant p-4 space-y-3">
              <div className="flex items-center justify-between font-label text-[12px] text-secondary">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                  खरीदार ने लिखा (Original Message):
                </span>
                <span className="font-label-small text-[10px] px-2 py-0.5 rounded-full bg-surface border border-outline-variant text-secondary">
                  Buyer Note
                </span>
              </div>
              <p className="font-body text-[14px] text-on-surface-variant italic pl-3 border-l-[3px] border-outline leading-relaxed whitespace-pre-wrap">
                “{inquiry?.buyerMessage}”
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant text-[13px]">
                <div>
                  <span className="text-[11px] text-secondary uppercase block">मात्रा (Quantity)</span>
                  <span className="font-bold text-primary">{inquiry?.quantity} Pieces</span>
                </div>
                <div>
                  <span className="text-[11px] text-secondary uppercase block">प्रस्तावित दर</span>
                  {inquiry?.proposedPrice ? (
                    <span className="font-bold text-primary">₹{inquiry.proposedPrice} / पीस</span>
                  ) : (
                    <span className="text-secondary italic">कोई प्रस्ताव नहीं दिया</span>
                  )}
                </div>
              </div>
            </section>

            {/* Fair Deal Shield Callout */}
            {inquiry?.proposedPrice ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-amber-700 text-[24px]">
                    verified_user
                  </span>
                  <div>
                    <h4 className="text-[13px] font-bold text-amber-900">फेयर डील शील्ड (Fair Deal Shield)</h4>
                    <p className="text-[12px] text-amber-800">
                      खरीदार ने ₹{inquiry.proposedPrice} का प्रस्ताव रखा है। लाभ/हानि की जांच करें।
                    </p>
                  </div>
                </div>
                <Link
                  href={`/artisan/inquiries/${id}/fair-deal`}
                  className="px-3 py-1.5 rounded-lg bg-amber-700 text-white text-[12px] font-bold whitespace-nowrap hover:bg-amber-800 transition-colors"
                >
                  जांचें →
                </Link>
              </div>
            ) : null}
          </div>

          {/* Right Column (Deal Saathi Breakdown & Actions) */}
          <div className="lg:col-span-7 flex flex-col mt-6 lg:mt-0 lg:pl-4 space-y-6">
            {/* Main Core Section: Deal Saathi Breakdown */}
            <section className="rounded-xl border border-outline bg-surface p-4 lg:p-6 space-y-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 right-0 h-1 bg-tertiary-container"></div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                    <span className="material-symbols-outlined text-[20px]">handshake</span>
                  </div>
                  <div>
                    <h2 className="font-title text-[18px] font-bold text-primary">
                      Craftigari ने आसान भाषा में समझाया
                    </h2>
                    {isAiLoading && (
                      <span className="text-[11px] text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined animate-spin text-[12px]">
                          progress_activity
                        </span>
                        AI विश्लेषण तैयार हो रहा है...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {dealSaathi?.explanation && (
                <p className="text-[14px] leading-relaxed text-secondary bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                  {dealSaathi.explanation}
                </p>
              )}

              {/* Clean Takeaway Rows */}
              <div className="space-y-4 divide-y divide-outline-variant">
                {(dealSaathi?.keyTakeaways || []).map((t, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 pt-3 first:pt-0">
                    <div className="flex items-center gap-3">
                      <span className="font-body-medium text-[14px] text-secondary font-medium">
                        {t.label}:
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-body-medium text-[15px] text-primary font-bold block">
                        {t.value}
                      </span>
                      {t.tag && (
                        <span className="font-label text-[11px] text-success font-medium mt-0.5 block">
                          {t.tag}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Follow-up Questions */}
              {dealSaathi?.questionsToAsk?.length > 0 && (
                <div className="pt-2">
                  <span className="text-[12px] font-bold text-secondary uppercase tracking-wider block mb-2">
                    खरीदार से पूछने के लिए ज़रूरी बातें:
                  </span>
                  <ul className="list-disc pl-5 text-[13px] text-secondary space-y-1">
                    {dealSaathi.questionsToAsk.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Audio Affordance Button */}
              <div className="pt-2">
                <button
                  onClick={toggleAudio}
                  className={`w-full h-12 rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
                    isPlaying
                      ? "bg-tertiary-fixed border-tertiary-fixed-dim text-tertiary"
                      : "bg-surface-container-low border-outline hover:bg-surface-container text-primary"
                  }`}
                  type="button"
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isPlaying ? "animate-pulse" : "text-tertiary-container"
                    }`}
                  >
                    {isPlaying ? "graphic_eq" : "volume_up"}
                  </span>
                  <span className="font-body-medium text-[15px] font-semibold">
                    {isPlaying
                      ? "ऑडियो बज रहा है... (रोकने के लिए दबाएं)"
                      : "बोलकर सुनें (Listen to explanation)"}
                  </span>
                </button>
              </div>
            </section>

            {/* Editable AI Suggested Reply */}
            <section className="rounded-xl border border-outline bg-white p-4 lg:p-6 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-[15px] font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-terracotta text-[18px]">
                    smart_toy
                  </span>
                  सुझाया गया जवाब (Editable Reply)
                </h3>
                <span className="text-[11px] text-secondary">कारीगर के नियंत्रण में</span>
              </div>

              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="खरीदार को अपना संदेश लिखें..."
                className="w-full bg-surface-muted/30 border border-border p-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors rounded-lg resize-none"
              ></textarea>

              {replySuccessMessage && (
                <div className="p-2.5 rounded bg-green-50 border border-green-200 text-green-800 text-[12px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>{replySuccessMessage}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  disabled={isSendingReply || !replyText.trim()}
                  onClick={handleSendReply}
                  type="button"
                  className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-[13px] font-semibold hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSendingReply ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[16px]">
                        progress_activity
                      </span>
                      <span>भेज रहे हैं...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span>जवाब भेजें (Send Reply)</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/artisan/inquiries/${id}/quote`}
                  className="text-terracotta text-[13px] font-bold hover:underline"
                >
                  सीधा कोटेशन बनाएं →
                </Link>
              </div>
            </section>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex gap-4 pt-2">
              <Link
                href={`/artisan/inquiries/${id}/fair-deal`}
                className="flex-1 h-[52px] bg-surface text-secondary border border-outline rounded-xl font-title text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-surface-container-low active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                <span>फेयर डील शील्ड (Fair Deal)</span>
              </Link>
              <Link
                href={`/artisan/inquiries/${id}/quote`}
                className="flex-[2] h-[52px] bg-primary text-white rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-neutral-800 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">request_quote</span>
                <span className="font-title text-[16px] font-bold">
                  कोटेशन तैयार करें (Create Quotation) →
                </span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sticky Bottom Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-outline-variant p-4 space-y-2">
        <Link
          href={`/artisan/inquiries/${id}/quote`}
          className="w-full h-[52px] bg-primary text-white rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-neutral-800 active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">request_quote</span>
          <span className="font-title text-[16px] font-semibold">
            कोटेशन तैयार करें (Create Quote) →
          </span>
        </Link>
      </div>
    </div>
  );
}
