"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { apiGet, apiPost } from "@/lib/api";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function BuyerPaymentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id || "demo";
  const token = searchParams.get("token") || "";

  const [quotation, setQuotation] = useState(null);
  const [isLoading, setIsLoading] = useState(id !== "demo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    let isCancelled = false;

    async function fetchQuotation() {
      setIsLoading(true);
      try {
        const query = token ? `?token=${encodeURIComponent(token)}` : "";
        const data = await apiGet(`/api/quotations/${id}${query}`);
        if (!isCancelled) {
          setQuotation(data);
          if (data.buyerName) {
            setDeliveryAddress((prev) => ({
              ...prev,
              name: data.buyerName,
            }));
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setErrorMessage(err?.message || "Failed to load quotation details.");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    if (id && id !== "demo") {
      fetchQuotation();
    }

    return () => {
      isCancelled = true;
    };
  }, [id, token]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayNow = async () => {
    setErrorMessage("");
    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error(
          "Could not load Razorpay checkout SDK. Please verify your internet connection.",
        );
      }

      const query = token ? `?token=${encodeURIComponent(token)}` : "";
      const initiateData = await apiPost(`/api/payments/initiate${query}`, {
        quotationId: quotation?.quotationId || id,
        deliveryAddress,
      });

      const options = {
        key: initiateData.keyId,
        amount: initiateData.amount,
        currency: initiateData.currency || "INR",
        name: "Craftigari",
        description: `Order ${initiateData.orderNumber} - ${initiateData.productTitle}`,
        order_id: initiateData.razorpayOrderId,
        prefill: {
          name: deliveryAddress.name || initiateData.buyerName,
          contact: deliveryAddress.phone || initiateData.buyerContact?.phone,
          email: initiateData.buyerContact?.email,
        },
        theme: {
          color: "#2C2A29",
        },
        handler: async function (response) {
          try {
            await apiPost(`/api/payments/verify${query}`, {
              quotationId: quotation?.quotationId || id,
              orderNumber: initiateData.orderNumber,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            router.push(
              `/order/${initiateData.orderNumber}/confirmed${query}`,
            );
          } catch (verifyErr) {
            setErrorMessage(
              verifyErr?.message ||
                "Payment verification failed. Please contact support.",
            );
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        setErrorMessage(
          response?.error?.description ||
            "Payment failed. You can safely retry checkout.",
        );
        setIsProcessing(false);
      });

      razorpayInstance.open();
    } catch (err) {
      setErrorMessage(
        err?.message || "Payment initiation failed. Please try again.",
      );
      setIsProcessing(false);
    }
  };

  const productImg =
    quotation?.product?.images?.[0] ||
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop";
  const productTitle =
    quotation?.product?.title || "Amer High-Fire Terracotta Water Urn";
  const artisanName = quotation?.artisan?.name || "Master Ram Singh";
  const artisanLocation =
    quotation?.artisan?.location || "Amer, Rajasthan Cluster";
  const qty = quotation?.quantity ?? 80;
  const unitPrice = quotation?.unitPrice ?? 750;
  const finalAmount = quotation?.finalAmount ?? 60000;
  const timeline = quotation?.timeline || "15 Days";
  const customization = quotation?.customization || "Standard Craftsmanship";
  const isAccepted = quotation?.status === "accepted";

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />

      <main className="flex-1 w-full flex flex-col bg-surface-muted/20 items-center py-8 sm:py-16 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-[1050px]">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[24px] text-green-700">
                  verified
                </span>
                <span className="text-[12px] font-bold uppercase tracking-wider text-green-700">
                  Accepted Quotation Checkout
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                Secure Deal Payment
              </h1>
              <p className="text-[14px] text-secondary mt-1">
                Direct artisan escrow via official Razorpay integration.
              </p>
            </div>
            <div className="font-mono text-[13px] bg-white border border-border px-3 py-2 text-secondary">
              Ref: {quotation?.quotationId ? quotation.quotationId.toUpperCase() : `QTN-${id.toUpperCase()}`}
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white border border-border p-16 text-center text-secondary text-[14px] flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
                progress_activity
              </span>
              <span>Loading quotation payment details...</span>
            </div>
          ) : !isAccepted && id !== "demo" ? (
            <div className="bg-white border border-amber-200 p-8 text-center space-y-4">
              <span className="material-symbols-outlined text-[40px] text-amber-600">
                warning
              </span>
              <h2 className="text-xl font-bold text-primary">
                Quotation Not Accepted Yet
              </h2>
              <p className="text-[14px] text-secondary max-w-md mx-auto">
                Payment can only be initiated once you have formally accepted the quotation terms with the artisan.
              </p>
              <Link
                href={`/quote/${id}${token ? `?token=${encodeURIComponent(token)}` : ""}`}
                className="inline-block bg-primary text-white py-3 px-6 text-[14px] font-bold hover:bg-neutral-800 transition-colors"
              >
                View & Accept Quotation
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: Quotation Terms & Delivery Info */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Final Deal Summary */}
                <div className="border border-border bg-white p-5 sm:p-6 shadow-sm">
                  <h3 className="text-[13px] font-bold text-primary uppercase tracking-wider mb-5 border-b border-border pb-2">
                    Confirmed Deal Terms
                  </h3>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 bg-surface-muted border border-border shrink-0 overflow-hidden">
                      <img
                        src={productImg}
                        alt={productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-primary mb-1">
                        {productTitle}
                      </h4>
                      <p className="text-[12px] text-secondary">
                        Artisan: {artisanName} ({artisanLocation})
                      </p>
                      <span className="inline-block mt-2 bg-green-50 text-green-700 border border-green-200 text-[11px] font-bold px-2 py-0.5 rounded">
                        Accepted Terms
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-[13px] sm:text-[14px]">
                    <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2">
                      <span className="text-secondary">Quantity</span>
                      <span className="text-right font-bold text-primary">
                        {qty} Pieces
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2">
                      <span className="text-secondary">Agreed Unit Price</span>
                      <span className="text-right font-bold text-primary">
                        ₹{unitPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2">
                      <span className="text-secondary">Production Timeline</span>
                      <span className="text-right font-bold text-primary">
                        {timeline}
                      </span>
                    </div>
                    {customization && (
                      <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2">
                        <span className="text-secondary">Customization</span>
                        <span className="max-w-[60%] break-words text-right font-bold text-primary">
                          {customization}
                        </span>
                      </div>
                    )}
                    {quotation?.discount > 0 && (
                      <div className="flex items-start justify-between gap-4 border-b border-border border-dashed pb-2 text-green-700">
                        <span>Discount Applied</span>
                        <span className="text-right font-bold">
                          - ₹{quotation.discount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Minimal Delivery Details Form */}
                <div className="border border-border bg-white p-5 sm:p-6 shadow-sm">
                  <h3 className="text-[13px] font-bold text-primary uppercase tracking-wider mb-2 border-b border-border pb-2">
                    Delivery & Recipient Information
                  </h3>
                  <p className="text-[12px] text-secondary mb-5">
                    Essential delivery details for artisan packaging and dispatch.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-secondary mb-1">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={deliveryAddress.name}
                        onChange={handleAddressChange}
                        placeholder="e.g. Anita Sharma"
                        className="w-full border border-border p-2.5 text-[14px] text-primary focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-secondary mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={deliveryAddress.phone}
                        onChange={handleAddressChange}
                        placeholder="e.g. 9876543210"
                        className="w-full border border-border p-2.5 text-[14px] text-primary focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[12px] font-semibold text-secondary mb-1">
                        Street Address / Landmark
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={deliveryAddress.street}
                        onChange={handleAddressChange}
                        placeholder="e.g. Plot 14, Design District"
                        className="w-full border border-border p-2.5 text-[14px] text-primary focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-secondary mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={deliveryAddress.city}
                        onChange={handleAddressChange}
                        placeholder="e.g. Mumbai"
                        className="w-full border border-border p-2.5 text-[14px] text-primary focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-secondary mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={deliveryAddress.state}
                        onChange={handleAddressChange}
                        placeholder="e.g. Maharashtra"
                        className="w-full border border-border p-2.5 text-[14px] text-primary focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-secondary mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={deliveryAddress.pincode}
                        onChange={handleAddressChange}
                        placeholder="e.g. 400001"
                        className="w-full border border-border p-2.5 text-[14px] text-primary focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Exact Final Payable Amount & Pay Now Button */}
              <div className="lg:col-span-5">
                <div className="border border-border bg-white p-5 sm:p-6 shadow-sm lg:sticky lg:top-24">
                  <h3 className="text-[13px] font-bold text-primary uppercase tracking-wider mb-5 border-b border-border pb-2">
                    Payment Breakdown
                  </h3>

                  <div className="space-y-3 text-[14px] mb-6">
                    <div className="flex justify-between">
                      <span className="text-secondary">Agreed Deal Total</span>
                      <span className="font-bold text-primary">
                        ₹{finalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-border pt-4">
                      <div>
                        <span className="font-bold text-primary text-[15px] block">
                          Final Payable Amount
                        </span>
                        <span className="text-[11px] text-secondary">
                          Server-verified • No hidden fees
                        </span>
                      </div>
                      <span className="whitespace-nowrap text-2xl font-bold text-primary">
                        ₹{finalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="bg-surface-muted border border-border p-3.5 mb-6 text-[12px] text-secondary flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                      security
                    </span>
                    <span>
                      Protected by Razorpay Test Escrow. Payment signature is cryptographically verified before order confirmation.
                    </span>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded text-[13px] mb-4">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    disabled={isProcessing}
                    onClick={handlePayNow}
                    className="w-full bg-primary text-white py-4 px-6 text-[15px] font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">
                          lock
                        </span>
                        Pay ₹{finalAmount.toLocaleString("en-IN")} Now
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-tertiary text-center mt-4">
                    Razorpay test mode enabled. Use test cards/UPI to complete simulated payment.
                  </p>
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

export default function BuyerPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <BuyerPaymentContent />
    </Suspense>
  );
}
