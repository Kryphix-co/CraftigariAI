"use client";
import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminOrdersPage() {
  const orders = [
    { id: "ORD-559-X", product: "Terracotta Urn", artisan: "Ram Singh", buyer: "Design Studio", qty: 80, val: "₹64,200", pmt: "Test Confirmed", status: "Preparing", date: "Today" },
    { id: "ORD-212-B", product: "Glazed Plates", artisan: "Shanti Devi", buyer: "Nita Collections", qty: 150, val: "₹45,000", pmt: "Test Confirmed", status: "In Transit", date: "Oct 10" },
    { id: "ORD-109-A", product: "Deco Vase", artisan: "Ram Singh", buyer: "Heritage Homes", qty: 20, val: "₹18,000", pmt: "Test Confirmed", status: "Delivered", date: "Sep 28" },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Orders</h1>
          <p className="text-[14px] text-secondary">Confirmed orders and simulated fulfilment.</p>
        </div>
        <div className="bg-surface border border-outline px-3 py-1.5 rounded text-[11px] text-secondary font-medium flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">info</span>
          Tracking is simulated for prototype
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap min-w-[950px]">
          <thead className="bg-surface-container-lowest text-secondary text-[12px] uppercase border-b border-outline-variant">
            <tr>
              <th className="px-5 py-3 font-bold">Order #</th>
              <th className="px-5 py-3 font-bold">Context</th>
              <th className="px-5 py-3 font-bold">Value & Qty</th>
              <th className="px-5 py-3 font-bold">Payment</th>
              <th className="px-5 py-3 font-bold">Fulfillment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-surface-container-lowest">
                <td className="px-5 py-4">
                  <div className="font-mono font-bold text-primary">{o.id}</div>
                  <div className="text-[12px] text-tertiary">{o.date}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-bold text-primary">{o.product}</div>
                  <div className="text-secondary text-[12px]">{o.buyer} ↔ {o.artisan}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-primary font-bold">{o.val}</div>
                  <div className="text-secondary text-[12px]">{o.qty} units</div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[11px] text-success font-medium bg-success/10 px-2 py-0.5 rounded border border-success/20">{o.pmt}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border ${
                    o.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                    'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
