"use client";
import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminArtisansPage() {
  const artisans = [
    { name: "Ram Singh", phone: "+91 98765 43210", craft: "Terracotta", region: "Amer, RJ", products: 12, joined: "Oct 2025", status: "Active" },
    { name: "Shanti Devi", phone: "+91 87654 32109", craft: "Blue Pottery", region: "Jaipur, RJ", products: 5, joined: "Nov 2025", status: "Active" },
    { name: "Arjun Kumar", phone: "+91 76543 21098", craft: "Bamboo Weaving", region: "Jorhat, AS", products: 2, joined: "Dec 2025", status: "Inactive" },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Artisans</h1>
          <p className="text-[14px] text-secondary">Roster of onboarded creators.</p>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2 text-[18px] text-secondary">search</span>
          <input type="text" placeholder="Search name or phone..." className="pl-9 pr-4 py-2 border border-outline-variant rounded-lg text-[13px] focus:outline-none focus:border-primary w-full sm:w-64" />
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap min-w-[700px]">
          <thead className="bg-surface-container-lowest text-secondary text-[12px] uppercase border-b border-outline-variant">
            <tr>
              <th className="px-5 py-3 font-bold">Artisan</th>
              <th className="px-5 py-3 font-bold">Craft & Region</th>
              <th className="px-5 py-3 font-bold">Products</th>
              <th className="px-5 py-3 font-bold">Joined</th>
              <th className="px-5 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {artisans.map((a, i) => (
              <tr key={i} className="hover:bg-surface-container-lowest">
                <td className="px-5 py-4">
                  <div className="font-bold text-primary">{a.name}</div>
                  <div className="text-[12px] font-mono text-secondary">{a.phone}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-primary">{a.craft}</div>
                  <div className="text-secondary text-[12px]">{a.region}</div>
                </td>
                <td className="px-5 py-4 text-primary font-medium">{a.products}</td>
                <td className="px-5 py-4 text-secondary">{a.joined}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border ${
                    a.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-surface-container text-secondary border-outline'}`}>
                    {a.status}
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
