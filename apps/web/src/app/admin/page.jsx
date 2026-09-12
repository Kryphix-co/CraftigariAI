import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary tracking-tight">Dashboard Overview</h1>
        <p className="text-[14px] text-secondary mt-1">Operational snapshot for Craftigari HQ.</p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Artisans", val: "142", icon: "groups" },
          { label: "Published Products", val: "856", icon: "inventory_2" },
          { label: "Open Inquiries", val: "24", icon: "handshake" },
          { label: "Active Orders", val: "18", icon: "local_shipping" },
          { label: "AI Reviews Pending", val: "7", icon: "robot_2", alert: true },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className={`material-symbols-outlined ${m.alert ? 'text-amber-600' : 'text-secondary'}`}>{m.icon}</span>
              {m.alert && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
            </div>
            <div className="text-[28px] font-bold text-primary tracking-tight">{m.val}</div>
            <div className="text-[12px] font-medium text-secondary">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Recent Inquiries */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h2 className="text-[15px] font-bold text-primary">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-[12px] font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-outline-variant overflow-x-auto">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead className="bg-surface-muted text-secondary text-[11px] uppercase">
                <tr>
                  <th className="px-4 py-2 font-medium">Inquiry ID</th>
                  <th className="px-4 py-2 font-medium">Product</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "INQ-99", p: "Terracotta Urn", s: "Quote Sent" },
                  { id: "INQ-98", p: "Large Planter", s: "New Inquiry" },
                  { id: "INQ-97", p: "Glazed Vase", s: "Accepted" },
                ].map(r => (
                  <tr key={r.id} className="hover:bg-surface-container-lowest">
                    <td className="px-4 py-3 font-mono font-medium text-primary">{r.id}</td>
                    <td className="px-4 py-3 text-secondary">{r.p}</td>
                    <td className="px-4 py-3"><span className="text-[11px] font-bold px-2 py-0.5 border border-outline rounded-md bg-surface">{r.s}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant bg-amber-50/50">
            <h2 className="text-[15px] font-bold text-amber-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              Needs Attention
            </h2>
          </div>
          <div className="divide-y divide-outline-variant">
            {[
              { t: "AI extraction needs review", sub: "Product: Blue Pottery Plate", link: "/admin/ai-review" },
              { t: "Product missing required info", sub: "Artisan: Ram Singh", link: "/admin/products" },
              { t: "Buyer change request pending", sub: "Deal: INQ-95", link: "/admin/inquiries" }
            ].map((a, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-container-lowest">
                <div>
                  <div className="text-[13px] font-bold text-primary">{a.t}</div>
                  <div className="text-[12px] text-secondary">{a.sub}</div>
                </div>
                <Link href={a.link} className="text-[12px] font-bold text-primary border border-outline-variant px-3 py-1.5 rounded-md hover:bg-surface-container">Resolve</Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
