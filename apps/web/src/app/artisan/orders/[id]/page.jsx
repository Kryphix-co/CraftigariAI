"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { BottomNav } from "@/components/BottomNav";

export default function ArtisanOrderDetailsPage() {
  const params = useParams();
  const id = params?.id || "demo";
  
  const [status, setStatus] = useState("Confirmed");

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-20 lg:pb-0">
      <ArtisanHeader activeTab="orders" />

      <main className="flex-1 w-full max-w-[1050px] mx-auto pt-6 pb-12 px-4 sm:px-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">ऑर्डर विवरण (Order Details)</h1>
            <p className="text-[14px] text-secondary font-mono mt-1">ORD-{id.toUpperCase()}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-md inline-flex items-center gap-2 w-fit">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span className="text-[12px] font-bold">Simulated Fulfillment Demo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white border border-outline shadow-sm rounded-xl overflow-hidden p-6">
              <div className="flex items-start gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop" alt="Product" className="w-20 h-20 rounded-lg object-cover border border-outline-variant shrink-0" />
                <div>
                  <h3 className="text-[16px] font-bold text-primary">Amer High-Fire Terracotta Water Urn</h3>
                  <p className="text-[13px] text-secondary mt-1">Red Finish (Custom Glaze)</p>
                  <p className="text-[13px] text-secondary">80 Pieces</p>
                </div>
              </div>

              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between border-b border-outline border-dashed pb-2">
                  <span className="text-secondary">Total Value (Product)</span>
                  <span className="font-bold text-primary">₹60,000</span>
                </div>
                <div className="flex justify-between border-b border-outline border-dashed pb-2">
                  <span className="text-secondary">Production Timeline</span>
                  <span className="font-bold text-primary">15 Days (Due: Nov 12)</span>
                </div>
              </div>
            </div>

            {/* Fulfilment Timeline */}
            <div className="bg-white border border-outline shadow-sm rounded-xl overflow-hidden p-6">
              <h3 className="text-[16px] font-bold text-primary mb-6">पूर्ति स्थिति (Fulfillment Status)</h3>
              
              <div className="relative border-l-2 border-outline ml-3 space-y-8 pb-4">
                
                {/* Step 1: Confirmed */}
                <div className="relative pl-6">
                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center border-success">
                    <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
                  </div>
                  <h4 className="text-[15px] font-bold text-primary">Order Confirmed</h4>
                  <p className="text-[12px] mt-0.5 text-secondary">Today, 10:45 AM</p>
                </div>

                {/* Step 2: Pack Product */}
                <div className="relative pl-6">
                  <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${status === 'Confirmed' ? 'border-primary' : 'border-success'}`}>
                    {status === 'Confirmed' && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>}
                    {status === 'Packed' && <div className="w-2.5 h-2.5 rounded-full bg-success"></div>}
                  </div>
                  <h4 className={`text-[15px] font-bold ${status === 'Confirmed' ? 'text-primary' : 'text-primary'}`}>Pack Product</h4>
                  {status === 'Confirmed' ? (
                    <div className="mt-3">
                      <p className="text-[13px] text-secondary mb-3">उत्पाद पैक होने पर नीचे क्लिक करें (Click below when packed)</p>
                      <button 
                        onClick={() => setStatus('Packed')}
                        className="bg-primary text-white py-2.5 px-5 rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm"
                      >
                        उत्पाद पैक हो गया (Mark Product Packed)
                      </button>
                    </div>
                  ) : (
                    <p className="text-[12px] mt-0.5 text-secondary">Just now</p>
                  )}
                </div>

                {/* Step 3: Pickup Scheduled */}
                <div className="relative pl-6">
                  <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${status === 'Packed' ? 'border-primary' : 'border-outline-variant'}`}>
                    {status === 'Packed' && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>}
                  </div>
                  <h4 className={`text-[15px] font-bold ${status === 'Packed' ? 'text-primary' : 'text-tertiary'}`}>Pickup Scheduled</h4>
                  {status === 'Packed' && (
                    <p className="text-[13px] mt-1 text-secondary">
                      पिकअप शेड्यूलिंग सिम्युलेटेड है (Pickup scheduling is simulated in the current prototype.)
                    </p>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Right: Deal Summary */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest border border-outline shadow-sm rounded-xl overflow-hidden p-6 sticky top-20">
              <h3 className="text-[14px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-outline pb-2">Buyer Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="block text-[11px] text-tertiary uppercase tracking-wide mb-1">Buyer Name</span>
                  <span className="text-[14px] font-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">business</span>
                    Design Studio, Mumbai
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-tertiary uppercase tracking-wide mb-1">Shipping Address</span>
                  <span className="text-[14px] text-primary block leading-snug">
                    14, Nariman Point, Ground Floor<br/>
                    Mumbai, Maharashtra 400021<br/>
                    India
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-tertiary uppercase tracking-wide mb-1">Buyer Note</span>
                  <span className="text-[13px] text-secondary italic block border-l-2 border-outline pl-3">
                    "Looking forward to the red finish. Will be used for an indoor architectural installation."
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <BottomNav activeTab="orders" />
    </div>
  );
}
