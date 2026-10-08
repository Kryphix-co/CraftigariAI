"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { BottomNav } from "@/components/BottomNav";

export default function ArtisanOrdersPage() {
  const [filter, setFilter] = useState("All");
  
  const filters = ["All", "Active", "Delivered"];
  
  const orders = [
    { id: "559-X", buyer: "Studio Architecture", product: "Amer High-Fire Terracotta Water Urn", date: "Today", qty: 80, val: "₹60,000", status: "Confirmed", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop" },
    { id: "212-B", buyer: "Nita Collections", product: "Glazed Plates", date: "Oct 10", qty: 150, val: "₹45,000", status: "In Transit", image: "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=200&auto=format&fit=crop" },
    { id: "109-A", buyer: "Heritage Homes", product: "Decorative Vase", date: "Sep 28", qty: 20, val: "₹18,000", status: "Delivered", image: "https://images.unsplash.com/photo-1611082596489-0824b232670a?q=80&w=200&auto=format&fit=crop" },
  ];

  const filtered = filter === "All" ? orders : 
                   filter === "Active" ? orders.filter(o => o.status !== "Delivered") : 
                   orders.filter(o => o.status === "Delivered");

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-20 lg:pb-0">
      <ArtisanHeader activeTab="orders" />

      <main className="flex-1 w-full max-w-[1100px] mx-auto pt-6 pb-12 px-4 sm:px-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">मेरे ऑर्डर (My Orders)</h1>
          
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
            <div className="col-span-1">Order #</div>
            <div className="col-span-4">Product & Buyer</div>
            <div className="col-span-2">Value & Qty</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Status</div>
          </div>
          
          <div className="divide-y divide-outline">
            {filtered.map(order => (
              <Link href={`/artisan/orders/${order.id}`} key={order.id} className="block hover:bg-surface-container-lowest transition-colors group">
                <div className="p-4 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center flex flex-col gap-3">
                  
                  <div className="lg:col-span-1 flex justify-between lg:block">
                    <span className="lg:hidden text-[12px] text-secondary">Order #:</span>
                    <span className="text-[13px] font-mono font-bold text-primary">#{order.id}</span>
                  </div>

                  <div className="lg:col-span-4 flex items-start gap-3">
                    <img src={order.image} alt={order.product} className="w-12 h-12 rounded-lg object-cover border border-outline-variant shrink-0 hidden sm:block" />
                    <div>
                      <h3 className="text-[14px] font-bold text-primary group-hover:text-terracotta transition-colors line-clamp-1">{order.product}</h3>
                      <p className="text-[12px] text-secondary mt-0.5">{order.buyer}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-2 flex justify-between lg:block">
                    <span className="lg:hidden text-[12px] text-secondary">Value/Qty:</span>
                    <div>
                      <span className="text-[14px] font-bold text-primary">{order.val}</span>
                      <span className="text-[12px] text-secondary block">{order.qty} pcs</span>
                    </div>
                  </div>

                  <div className="lg:col-span-2 flex justify-between lg:block">
                    <span className="lg:hidden text-[12px] text-secondary">Date:</span>
                    <span className="text-[13px] text-tertiary">{order.date}</span>
                  </div>

                  <div className="lg:col-span-3 flex justify-between lg:block items-center">
                    <span className="lg:hidden text-[12px] text-secondary">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border
                      ${order.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                        'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {order.status}
                    </span>
                  </div>

                </div>
              </Link>
            ))}
            
            {filtered.length === 0 && (
              <div className="p-8 text-center text-secondary text-[14px]">No orders found.</div>
            )}
          </div>
        </div>
      </main>

      <BottomNav activeTab="orders" />
    </div>
  );
}
