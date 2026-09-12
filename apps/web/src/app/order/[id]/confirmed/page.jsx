import Link from "next/link";
import React from "react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";

export default function OrderConfirmedPage({ params }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams?.id || "demo";

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />
      
      <main className="flex-1 w-full flex flex-col items-center justify-center py-12 sm:py-24 px-4 sm:px-6">
        <div className="w-full max-w-[750px] bg-white border border-border p-8 sm:p-12 shadow-sm text-center">
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-forest">check</span>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-2">Order Confirmed</h1>
          <p className="text-[14px] text-secondary">Your order has been successfully placed with the artisan.</p>
          <div className="mt-2 text-[12px] font-mono text-tertiary uppercase">Ref: ORD-559-{id.toUpperCase()}</div>

          <div className="mt-10 border border-border bg-surface-muted/20 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-left">
            <div className="w-24 h-24 bg-surface-muted border border-border shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=300&auto=format&fit=crop" 
                alt="Amer Terracotta Urn" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 w-full text-center sm:text-left">
              <h3 className="text-[16px] font-bold text-primary mb-1">Amer High-Fire Terracotta Water Urn</h3>
              <p className="text-[13px] text-secondary">Master Ram Singh • 80 Pieces</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <span className="block text-[11px] text-tertiary uppercase tracking-wider mb-0.5">Total Paid</span>
                  <span className="text-[14px] font-bold text-primary">₹64,200</span>
                </div>
                <div>
                  <span className="block text-[11px] text-tertiary uppercase tracking-wider mb-0.5">Timeline</span>
                  <span className="text-[14px] font-bold text-primary">15 Days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href={`/order/${id}`} className="bg-primary text-white py-3.5 px-8 text-[14px] font-bold hover:bg-neutral-800 transition-colors inline-block w-full sm:w-auto">
              Track Order
            </Link>
            <Link href="/" className="bg-white border border-border text-primary py-3.5 px-8 text-[14px] font-bold hover:border-primary transition-colors inline-block w-full sm:w-auto">
              Continue Exploring
            </Link>
          </div>
          
        </div>
      </main>
      
      <BuyerFooter />
    </div>
  );
}
