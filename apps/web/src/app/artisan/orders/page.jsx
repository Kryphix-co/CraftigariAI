"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { BottomNav } from "@/components/BottomNav";
import { apiGet } from "@/lib/api";

const STATUS_FILTERS = [
  { key: "all", label: "सभी (All)" },
  { key: "active", label: "सक्रिय (Active)" },
  { key: "completed", label: "पूर्ण (Delivered / Completed)" },
];

export default function ArtisanOrdersPage() {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadOrders() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const query = filter === "all" ? "" : `?status=${filter}`;
        const data = await apiGet(`/api/orders${query}`);
        if (!isCancelled) {
          setOrders(data?.orders || []);
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error?.message || "Failed to load orders.");
          setOrders([]);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadOrders();
    return () => {
      isCancelled = true;
    };
  }, [filter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "हाल ही में (Recent)";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-20 lg:pb-0">
      <ArtisanHeader activeTab="orders" />

      <main className="flex-1 w-full max-w-[1100px] mx-auto pt-6 pb-12 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">
              मेरे ऑर्डर (My Orders)
            </h1>
            <p className="text-[13px] text-secondary mt-0.5">
              वास्तविक पुष्टि किए गए ऑर्डर और भुगतान विवरण
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
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[13px]">
            {errorMessage}
          </div>
        )}

        <div className="bg-white border border-outline rounded-xl overflow-hidden shadow-sm">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-outline bg-surface-container-lowest text-[12px] font-bold text-secondary uppercase tracking-wider">
            <div className="col-span-2">Order #</div>
            <div className="col-span-4">Product & Buyer</div>
            <div className="col-span-2">Value & Qty</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
          </div>

          {isLoading ? (
            <div className="p-16 text-center text-secondary text-[14px] flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
                progress_activity
              </span>
              <span>ऑर्डर लोड हो रहे हैं (Loading orders)...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center text-secondary text-[14px] flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[40px] text-outline">
                inbox
              </span>
              <p className="font-semibold text-primary">कोई ऑर्डर नहीं मिला (No orders found)</p>
              <p className="text-[12px] text-secondary max-w-sm">
                जब खरीदार कोटेशन स्वीकार करके भुगतान करेंगे, उनके ऑर्डर यहाँ दिखाई देंगे।
              </p>
            </div>
          ) : (
            <div className="divide-y divide-outline">
              {orders.map((order) => {
                const prodTitle = order.product?.title || "Craftigari Product";
                const prodImg =
                  order.product?.images?.[0] ||
                  "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop";

                return (
                  <Link
                    href={`/artisan/orders/${order.orderNumber}`}
                    key={order.orderNumber}
                    className="block hover:bg-surface-container-lowest transition-colors group"
                  >
                    <div className="p-4 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center flex flex-col gap-3">
                      <div className="lg:col-span-2 flex justify-between lg:block">
                        <span className="lg:hidden text-[12px] text-secondary">
                          Order #:
                        </span>
                        <span className="text-[13px] font-mono font-bold text-primary">
                          #{order.orderNumber}
                        </span>
                      </div>

                      <div className="lg:col-span-4 flex items-start gap-3">
                        <img
                          src={prodImg}
                          alt={prodTitle}
                          className="w-12 h-12 rounded-lg object-cover border border-outline-variant shrink-0 hidden sm:block"
                        />
                        <div>
                          <h3 className="text-[14px] font-bold text-primary group-hover:text-terracotta transition-colors line-clamp-1">
                            {prodTitle}
                          </h3>
                          <p className="text-[12px] text-secondary mt-0.5">
                            {order.buyerName}
                          </p>
                        </div>
                      </div>

                      <div className="lg:col-span-2 flex justify-between lg:block">
                        <span className="lg:hidden text-[12px] text-secondary">
                          Value/Qty:
                        </span>
                        <div>
                          <span className="text-[14px] font-bold text-primary">
                            ₹{order.totalAmount?.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[12px] text-secondary block">
                            {order.quantity} pcs
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-2 flex justify-between lg:block">
                        <span className="lg:hidden text-[12px] text-secondary">
                          Date:
                        </span>
                        <span className="text-[13px] text-tertiary">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>

                      <div className="lg:col-span-2 flex justify-between lg:block items-center">
                        <span className="lg:hidden text-[12px] text-secondary">
                          Status:
                        </span>
                        <div className="flex flex-col items-end lg:items-start gap-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase border ${
                              order.orderStatus === "completed"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : order.orderStatus === "processing"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                          <span className="text-[10px] text-green-700 font-semibold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">
                              check_circle
                            </span>
                            Paid
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <BottomNav activeTab="orders" />
    </div>
  );
}
