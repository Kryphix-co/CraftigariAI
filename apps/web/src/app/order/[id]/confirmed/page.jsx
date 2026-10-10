"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { apiGet } from "@/lib/api";

function OrderConfirmedContent() {
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
  const qty = order?.quantity ?? 80;
  const totalAmount = order?.totalAmount ?? 60000;
  const timeline = order?.termsSnapshot?.timeline || "15 Days";

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />

      <main className="flex-1 w-full flex flex-col items-center justify-center py-12 sm:py-20 px-4 sm:px-6">
        <div className="w-full max-w-[750px] border border-border bg-white p-6 sm:p-12 text-center shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px] text-green-700">
                check_circle
              </span>
            </div>
          </div>

          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-green-700 block mb-1">
            Payment Verified & Recorded
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-2">
            Order Confirmed
          </h1>
          <p className="text-[14px] text-secondary">
            Your payment was verified. The artisan has received the confirmed order and will begin crafting.
          </p>

          <div className="mt-3 font-mono text-[13px] font-bold text-primary bg-surface-muted py-1.5 px-4 rounded inline-block">
            {orderNum}
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-secondary text-[13px]">
              <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
                progress_activity
              </span>
              <span>Loading confirmed order details...</span>
            </div>
          ) : errorMessage && !order ? (
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded text-[13px]">
              {errorMessage}
            </div>
          ) : (
            <div className="mt-8 border border-border bg-surface-muted/30 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-left">
              <div className="w-24 h-24 bg-surface-muted border border-border shrink-0 overflow-hidden">
                <img
                  src={productImg}
                  alt={productTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 w-full text-center sm:text-left">
                <h3 className="text-[16px] font-bold text-primary mb-1">
                  {productTitle}
                </h3>
                <p className="text-[13px] text-secondary">
                  {artisanName} • {qty} Pieces
                </p>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-border pt-4">
                  <div>
                    <span className="block text-[11px] text-tertiary uppercase tracking-wider mb-0.5">
                      Total Paid
                    </span>
                    <span className="text-[15px] font-bold text-primary">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-tertiary uppercase tracking-wider mb-0.5">
                      Production Timeline
                    </span>
                    <span className="text-[15px] font-bold text-primary">
                      {timeline}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="block text-[11px] text-tertiary uppercase tracking-wider mb-0.5">
                      Payment Status
                    </span>
                    <span className="inline-flex items-center gap-1 text-[13px] font-bold text-green-700">
                      <span className="material-symbols-outlined text-[16px]">
                        verified
                      </span>
                      Paid (Razorpay)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={`/order/${orderNum}${token ? `?token=${encodeURIComponent(token)}` : ""}`}
              className="bg-primary text-white py-3.5 px-8 text-[14px] font-bold hover:bg-neutral-800 transition-colors inline-block w-full sm:w-auto"
            >
              Track Order Status
            </Link>
            <Link
              href="/products"
              className="bg-white border border-border text-primary py-3.5 px-8 text-[14px] font-bold hover:border-primary transition-colors inline-block w-full sm:w-auto"
            >
              Explore Other Crafts
            </Link>
          </div>
        </div>
      </main>

      <BuyerFooter />
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <OrderConfirmedContent />
    </Suspense>
  );
}
