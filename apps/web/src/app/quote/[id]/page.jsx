import Link from "next/link";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";

import React from "react";

export default function BuyerQuotationPage({ params }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams?.id || "demo";
  
  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />
      
      <main className="flex-1 w-full flex flex-col bg-surface-muted/20 items-center py-8 sm:py-16 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-[1000px] bg-white border border-border shadow-sm p-5 sm:p-8 lg:p-10">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-6">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-terracotta block mb-2">Deal Offer</span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Quotation Confirmation</h1>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[11px] font-mono text-tertiary uppercase mb-1">Reference No.</div>
              <div className="text-[14px] font-bold text-primary font-mono">QTN-8204-{id.toUpperCase()}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Left: Context */}
            <div className="md:col-span-5 flex flex-col gap-5">
              <div className="aspect-[4/3] bg-surface-muted border border-border overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop" 
                  alt="Product Image" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-primary mb-1">Amer High-Fire Terracotta Water Urn</h2>
                <div className="flex items-center gap-2 text-[12px] text-secondary mt-2">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  <span className="font-medium text-primary">Master Ram Singh</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-secondary mt-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>Amer, Rajasthan Cluster</span>
                </div>
              </div>
            </div>

            {/* Right: Terms & Actions */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h3 className="text-[14px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Proposed Terms</h3>
                <div className="space-y-3 text-[13px] sm:text-[14px]">
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

                <div className="mt-6 bg-surface-muted p-4 border border-border flex justify-between items-center">
                  <span className="text-[14px] font-semibold text-secondary">Total Amount</span>
                  <span className="text-xl sm:text-2xl font-bold text-primary">₹60,000</span>
                </div>
                
                <div className="mt-4 p-4 border-l-2 border-terracotta bg-terracotta/5">
                  <p className="text-[12px] text-primary italic leading-relaxed">
                    "I have accounted for the custom red glaze in this price. The kiln is ready for your batch." <span className="font-semibold">— Ram Singh</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-border">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/quote/${id}/payment`} className="flex-1 bg-primary text-white text-center py-3.5 px-6 text-[14px] font-bold rounded-none hover:bg-neutral-800 transition-colors">
                    Accept Quote
                  </Link>
                  <Link href={`/quote/${id}/change`} className="flex-1 bg-white border border-border text-primary text-center py-3.5 px-6 text-[14px] font-bold rounded-none hover:border-primary transition-colors">
                    Request a Change
                  </Link>
                </div>
                <div className="text-center pt-2">
                  <button className="text-[12px] font-medium text-tertiary hover:text-secondary underline underline-offset-2">Decline Offer</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <BuyerFooter />
    </div>
  );
}
