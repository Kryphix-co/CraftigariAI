"use client";
import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminAiReviewPage() {
  
  const [items, setItems] = useState([
    { id: "AI-102", product: "Glazed Blue Plate", artisan: "Shanti Devi", type: "Voice Extraction", status: "Needs Review", conf: "Medium", 
      details: [
        { key: "Material", val: "Ceramic", src: "Voice", conf: "High" },
        { key: "Color", val: "Blue", src: "Voice", conf: "High" },
        { key: "Size", val: "Missing", src: "-", action: "Ask Artisan" }
      ]
    },
    { id: "AI-101", product: "Terracotta Urn", artisan: "Ram Singh", type: "Image Processing", status: "Completed", conf: "High", 
      details: [
        { key: "Material", val: "Terracotta", src: "Image", conf: "High" },
        { key: "Category", val: "Vase/Urn", src: "Image", conf: "High" }
      ]
    }
  ]);

  const markApproved = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, status: "Completed", conf: "High" } : i));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">AI Review & Processing</h1>
          <p className="text-[14px] text-secondary">Resolve uncertainties from automated extraction pipelines.</p>
        </div>
      </div>

      <div className="space-y-6">
        {items.map(item => (
          <div key={item.id} className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className={`p-4 border-b flex justify-between items-center ${item.status === 'Needs Review' ? 'bg-amber-50/30 border-amber-200' : 'bg-surface-container-lowest border-outline-variant'}`}>
              <div className="flex items-center gap-4">
                <div className="font-mono text-[12px] font-bold text-secondary bg-surface px-2 py-1 rounded border border-outline">{item.id}</div>
                <div>
                  <h3 className="text-[15px] font-bold text-primary">{item.product} <span className="text-[13px] font-normal text-secondary ml-1">by {item.artisan}</span></h3>
                  <p className="text-[12px] text-secondary">{item.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border ${
                  item.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {item.status}
                </span>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 lg:flex gap-8">
              <div className="flex-1">
                <h4 className="text-[12px] font-bold text-secondary uppercase tracking-wider mb-4 border-b border-outline-variant pb-2">Extraction Payload</h4>
                <div className="space-y-3">
                  {item.details.map((d, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-outline-variant border-dashed pb-2">
                      <div>
                        <span className="text-[13px] text-secondary">{d.key}:</span>
                        <span className={`ml-2 text-[14px] font-bold ${d.val === 'Missing' ? 'text-amber-600' : 'text-primary'}`}>{d.val}</span>
                      </div>
                      <div className="text-[11px] flex gap-2">
                        {d.src !== "-" && <span className="bg-surface px-1.5 py-0.5 rounded text-tertiary border border-outline">Source: {d.src}</span>}
                        {d.conf && <span className="bg-surface px-1.5 py-0.5 rounded text-tertiary border border-outline">Conf: {d.conf}</span>}
                        {d.action && <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">{d.action}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {item.status === 'Needs Review' && (
                <div className="mt-6 lg:mt-0 lg:w-64 shrink-0 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-outline-variant pt-6 lg:pt-0 lg:pl-8">
                  <button onClick={() => markApproved(item.id)} className="w-full bg-primary text-white py-2 px-4 rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors">
                    Approve Extraction
                  </button>
                  <button className="w-full bg-white border border-outline-variant text-primary py-2 px-4 rounded-lg text-[13px] font-bold hover:bg-surface-container transition-colors">
                    Ask Artisan
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
