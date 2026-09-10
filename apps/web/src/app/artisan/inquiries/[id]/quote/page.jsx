"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DealSummaryQuotePage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-24 lg:pb-0">
      <div className="w-full max-w-[1150px] mx-auto min-h-[calc(100vh-56px)] flex flex-col">
        
        {/* Top Bar Navigation */}
        <header className="sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-space-16 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
          <button 
            onClick={() => router.back()} 
            aria-label="वापस जाएं" 
            className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-primary active:scale-95 transition-transform hover:bg-surface-container-low"
            type="button"
          >
            <span className="material-symbols-outlined text-primary text-[22px]">arrow_back</span>
          </button>
          
          {/* Progress indicator / Screen Identity */}
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-accent-terracotta"></span>
            <span className="font-title text-[15px] font-semibold text-primary">प्रस्ताव समीक्षा (Deal Summary)</span>
          </div>
          
          <button 
            onClick={toggleAudio}
            aria-label="सुनें" 
            className={`w-10 h-10 -mr-2 rounded-xl flex items-center justify-center active:scale-95 transition-transform ${
              isPlaying 
                ? "bg-tertiary-fixed text-tertiary" 
                : "text-secondary hover:bg-surface-container-low"
            }`}
            type="button"
          >
            <span className={`material-symbols-outlined text-[22px] ${isPlaying ? "animate-pulse" : ""}`}>
              {isPlaying ? "graphic_eq" : "volume_up"}
            </span>
          </button>
        </header>

        {/* Scrollable Content Canvas */}
        <main className="flex-1 px-space-16 pt-space-20 pb-32 flex flex-col lg:min-h-[calc(100vh-56px)] lg:justify-center overflow-y-auto lg:w-full lg:max-w-[850px] lg:mx-auto">
          
          {/* Heading & Hierarchy */}
          <div className="space-y-1 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline text-[12px] font-label font-medium text-secondary mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              <span>आवाज़ पहचान संपन्न</span>
            </div>
            <h1 className="font-display text-[24px] lg:text-[28px] font-bold text-primary tracking-tight">
              आपका प्रस्ताव तैयार है
            </h1>
            <p className="font-body text-[14px] text-secondary">
              खरीदार को भेजने से पहले एक बार जांच लें
            </p>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 mt-4 lg:mt-6">
            
            {/* Left Column on Desktop (Artisan Quote & Trust) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Artisan Voice Quote Snippet */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-accent-terracotta text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                    <span className="font-label text-[13px] font-semibold text-accent-terracotta">आपकी आवाज़ से समझा गया:</span>
                  </div>
                  <span className="font-label-small text-[10px] text-secondary tracking-wider bg-surface px-2 py-0.5 rounded border border-outline-variant uppercase">Original Voice</span>
                </div>
                <p className="font-body text-[14px] text-primary leading-relaxed bg-surface p-3 rounded-lg border border-outline-variant font-medium">
                  “80 पीस दे सकता हूं। 750 रुपये प्रति পণ্ডিত। 15 दिन लगेंगे। लाल रंग हो जाएगा।”
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-label text-secondary">
                  <span className="material-symbols-outlined text-success text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span>98% सटीकता के साथ स्वतः पार्स किया गया</span>
                </div>
              </div>

              {/* Trust / Approval Reassurance Note */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <p className="font-body text-[13px] text-secondary leading-relaxed">
                  प्रस्ताव भेजने पर खरीदार को पुष्टि और अग्रिम भुगतान का संदेश जाएगा।
                </p>
              </div>
            </div>

            {/* Right Column on Desktop (Structured Deal Summary) */}
            <div className="lg:col-span-7 mt-6 lg:mt-0">
              {/* Structured Deal Summary Card */}
              <div className="rounded-xl border border-outline bg-surface p-4 lg:p-6 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] relative overflow-hidden">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
                  <span className="font-title text-[16px] font-bold text-primary">सौदा विवरण (Quotation Details)</span>
                  <span className="font-label text-[12px] text-secondary bg-surface-container px-2.5 py-1 rounded-full">कदम 2/2</span>
                </div>
                
                {/* Spec 1: Product */}
                <div className="flex items-start justify-between py-2 border-b border-outline-variant/60">
                  <div className="space-y-0.5">
                    <span className="font-label text-[12px] text-secondary block">उत्पाद (Product)</span>
                    <span className="font-title text-[15px] text-primary font-semibold">टेराकोटा कलश</span>
                  </div>
                  <span className="font-label text-[11px] bg-surface-container text-on-surface px-2.5 py-1 rounded-full border border-outline-variant mt-1">हस्तनिर्मित</span>
                </div>
                
                {/* Spec 2: Quantity */}
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/60">
                  <div>
                    <span className="font-label text-[12px] text-secondary block">मात्रा (Quantity)</span>
                    <span className="font-title text-[15px] text-primary font-semibold">80 पीस</span>
                  </div>
                  <button aria-label="मात्रा बदलें" className="flex items-center gap-1 text-[12px] font-label text-secondary hover:text-primary active:scale-95 transition-transform" type="button">
                    <span>बदलें</span>
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                </div>
                
                {/* Spec 3: Unit Price (Tap to Edit) */}
                <div className="flex items-center justify-between py-3 border-b border-outline-variant/60 bg-surface-container-low -mx-4 lg:-mx-6 px-4 lg:px-6 border-y">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-label text-[12px] text-secondary">प्रति पीस दर (Unit Price)</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="font-display text-[20px] text-primary font-bold">₹750</span>
                      <span className="font-label-small text-[11px] text-secondary">/ प्रति पीस</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-surface px-3 py-1.5 rounded-lg border border-outline shadow-sm text-primary text-label font-medium active:scale-95 cursor-pointer hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-[15px] text-accent-terracotta">edit</span>
                    <span className="text-[13px] font-semibold">बदलें</span>
                  </div>
                </div>
                
                {/* Spec 4: Timeline */}
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/60">
                  <div>
                    <span className="font-label text-[12px] text-secondary block">निर्माण समय (Timeline)</span>
                    <span className="font-title text-[15px] text-primary font-semibold">15 दिन</span>
                  </div>
                  <span className="font-label-small text-[11px] text-secondary mt-1 block text-right">तैयार: <br className="lg:hidden" /> 10 मई 2025</span>
                </div>
                
                {/* Spec 5: Customization */}
                <div className="flex items-start justify-between py-2 border-b border-outline-variant/60">
                  <div className="space-y-0.5">
                    <span className="font-label text-[12px] text-secondary block">विशेष विवरण (Customization)</span>
                    <span className="font-title text-[15px] text-primary font-semibold">लाल रंग नक्काशी (Red Finish)</span>
                  </div>
                  <span className="w-4 h-4 rounded-full bg-[#b83820] mt-1 border border-outline shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" title="लाल रंग"></span>
                </div>
                
                {/* Spec 6: Delivery Terms */}
                <div className="flex items-start justify-between py-2 border-b border-outline-variant/60">
                  <div className="space-y-0.5">
                    <span className="font-label text-[12px] text-secondary block">डिलीवरी नियम</span>
                    <span className="font-body text-[14px] text-primary font-medium">डिलीवरी चार्ज खरीदार देगा</span>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[20px] mt-1">local_shipping</span>
                </div>
                
                {/* Highlight Total Deal Value */}
                <div className="pt-3 bg-[#f8f9fa] lg:bg-surface-container-low rounded-xl p-4 border border-outline flex items-center justify-between mt-2">
                  <div>
                    <span className="font-label text-[12px] text-secondary block uppercase tracking-wider font-bold">कुल राशि (Total Deal Value)</span>
                    <span className="font-label-small text-[12px] text-secondary mt-0.5">80 पीस × ₹750</span>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-[26px] leading-tight font-bold text-primary block">₹60,000</span>
                    <span className="font-label-small text-[11px] text-success font-semibold">जीएसटी अतिरिक्त</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Bottom Actions (Inline) */}
            <div className="hidden lg:flex w-full mt-6 gap-3 lg:col-span-12">
              <div className="flex flex-1 gap-3">
                <button className="h-[52px] flex-1 bg-surface border border-outline text-primary rounded-xl font-label text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-low active:scale-95 transition-all" type="button">
                  <span className="material-symbols-outlined text-[18px] text-secondary">edit_note</span>
                  <span>बदलाव करें</span>
                </button>
                <button className="h-[52px] flex-1 bg-surface border border-outline text-accent-terracotta rounded-xl font-label text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-low active:scale-95 transition-all" type="button">
                  <span className="material-symbols-outlined text-[18px] text-accent-terracotta">mic</span>
                  <span>फिर से बोलें</span>
                </button>
              </div>
              <Link href="/artisan/dashboard" className="h-[52px] flex-1 bg-primary text-surface rounded-xl font-title text-[16px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-[#303030] shadow-sm">
                <span>प्रस्ताव भेजें / Confirm & Send Quote</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>

          </div>
        </main>
      </div>

      {/* Mobile Sticky Bottom Actions Container */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-outline-variant p-4 space-y-3 z-50">
        
        {/* Primary dominant 52px charcoal CTA */}
        <Link href="/artisan/dashboard" className="w-full h-[52px] bg-primary text-surface rounded-xl font-title text-[16px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm">
          <span>प्रस्ताव भेजें / Confirm & Send Quote</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </Link>
        
        {/* Secondary horizontal button pair */}
        <div className="grid grid-cols-2 gap-3">
          <button className="h-[48px] bg-surface border border-outline text-primary rounded-xl font-label text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-low active:scale-95 transition-all" type="button">
            <span className="material-symbols-outlined text-[18px] text-secondary">edit_note</span>
            <span>बदलाव करें</span>
          </button>
          <button className="h-[48px] bg-surface border border-outline text-accent-terracotta rounded-xl font-label text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-low active:scale-95 transition-all" type="button">
            <span className="material-symbols-outlined text-[18px] text-accent-terracotta">mic</span>
            <span>फिर से बोलें</span>
          </button>
        </div>

      </div>
    </div>
  );
}
