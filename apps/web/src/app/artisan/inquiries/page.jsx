"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { BottomNav } from "@/components/BottomNav";

export default function ArtisanInquiriesPage() {
  const [filter, setFilter] = useState("All");
  
  const filters = ["All", "New", "Needs Reply", "Quote Sent", "Accepted"];
  
  const inquiries = [
    { id: "inq-1", buyer: "Rohit Sharma", product: "पारंपरिक टेराकोटा कलश", date: "Today, 2:15 PM", qty: 80, status: "Needs Reply", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop" },
    { id: "inq-2", buyer: "Anita Desai", product: "Large Planter Set", date: "Yesterday", qty: 25, status: "Quote Sent", image: "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=200&auto=format&fit=crop" },
    { id: "inq-3", buyer: "Design Studio", product: "Fluted Vase", date: "Oct 12", qty: 40, status: "Accepted", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop" },
  ];

  const filtered = filter === "All" ? inquiries : inquiries.filter(i => i.status === filter);

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-20 lg:pb-0">
      <ArtisanHeader activeTab="inquiries" />

      <main className="flex-1 w-full max-w-[1100px] mx-auto pt-6 pb-12 px-4 sm:px-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">सभी पूछताछ (Inquiries)</h1>
          
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 sm:pb-0">
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white border-outline text-secondary hover:bg-surface-container-low'}`}
              >
                {f === "All" ? "सभी (All)" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-outline rounded-xl overflow-hidden shadow-sm">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-outline bg-surface-container-lowest text-[12px] font-bold text-secondary uppercase tracking-wider">
            <div className="col-span-5">Product & Buyer</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Status</div>
          </div>
          
          <div className="divide-y divide-outline">
            {filtered.map(inq => (
              <Link href={`/artisan/inquiries/demo`} key={inq.id} className="block hover:bg-surface-container-lowest transition-colors group">
                <div className="p-4 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center flex flex-col gap-3">
                  
                  {/* Mobile Top Row / Desktop Col 1 */}
                  <div className="lg:col-span-5 flex items-start gap-3">
                    <img src={inq.image} alt={inq.product} className="w-14 h-14 rounded-lg object-cover border border-outline-variant shrink-0" />
                    <div>
                      <h3 className="text-[14px] font-bold text-primary group-hover:text-terracotta transition-colors">{inq.product}</h3>
                      <p className="text-[12px] text-secondary mt-0.5">{inq.buyer}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-2 flex justify-between lg:block">
                    <span className="lg:hidden text-[12px] text-secondary">Quantity:</span>
                    <span className="text-[14px] font-medium text-primary">{inq.qty} pcs</span>
                  </div>

                  <div className="lg:col-span-2 flex justify-between lg:block">
                    <span className="lg:hidden text-[12px] text-secondary">Date:</span>
                    <span className="text-[13px] text-tertiary">{inq.date}</span>
                  </div>

                  <div className="lg:col-span-3 flex justify-between lg:block items-center">
                    <span className="lg:hidden text-[12px] text-secondary">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border
                      ${inq.status === 'Needs Reply' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        inq.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' : 
                        'bg-surface-container text-secondary border-outline'}`}>
                      {inq.status}
                    </span>
                  </div>

                </div>
              </Link>
            ))}
            
            {filtered.length === 0 && (
              <div className="p-8 text-center text-secondary text-[14px]">No inquiries found.</div>
            )}
          </div>
        </div>
      </main>

      <BottomNav activeTab="inquiries" />
    </div>
  );
}
