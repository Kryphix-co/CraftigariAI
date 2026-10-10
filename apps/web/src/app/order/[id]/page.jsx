"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { apiGet } from "@/lib/api";

function OrderTrackingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id || "demo";
  const token = searchParams.get("token") || "";

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(id !== "demo");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadOrder() {
      setIsLoading(true);
      try {
        const query = token ? `?token=${encodeURIComponent(token)}` : "";
        const data = await apiGet(`/api/orders/${id}${query}`);
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
  }, [id, token]);

  const orderNum = order?.orderNumber || (id !== "demo" ? id : "ORD-559-DEMO");
  const productImg =
    order?.product?.images?.[0] ||
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop";
  const productTitle =
    order?.product?.title || "Amer High-Fire Terracotta Water Urn";
  const artisanName = order?.artisan?.name || "Master Ram Singh";
  const artisanLocation = order?.artisan?.location || "Amer, Rajasthan";
  const qty = order?.quantity ?? 80;
  const unitPrice = order?.unitPrice ?? 750;
  const totalAmount = order?.totalAmount ?? 60000;
  const timeline = order?.termsSnapshot?.timeline || "15 Days";
  const customization = order?.termsSnapshot?.customization;
  const paymentStatus = order?.paymentStatus || "paid";
  const orderStatus = order?.orderStatus || "confirmed";
  const address = order?.deliveryAddress;

  const trackingStages = [
    {
      name: "Payment Verified",
      desc: "Escrow received via Razorpay",
      status: paymentStatus === "paid" ? "completed" : "pending",
    },
    {
      name: "Order Confirmed",
      desc: "Artisan accepted batch production",
      status:
        orderStatus === "confirmed" ||
        orderStatus === "processing" ||
        orderStatus === "completed"
          ? "completed"
          : "pending",
    },
    {
      name: "Handcrafting & Packing",
      desc: `Kiln production (${timeline})`,
      status:
        orderStatus === "completed"
          ? "completed"
          : orderStatus === "processing"
          ? "current"
          : "upcoming",
    },
    {
      name: "Dispatched / Completed",
      desc: "Handed over to delivery or completed",
      status: orderStatus === "completed" ? "completed" : "upcoming",
    },
  ];

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />

      <main className="flex-1 w-full flex flex-col items-center py-8 sm:py-16 px-4 sm:px-6 lg:px-12 bg-surface-muted/20">
        <div className="w-full max-w-[950px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                  Order Management
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border ${
                    paymentStatus === "paid"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  Payment: {paymentStatus}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                Order Tracking
              </h1>
              <p className="mt-1 font-mono text-[13px] text-secondary">
                {orderNum}
              </p>
            </div>

            <span
              className={`px-3 py-1 text-[12px] font-bold uppercase tracking-wide rounded border ${
                orderStatus === "completed"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : orderStatus === "processing"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-surface text-primary border-border"
              }`}
            >
              Order Status: {orderStatus}
            </span>
          </div>

          {isLoading ? (
            <div className="bg-white border border-border p-16 text-center text-secondary text-[14px] flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
                progress_activity
              </span>
              <span>Loading genuine order tracking details...</span>
            </div>
          ) : errorMessage && !order ? (
            <div className="bg-white border border-red-200 p-8 text-center space-y-4">
              <span className="material-symbols-outlined text-[40px] text-red-600">
                lock
              </span>
              <h2 className="text-xl font-bold text-primary">Access Restricted</h2>
              <p className="text-[14px] text-secondary max-w-md mx-auto">
                {errorMessage}
              </p>
              <Link
                href="/products"
                className="inline-block bg-primary text-white py-3 px-6 text-[14px] font-bold hover:bg-neutral-800 transition-colors"
              >
                Return to Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: Order Summary */}
              <div className="md:col-span-5 flex flex-col gap-6">
                <div className="bg-white border border-border p-6 shadow-sm">
                  <h3 className="text-[12px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
                    Purchased Item
                  </h3>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-surface-muted border border-border shrink-0 overflow-hidden">
                      <img
                        src={productImg}
                        alt={productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-primary mb-0.5">
                        {productTitle}
                      </h4>
                      <p className="text-[12px] text-secondary">
                        {artisanName} ({artisanLocation})
                      </p>
                      <p className="text-[12px] text-secondary mt-0.5">
                        {qty} Pieces × ₹{unitPrice.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-[13px] border-t border-border pt-4">
                    {customization && (
                      <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2">
                        <span className="text-secondary">Customization</span>
                        <span className="font-medium text-primary text-right max-w-[60%]">
                          {customization}
                        </span>
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2">
                      <span className="text-secondary">Timeline</span>
                      <span className="font-medium text-primary text-right">
                        {timeline}
                      </span>
                    </div>
                    {address?.street && (
                      <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2">
                        <span className="text-secondary">Delivery Destination</span>
                        <span className="font-medium text-primary text-right">
                          {address.street}
                          {address.city ? `, ${address.city}` : ""}
                          {address.state ? `, ${address.state}` : ""}
                          {address.pincode ? ` - ${address.pincode}` : ""}
                        </span>
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-4 pt-2">
                      <span className="text-secondary font-bold">Total Paid</span>
                      <span className="font-bold text-primary text-[16px]">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-muted border border-border p-4 text-[12px] text-secondary space-y-1">
                  <div className="font-semibold text-primary">Need assistance?</div>
                  <p>
                    Your order is confirmed directly with {artisanName}. Inquiries can be referenced with {orderNum}.
                  </p>
                </div>
              </div>

              {/* Right Column: Real Lifecycle Status */}
              <div className="md:col-span-7">
                <div className="bg-white border border-border p-6 sm:p-8 shadow-sm">
                  <h3 className="text-[14px] font-bold text-primary mb-8 border-b border-border pb-3 uppercase tracking-wider">
                    Production & Fulfillment Timeline
                  </h3>

                  <div className="relative border-l-2 border-border ml-3 space-y-8 pb-4">
                    {trackingStages.map((stage, i) => (
                      <div key={i} className="relative pl-8">
                        <div
                          className={`absolute -left-[10px] top-0.5 w-[18px] h-[18px] rounded-full border-2 bg-white flex items-center justify-center ${
                            stage.status === "completed"
                              ? "border-green-600 bg-green-50"
                              : stage.status === "current"
                              ? "border-primary bg-primary/10"
                              : "border-border"
                          }`}
                        >
                          {stage.status === "completed" && (
                            <span className="w-2 h-2 rounded-full bg-green-600"></span>
                          )}
                          {stage.status === "current" && (
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                          )}
                        </div>

                        <div>
                          <h4
                            className={`text-[15px] font-bold ${
                              stage.status === "upcoming"
                                ? "text-tertiary"
                                : "text-primary"
                            }`}
                          >
                            {stage.name}
                          </h4>
                          <p
                            className={`text-[12px] mt-0.5 ${
                              stage.status === "upcoming"
                                ? "text-tertiary"
                                : "text-secondary"
                            }`}
                          >
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-border flex justify-between items-center text-[12px] text-secondary">
                    <span>Order Date: {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "Recent"}</span>
                    <Link
                      href="/products"
                      className="font-bold text-primary underline underline-offset-2 hover:text-neutral-700"
                    >
                      Browse More Crafts
                    </Link>
                  </div>
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

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <OrderTrackingContent />
    </Suspense>
  );
}
