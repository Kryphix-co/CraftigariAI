"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function DealSaathiInquiryPage() {
  const params = useParams();
  const id = params?.id || "inq-12345";
  
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-24 lg:pb-0">
      <div className="w-full max-w-[1150px] mx-auto min-h-[calc(100vh-56px)] flex flex-col">
        
        {/* Top App Bar (Dashboard global navigation integrated) */}
        <header className="sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-space-16 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
          <div className="flex items-center space-x-3">
            <Link
              href="/artisan/dashboard"
              aria-label="वापस जाएं"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <span className="font-title text-[15px] text-on-surface tracking-tight font-semibold lg:hidden">नई पूछताछ</span>
            <span className="font-headline text-[20px] text-primary tracking-tight font-bold hidden lg:block">Craftigari नमस्ते</span>
          </div>

          {/* Desktop Navigation (Hidden on mobile/tablet) */}
          <nav className="hidden lg:flex items-center space-x-6 text-[14px] font-medium">
            <Link href="/artisan/dashboard" className="text-secondary hover:text-primary transition-colors">Home</Link>
            <Link href="#crafts" className="text-secondary hover:text-primary transition-colors">Crafts</Link>
            <Link href="/artisan/products/new" className="text-secondary hover:text-primary transition-colors">Add</Link>
            <Link href="#market" className="text-primary font-bold">Market (1 New)</Link>
            <Link href="#profile" className="text-secondary hover:text-primary transition-colors">Profile</Link>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Audio Guidance Speaker Button */}
            <button
              onClick={toggleAudio}
              aria-label="ध्वनि सहायता"
              className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${
                isPlaying 
                  ? "bg-tertiary-fixed border-tertiary-fixed-dim text-tertiary" 
                  : "bg-surface border-transparent hover:bg-surface-container text-on-surface-variant"
              }`}
              type="button"
            >
              <span className={`material-symbols-outlined text-[20px] ${isPlaying ? "animate-pulse" : ""}`}>
                {isPlaying ? "graphic_eq" : "volume_up"}
              </span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-space-16 pt-space-20 pb-space-32 flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 lg:min-h-[calc(100vh-56px)] lg:content-center overflow-y-auto">
          
          {/* Left Column on Desktop (Context) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Header Section */}
            <section className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline text-on-surface-variant text-[12px] font-label font-medium">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span>डील साथी • नया संदेश</span>
              </div>
              <h1 className="font-display text-[26px] lg:text-[32px] text-primary tracking-tight font-bold mt-2">नई पूछताछ</h1>
              <p className="font-body-medium text-[14px] text-secondary">
                एक खरीदार ने आपके उत्पाद में रुचि दिखाई है
              </p>
            </section>

            {/* Buyer & Product Context Unit */}
            <section className="p-3 lg:p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface border border-outline-variant">
                <img className="w-full h-full object-cover" alt="Product" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgUNMms8a7WGzFm4xI95SSkqiEs7g91mmr7zyPhxyuNkz_EUUs3YCzjY2BNN2KvmgqCoiwY5HAr9ifAURuqj4qIPBFnTKTj-r0_wkWFE7HXzF7maQKA_h_iHlKIAAPi7OgnkkgTHfkfZCVodvY6J6dnT8sA8JPBfh-OBki4bcbIuzaJDSq9JuRuEwOLqGv17VaH2h6z2TxEkoa5piI9mMGZJ2plKupfLhmpxJEtZirIwHGBH8_pdI" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-label-small text-[11px] text-secondary tracking-wide uppercase">उत्पाद संदर्भ</p>
                <p className="font-body-medium text-[14px] text-primary font-semibold truncate mt-0.5">पारंपरिक टेराकोटा कलश</p>
                <div className="flex items-center gap-1.5 font-label text-[12px] text-on-surface-variant mt-1.5">
                  <span className="material-symbols-outlined text-[14px] text-secondary">person</span>
                  <span className="truncate">रोहित शर्मा (मुंबई) · आज 2:15 PM</span>
                </div>
              </div>
            </section>

            {/* Original Message (Quiet Context) */}
            <section className="rounded-xl bg-surface-container-low lg:bg-surface border border-outline-variant p-4 space-y-3">
              <div className="flex items-center justify-between font-label text-[12px] text-secondary">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                  खरीदार ने लिखा (Original Message):
                </span>
                <span className="font-label-small text-[10px] px-2 py-0.5 rounded-full bg-surface border border-outline-variant text-secondary">English</span>
              </div>
              <p className="font-body text-[14px] text-on-surface-variant italic pl-3 border-l-[3px] border-outline leading-relaxed">
                “Can you supply 80 units in custom red colour within 15 days for our event? Also confirm delivery to Mumbai.”
              </p>
            </section>
          </div>

          {/* Right Column on Desktop (Deal Saathi Breakdown & Actions) */}
          <div className="lg:col-span-7 flex flex-col mt-6 lg:mt-0 lg:pl-4">
            
            {/* Main Core Section: Craftigari Simplified Breakdown */}
            <section className="rounded-xl border border-outline bg-surface p-4 lg:p-6 space-y-6 relative overflow-hidden shadow-sm lg:shadow-md">
              {/* Subtle Terracotta Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-tertiary-container"></div>
              
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                    <span className="material-symbols-outlined text-[20px]">handshake</span>
                  </div>
                  <h2 className="font-title text-[18px] font-bold text-primary">Craftigari ने आसान भाषा में समझाया</h2>
                </div>
              </div>

              {/* Clean Takeaway Rows */}
              <div className="space-y-4 divide-y divide-outline-variant">
                
                {/* Row 1: Quantity */}
                <div className="flex items-start justify-between gap-3 pt-3 first:pt-0">
                  <div className="flex items-center gap-3 min-w-[110px]">
                    <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                    </span>
                    <span className="font-body-medium text-[14px] text-secondary font-medium">मात्रा:</span>
                  </div>
                  <div className="text-right">
                    <span className="font-body-medium text-[15px] text-primary font-bold block">80 पीस</span>
                    <span className="font-label text-[12px] text-success font-medium mt-0.5 block">बड़ा ऑर्डर</span>
                  </div>
                </div>

                {/* Row 2: Customization */}
                <div className="flex items-start justify-between gap-3 pt-4">
                  <div className="flex items-center gap-3 min-w-[110px]">
                    <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">palette</span>
                    </span>
                    <span className="font-body-medium text-[14px] text-secondary font-medium">रंग / बदलाव:</span>
                  </div>
                  <div className="text-right">
                    <span className="font-body-medium text-[15px] text-primary font-bold block">लाल रंग (कस्टम ऑर्डर)</span>
                    <span className="font-label text-[12px] text-on-surface-variant block mt-0.5">पारंपरिक फिनिश पर लाल लेप</span>
                  </div>
                </div>

                {/* Row 3: Timeline */}
                <div className="flex items-start justify-between gap-3 pt-4">
                  <div className="flex items-center gap-3 min-w-[110px]">
                    <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                    </span>
                    <span className="font-body-medium text-[14px] text-secondary font-medium">समय:</span>
                  </div>
                  <div className="text-right">
                    <span className="font-body-medium text-[15px] text-primary font-bold block">15 दिनों के अंदर डिलीवरी</span>
                    <span className="font-label text-[12px] text-warning font-medium block mt-0.5">जल्द चाहिए</span>
                  </div>
                </div>

                {/* Row 4: Location */}
                <div className="flex items-start justify-between gap-3 pt-4">
                  <div className="flex items-center gap-3 min-w-[110px]">
                    <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                    </span>
                    <span className="font-body-medium text-[14px] text-secondary font-medium">स्थान:</span>
                  </div>
                  <div className="text-right">
                    <span className="font-body-medium text-[15px] text-primary font-bold block">मुंबई, महाराष्ट्र</span>
                    <span className="font-label text-[12px] text-on-surface-variant block mt-0.5">डिलीवरी चार्ज जोड़ें</span>
                  </div>
                </div>

              </div>

              {/* Audio Affordance Button inside core explanation */}
              <div className="pt-2">
                <button 
                  onClick={toggleAudio}
                  className={`w-full h-12 rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
                    isPlaying 
                      ? "bg-tertiary-fixed border-tertiary-fixed-dim text-tertiary"
                      : "bg-surface-container-low border-outline hover:bg-surface-container text-primary"
                  }`} 
                  type="button"
                >
                  <span className={`material-symbols-outlined text-[20px] ${isPlaying ? "animate-pulse" : "text-tertiary-container"}`}>
                    {isPlaying ? "graphic_eq" : "volume_up"}
                  </span>
                  <span className="font-body-medium text-[15px] font-semibold">
                    {isPlaying ? "ऑडियो बज रहा है... (रोकने के लिए दबाएं)" : "बोलकर सुनें (Listen to explanation)"}
                  </span>
                </button>
              </div>
            </section>

            {/* Desktop Actions Row */}
            <div className="hidden lg:flex gap-4 mt-6">
              <button className="flex-1 h-[52px] bg-surface text-secondary border border-outline rounded-xl font-title text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-surface-container-low hover:text-error active:scale-[0.98] transition-all" type="button">
                <span>अभी मना करें</span>
              </button>
              <Link href={`/artisan/inquiries/${id}/quote`} className="flex-[2] h-[52px] bg-primary-container text-on-primary rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-black active:scale-[0.98] transition-all">
                <span className="material-symbols-outlined text-[22px]">mic</span>
                <span className="font-title text-[16px] font-bold text-white">बोलकर जवाब दें (Reply by Voice) →</span>
              </Link>
            </div>

            {/* Trust Indicator / Reassurance */}
            <div className="hidden lg:flex items-center gap-3 mt-4 px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-secondary flex-shrink-0">verified_user</span>
              <p className="font-label text-[12px] leading-tight">
                खरीदार का फ़ोन नंबर और अग्रिम भुगतान Craftigari द्वारा सुरक्षित रहेगा।
              </p>
            </div>

          </div>
        </main>
      </div>

      {/* Mobile Sticky Bottom Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-outline-variant p-4 space-y-2">
        <Link href={`/artisan/inquiries/${id}/quote`} className="w-full h-[52px] bg-primary-container text-on-primary rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-black active:scale-[0.99] transition-all">
          <span className="material-symbols-outlined text-[22px]">mic</span>
          <span className="font-title text-[16px] font-semibold text-white">बोलकर जवाब दें (Reply by Voice) →</span>
        </Link>
        <button className="w-full py-2 text-center font-label text-[13px] text-secondary hover:text-error transition-colors" type="button">
          अभी मना करें (Decline Inquiry)
        </button>
      </div>
    </div>
  );
}
