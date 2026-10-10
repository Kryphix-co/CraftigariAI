"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { BottomNav } from "@/components/BottomNav";
import { apiGet } from "@/lib/api";

const STATUS_FILTERS = [
  { key: "all", label: "सभी (All)" },
  { key: "new", label: "नई (New)" },
  { key: "in_discussion", label: "बातचीत जारी (In Discussion)" },
  { key: "quoted", label: "कोटेशन भेजा (Quoted)" },
  { key: "closed", label: "स्वीकृत / समाप्त (Closed)" },
];

export default function ArtisanInquiriesPage() {
  const [filter, setFilter] = useState("all");
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadInquiries() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const query = filter === "all" ? "" : `?status=${filter}`;
        const data = await apiGet(`/api/inquiries${query}`);
        if (!isCancelled) {
          setInquiries(data?.items || []);
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error?.message || "Inquiries could not be loaded.");
          // Fallback to empty list rather than hardcoded demo
          setInquiries([]);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadInquiries();
    return () => {
      isCancelled = true;
    };
  }, [filter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const statusBadgeClass = (status) => {
    switch (status) {
      case "new":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "in_discussion":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "quoted":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "closed":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-surface-container text-secondary border-outline";
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case "new":
        return "नई पूछताछ (New)";
      case "in_discussion":
        return "बातचीत जारी (In Discussion)";
      case "quoted":
        return "कोटेशन भेजा (Quoted)";
      case "closed":
        return "स्वीकृत / बंद (Closed)";
      default:
        return status;
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-20 lg:pb-0">
      <ArtisanHeader activeTab="inquiries" />

      <main className="flex-1 w-full max-w-[1100px] mx-auto pt-6 pb-12 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">
              सभी पूछताछ (Inquiries)
            </h1>
            <p className="text-[13px] text-secondary mt-1">
              खरीदारों के सीधे संदेश और डील साथी सहायता
            </p>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 sm:pb-0">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${
                  filter === f.key
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-outline text-secondary hover:bg-surface-container-low"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[13px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">info</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setFilter(filter)}
              className="font-semibold underline hover:text-amber-900"
            >
              Retry
            </button>
          </div>
        )}

        <div className="bg-white border border-outline rounded-xl overflow-hidden shadow-sm">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-outline bg-surface-container-lowest text-[12px] font-bold text-secondary uppercase tracking-wider">
            <div className="col-span-5">Product & Buyer</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Status</div>
          </div>

          <div className="divide-y divide-outline">
            {isLoading ? (
              <div className="p-12 text-center text-secondary text-[14px] flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
                  progress_activity
                </span>
                <span>पूछताछ लोड हो रही है... (Loading inquiries)</span>
              </div>
            ) : inquiries.length > 0 ? (
              inquiries.map((inq) => {
                const productImg =
                  inq.product?.images?.[0] ||
                  "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop";
                const productTitle = inq.product?.title || "हस्तशिल्प उत्पाद";

                return (
                  <Link
                    href={`/artisan/inquiries/${inq.inquiryId}`}
                    key={inq.inquiryId}
                    className="block hover:bg-surface-container-lowest transition-colors group"
                  >
                    <div className="p-4 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center flex flex-col gap-3">
                      {/* Mobile Top Row / Desktop Col 1 */}
                      <div className="lg:col-span-5 flex items-start gap-3">
                        <img
                          src={productImg}
                          alt={productTitle}
                          className="w-14 h-14 rounded-lg object-cover border border-outline-variant shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-[14px] font-bold text-primary group-hover:text-terracotta transition-colors truncate">
                            {productTitle}
                          </h3>
                          <p className="text-[12px] text-secondary mt-0.5 truncate">
                            {inq.buyerName} {inq.buyerContact?.organization ? `(${inq.buyerContact.organization})` : ""}
                          </p>
                          {inq.proposedPrice && (
                            <span className="text-[11px] font-mono text-terracotta mt-1 inline-block">
                              प्रस्ताव: ₹{inq.proposedPrice} / पीस
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="lg:col-span-2 flex justify-between lg:block">
                        <span className="lg:hidden text-[12px] text-secondary">Quantity:</span>
                        <span className="text-[14px] font-medium text-primary">{inq.quantity} pcs</span>
                      </div>

                      <div className="lg:col-span-2 flex justify-between lg:block">
                        <span className="lg:hidden text-[12px] text-secondary">Date:</span>
                        <span className="text-[13px] text-tertiary">{formatDate(inq.createdAt)}</span>
                      </div>

                      <div className="lg:col-span-3 flex justify-between lg:block items-center">
                        <span className="lg:hidden text-[12px] text-secondary">Status:</span>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border ${statusBadgeClass(
                            inq.status,
                          )}`}
                        >
                          {statusLabel(inq.status)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="p-12 text-center text-secondary text-[14px] flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[36px] text-tertiary">
                  inbox
                </span>
                <p className="font-semibold text-primary">कोई पूछताछ नहीं मिली (No Inquiries Found)</p>
                <p className="text-[12px] text-secondary max-w-[320px]">
                  जैसे ही कोई खरीदार आपके उत्पादों के लिए अनुरोध भेजेगा, वह यहां दिखाई देगा।
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav activeTab="inquiries" />
    </div>
  );
}
