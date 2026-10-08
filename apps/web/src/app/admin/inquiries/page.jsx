"use client";
import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminInquiriesPage() {
  const [filter, setFilter] = useState("All");
  
  const inquiries = [
    { id: "INQ-99", product: "Terracotta Urn", artisan: "Ram Singh", buyer: "Design Studio", qty: 80, stage: "Quote Sent", quote: "₹64,200", updated: "2h ago" },
    { id: "INQ-98", product: "Large Planter", artisan: "Shanti Devi", buyer: "Nita Collections", qty: 25, stage: "New Inquiry", quote: "-", updated: "1d ago" },
    { id: "INQ-97", product: "Glazed Vase", artisan: "Ram Singh", buyer: "Heritage Homes", qty: 40, stage: "Quote Accepted", quote: "₹24,000", updated: "2d ago" },
    { id: "INQ-96", product: "Bamboo Basket", artisan: "Arjun Kumar", buyer: "Eco Store", qty: 100, stage: "Change Requested", quote: "₹15,000", updated: "3d ago" },
  ];

  const filtered = filter === "All" ? inquiries : inquiries.filter(i => i.stage === filter);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Inquiries & Deals</h1>
          <p className="text-[14px] text-secondary">Monitor buyer-artisan deal progression.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6">
        {["All", "New Inquiry", "Quote Sent", "Change Requested", "Quote Accepted"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white border-outline-variant text-secondary hover:bg-surface-container'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap min-w-[900px]">
          <thead className="bg-surface-container-lowest text-secondary text-[12px] uppercase border-b border-outline-variant">
            <tr>
              <th className="px-5 py-3 font-bold">Inquiry ID</th>
              <th className="px-5 py-3 font-bold">Deal Context</th>
              <th className="px-5 py-3 font-bold">Quote / Qty</th>
              <th className="px-5 py-3 font-bold">Current Stage</th>
              <th className="px-5 py-3 font-bold">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filtered.map(i => (
              <tr key={i.id} className="hover:bg-surface-container-lowest cursor-pointer">
                <td className="px-5 py-4 font-mono font-bold text-primary">{i.id}</td>
                <td className="px-5 py-4">
                  <div className="font-bold text-primary">{i.product}</div>
                  <div className="text-secondary text-[12px]">{i.buyer} ↔ {i.artisan}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-primary font-bold">{i.quote}</div>
                  <div className="text-secondary text-[12px]">{i.qty} units</div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border ${
                    i.stage === 'Quote Accepted' ? 'bg-green-50 text-green-700 border-green-200' : 
                    i.stage === 'Change Requested' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                    i.stage === 'New Inquiry' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-surface-container text-secondary border-outline'}`}>
                    {i.stage}
                  </span>
                </td>
                <td className="px-5 py-4 text-secondary">{i.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
