"use client";
import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminProductsPage() {
  const [filter, setFilter] = useState("All");

  const products = [
    { id: "P-104", name: "Amer Terracotta Urn", artisan: "Ram Singh", craft: "Pottery", region: "Rajasthan", price: "₹750/pc", status: "Published", ai: "Completed" },
    { id: "P-105", name: "Glazed Blue Plate", artisan: "Shanti Devi", craft: "Blue Pottery", region: "Rajasthan", price: "₹400/pc", status: "Needs Review", ai: "Needs Review" },
    { id: "P-106", name: "Bamboo Weave Basket", artisan: "Arjun Kumar", craft: "Bamboo Weaving", region: "Assam", price: "-", status: "Missing Info", ai: "Completed" },
    { id: "P-107", name: "Block Print Saree", artisan: "Nita Textiles", craft: "Block Print", region: "Gujarat", price: "₹2,500", status: "Published", ai: "Completed" },
  ];

  const filtered = filter === "All" ? products : products.filter(p => p.status === filter);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Products</h1>
          <p className="text-[14px] text-secondary">Manage marketplace catalog.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2 text-[18px] text-secondary">search</span>
            <input type="text" placeholder="Search products..." className="pl-9 pr-4 py-2 border border-outline-variant rounded-lg text-[13px] focus:outline-none focus:border-primary w-full sm:w-64" />
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6">
        {["All", "Published", "Needs Review", "Missing Info"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white border-outline-variant text-secondary hover:bg-surface-container'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap min-w-[800px]">
          <thead className="bg-surface-container-lowest text-secondary text-[12px] uppercase border-b border-outline-variant">
            <tr>
              <th className="px-5 py-3 font-bold">Product</th>
              <th className="px-5 py-3 font-bold">Artisan & Region</th>
              <th className="px-5 py-3 font-bold">Category</th>
              <th className="px-5 py-3 font-bold">Price</th>
              <th className="px-5 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-surface-container-lowest">
                <td className="px-5 py-4">
                  <div className="font-bold text-primary">{p.name}</div>
                  <div className="text-[11px] font-mono text-tertiary">{p.id}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-primary">{p.artisan}</div>
                  <div className="text-secondary text-[12px]">{p.region}</div>
                </td>
                <td className="px-5 py-4 text-secondary">{p.craft}</td>
                <td className="px-5 py-4 font-medium text-primary">{p.price}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border ${
                    p.status === 'Published' ? 'bg-green-50 text-green-700 border-green-200' : 
                    p.status === 'Needs Review' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                    'bg-red-50 text-red-700 border-red-200'}`}>
                    {p.status}
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
