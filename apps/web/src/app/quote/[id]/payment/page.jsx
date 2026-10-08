"use client";

import Link from "next/link";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";

import { useParams, useRouter } from "next/navigation";

export default function BuyerPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id || "demo";

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />
      
      <main className="flex-1 w-full flex flex-col bg-surface-muted/20 items-center py-8 sm:py-16 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-[1050px]">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="material-symbols-outlined text-[32px] text-forest">check_circle</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Quotation Accepted</h1>
              <p className="text-[14px] text-secondary mt-1">Payment is now available for this confirmed deal.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Confirmed Summary */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white border border-border p-6 shadow-sm">
                <h3 className="text-[14px] font-bold text-primary uppercase tracking-wider mb-5 border-b border-border pb-2">Final Deal Summary</h3>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-surface-muted border border-border shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=300&auto=format&fit=crop" 
                      alt="Product Image" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-primary mb-1">Amer High-Fire Terracotta Water Urn</h4>
                    <p className="text-[12px] text-secondary">Artisan: Master Ram Singh (Rajasthan)</p>
                    <p className="text-[11px] font-mono text-tertiary mt-2">Ref: QTN-8204-{id.toUpperCase()}</p>
                  </div>
                </div>

                <div className="space-y-3 text-[13px] sm:text-[14px] mb-6">
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Quantity</span>
                    <span className="font-bold text-primary">80 Pieces</span>
                  </div>
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Unit Price</span>
                    <span className="font-bold text-primary">₹750</span>
                  </div>
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Production Timeline</span>
                    <span className="font-bold text-primary">15 Days</span>
                  </div>
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Customization</span>
                    <span className="font-bold text-primary">Red Finish (Custom Glaze)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Payment UI */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-border p-6 shadow-sm sticky top-24">
                <h3 className="text-[14px] font-bold text-primary uppercase tracking-wider mb-5 border-b border-border pb-2">Payment Details</h3>
                
                <div className="space-y-3 text-[13px] sm:text-[14px] mb-6">
                  <div className="flex justify-between">
                    <span className="text-secondary">Product Total</span>
                    <span className="font-medium text-primary">₹60,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Estimated Shipping</span>
                    <span className="font-medium text-primary">₹4,200</span>
                  </div>
                  <div className="flex justify-between pt-3 mt-3 border-t border-border">
                    <span className="font-bold text-primary">Final Payable Amount</span>
                    <span className="text-xl font-bold text-primary">₹64,200</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-6 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">science</span>
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">Razorpay Test Mode</span>
                </div>

                <button className="w-full bg-primary text-white py-4 px-6 text-[15px] font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm" onClick={() => router.push(`/order/${id}/confirmed`)}>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Pay Now
                </button>
                <p className="text-[11px] text-tertiary text-center mt-4">
                  This is a prototype environment. No real funds will be transferred.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <BuyerFooter />
    </div>
  );
}
