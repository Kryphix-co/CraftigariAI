"use client";

import Link from "next/link";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";

import { useParams } from "next/navigation";

export default function BuyerChangeRequestPage() {
  const params = useParams();
  const id = params?.id || "demo";

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />
      
      <main className="flex-1 w-full flex flex-col bg-surface-muted/20 items-center py-8 sm:py-16 px-4 sm:px-6">
        <div className="w-full max-w-[750px] bg-white border border-border shadow-sm">
          
          <div className="p-6 sm:p-8 border-b border-border bg-surface-muted/30">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary mb-2">Request a Change</h1>
            <p className="text-[13px] text-secondary">Propose new terms to the artisan. They will review and respond.</p>
            
            <div className="mt-5 p-4 border border-border bg-white flex flex-wrap gap-4 justify-between items-center text-[12px]">
              <div>
                <span className="text-tertiary block mb-0.5">Current Unit Price</span>
                <span className="font-bold text-primary text-[14px]">₹750 / piece</span>
              </div>
              <div>
                <span className="text-tertiary block mb-0.5">Current Quantity</span>
                <span className="font-bold text-primary text-[14px]">80 pieces</span>
              </div>
            </div>
          </div>

          <form className="p-6 sm:p-8 space-y-6" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-primary mb-2">Proposed Unit Price (₹)</label>
                <input type="text" defaultValue="620" className="w-full bg-white border border-border px-4 py-2.5 text-[14px] focus:border-primary focus:ring-0 outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-primary mb-2">Proposed Quantity</label>
                <input type="text" defaultValue="80" className="w-full bg-white border border-border px-4 py-2.5 text-[14px] focus:border-primary focus:ring-0 outline-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-[12px] font-bold text-primary mb-2">Production Timeline</label>
              <select className="w-full bg-white border border-border px-4 py-2.5 text-[14px] focus:border-primary focus:ring-0 outline-none">
                <option>15 Days (No change)</option>
                <option>10 Days (Rush)</option>
                <option>20 Days (Relaxed)</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-primary mb-2">Message to Artisan</label>
              <textarea rows="4" className="w-full bg-white border border-border px-4 py-3 text-[14px] focus:border-primary focus:ring-0 outline-none resize-none" defaultValue="Can you do 80 pieces at ₹620 each?"></textarea>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link href={`/artisan/inquiries/demo/fair-deal`} className="flex-1 bg-primary text-white text-center py-3.5 px-6 text-[14px] font-bold hover:bg-neutral-800 transition-colors">
                Send Change Request
              </Link>
              <Link href={`/quote/${id}`} className="flex-1 bg-white border border-border text-primary text-center py-3.5 px-6 text-[14px] font-bold hover:border-primary transition-colors">
                Cancel
              </Link>
            </div>
          </form>

        </div>
      </main>
      
      <BuyerFooter />
    </div>
  );
}
