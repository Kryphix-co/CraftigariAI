import Link from "next/link";
import React from "react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";

export default function OrderTrackingPage({ params }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams?.id || "demo";

  const trackingStages = [
    { name: "Order Confirmed", status: "completed", date: "Today, 10:45 AM" },
    { name: "Pack Product", status: "completed", date: "Today, 2:15 PM" },
    { name: "Pickup Scheduled", status: "current", date: "Expected Tomorrow" },
    { name: "Picked Up", status: "upcoming", date: "" },
    { name: "In Transit", status: "upcoming", date: "" },
    { name: "Delivered", status: "upcoming", date: "Est. in 4-6 Days" },
  ];

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />
      
      <main className="flex-1 w-full flex flex-col items-center py-8 sm:py-16 px-4 sm:px-6 lg:px-12 bg-surface-muted/20">
        <div className="w-full max-w-[950px]">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Order Tracking</h1>
              <p className="text-[14px] text-secondary mt-1">Ref: ORD-559-{id.toUpperCase()}</p>
            </div>
            <div className="bg-surface border border-border px-3 py-1.5 inline-flex items-center gap-2 w-fit">
              <span className="material-symbols-outlined text-[14px] text-secondary">info</span>
              <span className="text-[11px] font-medium text-secondary">Simulated tracking demo for prototype</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Summary */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="bg-white border border-border p-6 shadow-sm">
                <h3 className="text-[12px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Order Details</h3>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-surface-muted border border-border shrink-0">
                    <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop" alt="Urn" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-primary mb-1">Amer High-Fire Terracotta Water Urn</h4>
                    <p className="text-[12px] text-secondary">Master Ram Singh</p>
                    <p className="text-[12px] text-secondary">80 Pieces</p>
                  </div>
                </div>

                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Destination</span>
                    <span className="font-medium text-primary text-right">Design Studio<br/>Mumbai, MH</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-secondary">Final Amount</span>
                    <span className="font-bold text-primary">₹64,200</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Timeline */}
            <div className="md:col-span-7">
              <div className="bg-white border border-border p-6 sm:p-8 shadow-sm">
                <h3 className="text-[14px] font-bold text-primary mb-8">Journey Status</h3>
                
                <div className="relative border-l border-border ml-3 space-y-8 pb-4">
                  {trackingStages.map((stage, i) => (
                    <div key={i} className="relative pl-8">
                      <div className={`absolute -left-[9px] top-0.5 w-[17px] h-[17px] rounded-full border-2 bg-white flex items-center justify-center 
                        ${stage.status === 'completed' ? 'border-forest' : stage.status === 'current' ? 'border-primary' : 'border-border'}`}>
                        {stage.status === 'completed' && <div className="w-2 h-2 rounded-full bg-forest"></div>}
                        {stage.status === 'current' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                      </div>
                      
                      <div>
                        <h4 className={`text-[15px] font-bold ${stage.status === 'upcoming' ? 'text-tertiary' : 'text-primary'}`}>
                          {stage.name}
                        </h4>
                        {stage.date && (
                          <p className={`text-[12px] mt-1 ${stage.status === 'upcoming' ? 'text-tertiary' : 'text-secondary'}`}>
                            {stage.date}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
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
