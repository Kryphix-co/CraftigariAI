"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";

export default function ProductInquiryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending inquiry
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1200);
  };

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />

      <main className="flex-1 w-full flex flex-col items-center py-8 sm:py-16 px-4 sm:px-6 lg:px-12 bg-surface-muted/20">
        <div className="w-full max-w-[800px]">
          
          <div className="mb-6 sm:mb-10">
            <Link href="/product" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-secondary hover:text-primary transition-colors mb-6">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Product</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary leading-tight">Request Architectural Allocation</h1>
            <p className="text-[14px] text-secondary mt-2">Direct B2B procurement request for Amer High-Fire Terracotta Water Urn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Product Summary */}
            <div className="md:col-span-5 bg-white border border-border p-5 sm:p-6 shadow-sm sticky top-24">
              <div className="aspect-[4/3] w-full mb-5 overflow-hidden border border-border">
                <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop" alt="Amer Terracotta Urn" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[15px] font-bold text-primary">Amer High-Fire Terracotta Water Urn</h3>
              <p className="text-[13px] text-secondary mt-1">Master Ram Singh • Amer Cluster</p>
              
              <div className="mt-5 pt-5 border-t border-border flex justify-between items-baseline">
                <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Base Rate</span>
                <div className="text-right">
                  <span className="text-[18px] font-bold text-primary">₹750</span>
                  <span className="text-[12px] text-secondary"> / piece</span>
                </div>
              </div>
              <p className="text-[11px] text-tertiary font-mono mt-1 text-right">MOQ: 25 pieces</p>
            </div>

            {/* Right: Inquiry Form */}
            <div className="md:col-span-7 bg-white border border-border p-6 sm:p-8 shadow-sm relative overflow-hidden">
              {showSuccess ? (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-forest text-[32px]">check_circle</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Request Sent Securely</h3>
                  <p className="text-[13px] text-secondary max-w-[280px]">Your requirements have been sent directly to Master Ram Singh.</p>
                  <div className="mt-6">
                    <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 text-[13px] font-bold tracking-tight rounded-xl hover:bg-neutral-800 transition-colors">
                      Continue Exploring Clusters
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-[12px] font-semibold text-primary">Target Quantity</label>
                    <input 
                      required
                      type="number" 
                      defaultValue={80}
                      className="w-full bg-surface-muted/30 border border-border px-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[12px] font-semibold text-primary">Expected Timeline</label>
                    <select className="w-full bg-surface-muted/30 border border-border px-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors appearance-none">
                      <option>Standard (15 Days)</option>
                      <option>Expedited (10 Days)</option>
                      <option>Flexible (30+ Days)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[12px] font-semibold text-primary">Finish & Customization Notes</label>
                  <textarea 
                    required
                    rows={3}
                    defaultValue="Looking for 80 pieces for a hospitality project. Standard dimensions, but require the traditional red terracotta finish. Need delivery within 15 days."
                    className="w-full bg-surface-muted/30 border border-border px-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="block text-[12px] font-semibold text-primary">Target Price per Unit</label>
                    <span className="text-[10px] text-tertiary font-mono">Optional</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[14px]">₹</span>
                    <input 
                      type="number" 
                      defaultValue={750}
                      className="w-full bg-surface-muted/30 border border-border pl-8 pr-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="space-y-2 mb-6">
                    <label className="block text-[12px] font-semibold text-primary">Your Organization</label>
                    <input 
                      required
                      type="text" 
                      defaultValue="Studio Architecture"
                      className="w-full bg-surface-muted/30 border border-border px-4 py-3 text-[14px] text-primary focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full bg-primary text-white py-4 px-6 text-[14px] font-bold tracking-tight hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 rounded-xl disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                        <span>Securing Ledger...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        <span>Submit Architectural Inquiry</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-tertiary mt-4">
                    Your request bypasses middlemen and is securely logged to the artisan's cluster terminal.
                  </p>
                </div>

              </form>
            </div>

          </div>
        </div>
      </main>

      <BuyerFooter />
    </div>
  );
}
