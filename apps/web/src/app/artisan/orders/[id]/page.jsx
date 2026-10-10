"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { BottomNav } from "@/components/BottomNav";
import { apiGet, apiPatch } from "@/lib/api";

export default function ArtisanOrderDetailsPage() {
  const params = useParams();
  const id = params?.id || "demo";

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(id !== "demo");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadOrder() {
      setIsLoading(true);
      try {
        const data = await apiGet(`/api/orders/${id}`);
        if (!isCancelled) {
          setOrder(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setErrorMessage(err?.message || "Order details could not be loaded.");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    if (id && id !== "demo") {
      loadOrder();
    }

    return () => {
      isCancelled = true;
    };
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    setActionSuccess("");
    setErrorMessage("");

    try {
      const updated = await apiPatch(`/api/orders/${id}/status`, {
        orderStatus: newStatus,
      });
      setOrder(updated);
      setActionSuccess(
        newStatus === "processing"
          ? "ऑर्डर अब उत्पादन में है (Order marked in production)."
          : "ऑर्डर सफलतापूर्वक पूर्ण चिह्नित किया गया (Order marked as completed).",
      );
    } catch (err) {
      setErrorMessage(err?.message || "Failed to update order status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const orderNum = order?.orderNumber || (id !== "demo" ? id : "ORD-559-DEMO");
  const prodTitle = order?.product?.title || "Amer High-Fire Terracotta Water Urn";
  const prodImg =
    order?.product?.images?.[0] ||
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop";
  const buyerName = order?.buyerName || "Design Studio, Mumbai";
  const qty = order?.quantity ?? 80;
  const unitPrice = order?.unitPrice ?? 750;
  const totalAmount = order?.totalAmount ?? 60000;
  const timeline = order?.termsSnapshot?.timeline || "15 Days";
  const customization = order?.termsSnapshot?.customization;
  const notes = order?.termsSnapshot?.notes;
  const currentStatus = order?.orderStatus || "confirmed";
  const paymentStatus = order?.paymentStatus || "paid";
  const address = order?.deliveryAddress;

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-20 lg:pb-0">
      <ArtisanHeader activeTab="orders" />

      <main className="flex-1 w-full max-w-[1050px] mx-auto pt-6 pb-12 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/artisan/orders"
                className="text-[12px] font-bold text-secondary hover:text-primary flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                सभी ऑर्डर (All Orders)
              </Link>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">
              ऑर्डर विवरण (Order Details)
            </h1>
            <p className="text-[14px] text-secondary font-mono mt-1">
              #{orderNum}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-md text-[12px] font-bold uppercase tracking-wider border ${
                paymentStatus === "paid"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              Payment: {paymentStatus}
            </span>
            <span
              className={`px-3 py-1 rounded-md text-[12px] font-bold uppercase tracking-wider border ${
                currentStatus === "completed"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : currentStatus === "processing"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-purple-50 text-purple-700 border-purple-200"
              }`}
            >
              Fulfillment: {currentStatus}
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[13px]">
            {errorMessage}
          </div>
        )}

        {actionSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-[13px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {actionSuccess}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white border border-outline rounded-xl p-16 text-center text-secondary text-[14px] flex flex-col items-center justify-center gap-3 shadow-sm">
            <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
              progress_activity
            </span>
            <span>ऑर्डर विवरण लोड हो रहा है...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Main Info */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Product and agreed terms */}
              <div className="bg-white border border-outline shadow-sm rounded-xl overflow-hidden p-6">
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={prodImg}
                    alt={prodTitle}
                    className="w-20 h-20 rounded-lg object-cover border border-outline-variant shrink-0"
                  />
                  <div>
                    <h3 className="text-[16px] font-bold text-primary">
                      {prodTitle}
                    </h3>
                    <p className="text-[13px] text-secondary mt-1">
                      {qty} पीस × ₹{unitPrice.toLocaleString("en-IN")}
                    </p>
                    {customization && (
                      <p className="text-[12px] text-terracotta font-medium mt-1">
                        अनुकूलन (Customization): {customization}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-[14px]">
                  <div className="flex justify-between border-b border-outline border-dashed pb-2">
                    <span className="text-secondary">कुल भुगतान मूल्य (Total Paid)</span>
                    <span className="font-bold text-primary">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-outline border-dashed pb-2">
                    <span className="text-secondary">उत्पादन समय-सीमा (Timeline)</span>
                    <span className="font-bold text-primary">{timeline}</span>
                  </div>
                  {notes && (
                    <div className="border-t border-outline pt-2 text-[12px] text-secondary italic">
                      नोट (Notes): &ldquo;{notes}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Fulfilment Timeline & Status Management */}
              <div className="bg-white border border-outline shadow-sm rounded-xl overflow-hidden p-6">
                <h3 className="text-[16px] font-bold text-primary mb-6">
                  पूर्ति स्थिति (Fulfillment Status)
                </h3>

                <div className="relative border-l-2 border-outline ml-3 space-y-8 pb-4">
                  {/* Step 1: Confirmed */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center border-green-600">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                    </div>
                    <h4 className="text-[15px] font-bold text-primary">
                      ऑर्डर पुष्टि और भुगतान (Order & Payment Confirmed)
                    </h4>
                    <p className="text-[12px] mt-0.5 text-secondary">
                      Razorpay भुगतान सत्यापित हुआ
                    </p>
                  </div>

                  {/* Step 2: In Production */}
                  <div className="relative pl-6">
                    <div
                      className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${
                        currentStatus === "confirmed"
                          ? "border-primary"
                          : "border-green-600"
                      }`}
                    >
                      {currentStatus === "confirmed" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                      )}
                      {(currentStatus === "processing" ||
                        currentStatus === "completed") && (
                        <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                      )}
                    </div>
                    <h4 className="text-[15px] font-bold text-primary">
                      उत्पादन और पैकेजिंग (Production & Packaging)
                    </h4>

                    {currentStatus === "confirmed" ? (
                      <div className="mt-3">
                        <p className="text-[13px] text-secondary mb-3">
                          उत्पादन शुरू होने पर स्थिति अपडेट करें:
                        </p>
                        <button
                          disabled={isUpdatingStatus}
                          onClick={() => handleUpdateStatus("processing")}
                          className="bg-primary text-white py-2.5 px-5 rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                          {isUpdatingStatus
                            ? "अपडेट हो रहा है..."
                            : "उत्पादन शुरू करें (Start Production)"}
                        </button>
                      </div>
                    ) : (
                      <p className="text-[12px] mt-0.5 text-secondary">
                        {currentStatus === "processing"
                          ? "उत्पादन वर्तमान में जारी है"
                          : "उत्पादन पूर्ण हो गया"}
                      </p>
                    )}
                  </div>

                  {/* Step 3: Completed / Dispatched */}
                  <div className="relative pl-6">
                    <div
                      className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${
                        currentStatus === "completed"
                          ? "border-green-600"
                          : currentStatus === "processing"
                          ? "border-primary"
                          : "border-outline-variant"
                      }`}
                    >
                      {currentStatus === "completed" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                      )}
                      {currentStatus === "processing" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                      )}
                    </div>
                    <h4
                      className={`text-[15px] font-bold ${
                        currentStatus === "completed"
                          ? "text-primary"
                          : currentStatus === "processing"
                          ? "text-primary"
                          : "text-tertiary"
                      }`}
                    >
                      डिस्पैच / पूर्ण (Dispatched / Completed)
                    </h4>

                    {currentStatus === "processing" ? (
                      <div className="mt-3">
                        <p className="text-[13px] text-secondary mb-3">
                          उत्पाद तैयार और पैक होने पर पूर्ण चिह्नित करें:
                        </p>
                        <button
                          disabled={isUpdatingStatus}
                          onClick={() => handleUpdateStatus("completed")}
                          className="bg-green-700 text-white py-2.5 px-5 rounded-lg text-[13px] font-bold hover:bg-green-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                          {isUpdatingStatus
                            ? "अपडेट हो रहा है..."
                            : "ऑर्डर पूर्ण चिह्नित करें (Mark Completed)"}
                        </button>
                      </div>
                    ) : currentStatus === "completed" ? (
                      <p className="text-[12px] mt-0.5 text-green-700 font-medium">
                        ऑर्डर सफलतापूर्वक पूर्ण हो चुका है।
                      </p>
                    ) : (
                      <p className="text-[12px] mt-0.5 text-tertiary">
                        उत्पादन के बाद उपलब्ध होगा
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Buyer and Delivery Summary */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest border border-outline shadow-sm rounded-xl overflow-hidden p-6 sticky top-20">
                <h3 className="text-[14px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-outline pb-2">
                  खरीदार विवरण (Buyer Details)
                </h3>

                <div className="space-y-4">
                  <div>
                    <span className="block text-[11px] text-tertiary uppercase tracking-wide mb-1">
                      खरीदार का नाम (Buyer Name)
                    </span>
                    <span className="text-[14px] font-bold text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        person
                      </span>
                      {buyerName}
                    </span>
                  </div>

                  {order?.buyerContact?.phone && (
                    <div>
                      <span className="block text-[11px] text-tertiary uppercase tracking-wide mb-1">
                        फोन नंबर (Phone)
                      </span>
                      <span className="text-[14px] text-primary">
                        {order.buyerContact.phone}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="block text-[11px] text-tertiary uppercase tracking-wide mb-1">
                      वितरण पता (Shipping Address)
                    </span>
                    <span className="text-[14px] text-primary block leading-relaxed">
                      {address?.street ? (
                        <>
                          {address.street}
                          {address.city ? `, ${address.city}` : ""}
                          <br />
                          {address.state ? address.state : ""}
                          {address.pincode ? ` - ${address.pincode}` : ""}
                        </>
                      ) : (
                        "पता खरीदार द्वारा चैट/पूछताछ में साझा किया गया"
                      )}
                    </span>
                  </div>

                  <div className="border-t border-outline pt-4">
                    <span className="block text-[11px] text-tertiary uppercase tracking-wide mb-1">
                      भुगतान विधि (Payment Method)
                    </span>
                    <span className="text-[13px] font-medium text-green-700 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">
                        verified
                      </span>
                      Razorpay Online Payment (सत्यापित)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav activeTab="orders" />
    </div>
  );
}
