"use client";

import Link from "next/link";
import { useState } from "react";

export default function SmartPricingPage() {
  const [selectedPrice, setSelectedPrice] = useState("recommended");

  return (
    <div className="bg-surface-container-low text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-20 lg:pb-0">
      <div className="w-full max-w-[1150px] mx-auto min-h-[calc(100vh-56px)] flex flex-col bg-surface-container-lowest lg:bg-transparent shadow-sm lg:shadow-none">
        
        {/* Top App Bar (Dashboard global navigation integrated) */}
        <header className="sticky top-0 left-0 right-0 z-40 bg-surface/95 lg:bg-transparent backdrop-blur-md px-space-16 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
          <div className="flex items-center space-x-3">
            <Link
              href="/artisan/products/new/missing-info"
              aria-label="वापस जाएं"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <span className="font-title text-[15px] text-on-surface tracking-tight font-semibold lg:hidden">कदम 4 / 4: स्मार्ट मूल्य निर्धारण</span>
            <span className="font-headline text-[20px] text-primary tracking-tight font-bold hidden lg:block">Craftigari नमस्ते</span>
          </div>

          {/* Desktop Navigation (Hidden on mobile/tablet) */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <Link href="/artisan/dashboard" className="text-secondary hover:text-primary transition-colors">Home</Link>
            <Link href="#crafts" className="text-secondary hover:text-primary transition-colors">Crafts</Link>
            <Link href="/artisan/products/new" className="flex items-center gap-1.5 text-accent-terracotta bg-accent-terracotta-soft px-3 py-1.5 rounded-full hover:bg-tertiary-fixed transition-colors">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              Add
            </Link>
            <Link href="#market" className="text-secondary hover:text-primary transition-colors">Market</Link>
            <Link href="#profile" className="text-secondary hover:text-primary transition-colors">Profile</Link>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Desktop Language Switcher (Hidden on mobile) */}
            <button
              className="hidden lg:flex h-8 px-2.5 rounded-full border border-outline bg-surface-container text-on-surface font-label text-[12px] hover:bg-surface-container-high active:scale-95 transition-all items-center gap-1"
              type="button"
            >
              <span>हिंदी</span>
              <span className="text-on-surface-variant font-normal">/ EN</span>
            </button>
            {/* Audio Guidance Speaker Button */}
            <button
              aria-label="ध्वनि निर्देश सुनें"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-on-surface active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant lg:text-on-surface">volume_up</span>
            </button>
          </div>
        </header>

        {/* 4-Step Progress Indicator (Fully complete) - Mobile Only */}
        <div className="w-full px-space-16 pt-3 pb-2 lg:hidden">
          <div aria-hidden="true" className="grid grid-cols-4 gap-1.5 h-1 w-full">
            <div className="h-full bg-primary rounded-full"></div>
            <div className="h-full bg-primary rounded-full"></div>
            <div className="h-full bg-primary rounded-full"></div>
            <div className="h-full bg-primary rounded-full"></div>
          </div>
        </div>

        {/* Main Viewport */}
        <main className="flex-1 w-full px-space-16 pt-space-12 pb-space-24 lg:pb-12 flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 lg:min-h-[calc(100vh-56px)] lg:content-center overflow-y-auto">
          
          {/* Left Column on Desktop / Top Section on Mobile */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Product Context Banner */}
            <section className="p-space-8 bg-surface-container-low rounded-xl border border-outline-variant flex items-center gap-space-12">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden flex-shrink-0 border border-outline-variant">
                <img className="w-full h-full object-cover" alt="Product Thumbnail" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVP_lcIlqyYa9x3_Z0ZE_Z1ae3nkbFaTBGslZK6eJaG68wA8-7C29kuT-mNEPRu2VFQO6gaqHswnzJl-bSFDkVGJCPbHK0ddtIEfm2JTkVsvzQO4VRkqjDoPny2Lh8HdoPTnDYGweEQxsBtuvFq4VxSHxQ1_V3NJuggHuz84dh-akKL4ZcNxAP1wJJequUuBwSz53b7rnywreEf4TfCM9JAIZUMXU2ViozsJmM8uWW17ivjv5Jx94" />
              </div>
              <div className="flex flex-col flex-grow min-w-0">
                <div className="flex items-center gap-space-4">
                  <span className="font-title text-[14px] leading-snug font-semibold text-primary truncate">मिट्टी का फूलदान</span>
                  <span className="inline-flex items-center px-space-4 py-1 rounded text-[10px] font-label font-semibold bg-surface-container text-secondary">सत्यापित शिल्प</span>
                </div>
                <span className="font-body text-[12px] text-secondary mt-0.5">आकार: मध्यम (10–12")</span>
              </div>
            </section>

            {/* Primary Heading Cluster */}
            <section className="space-y-1">
              <h1 className="font-headline text-[22px] leading-7 font-bold text-primary tracking-tight">
                सही कीमत तय करें
              </h1>
              <p className="font-body text-[14px] text-secondary">
                आपकी लागत और मेहनत के आधार पर
              </p>
            </section>

            {/* Compact Editable Cost Summary Breakdown */}
            <section className="bg-surface-container-lowest lg:bg-surface rounded-xl border border-outline-variant p-space-16 space-y-space-12 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between pb-space-8 border-b border-outline-variant">
                <span className="font-title text-[13px] font-semibold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">receipt_long</span>
                  अनुमानित लागत विवरण
                </span>
                <button className="font-label text-[12px] font-semibold text-[#a8421e] hover:underline flex items-center gap-0.5" type="button">
                  लागत बदलें
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
              </div>
              <div className="space-y-space-8 text-body text-[13px]">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>सामग्री लागत <span className="text-[11px] text-secondary font-normal">(Clay & natural pigments)</span></span>
                  <span className="font-body-medium font-semibold text-primary">₹180</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>कारीगरी / मेहनत <span className="text-[11px] text-secondary font-normal">(18 घंटे हस्तकला)</span></span>
                  <span className="font-body-medium font-semibold text-primary">₹450</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>सुरक्षित पैकेजिंग <span className="text-[11px] text-secondary font-normal">(Eco-box & wrap)</span></span>
                  <span className="font-body-medium font-semibold text-primary">₹70</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>परिवहन व अन्य खर्च</span>
                  <span className="font-body-medium font-semibold text-primary">₹50</span>
                </div>
              </div>
              
              {/* Total Base Cost Bar */}
              <div className="pt-space-8 border-t border-outline-variant flex justify-between items-center bg-surface-container-low -mx-space-16 -mb-space-16 p-space-12 rounded-b-xl">
                <span className="font-body-medium text-[13px] font-semibold text-primary">कुल न्यूनतम लागत:</span>
                <span className="font-headline text-[15px] font-bold text-primary">₹750</span>
              </div>
            </section>
          </div>

          {/* Right Column on Desktop / Bottom Section on Mobile */}
          <div className="flex flex-col gap-6 mt-space-24 lg:mt-0 lg:col-span-7">
            {/* Transparent Three Price Levels Selection */}
            <section aria-label="मूल्य निर्धारण स्तर" className="space-y-space-12" role="radiogroup">
              <label className="font-label-small text-[11px] font-semibold text-secondary block">
                मूल्य विकल्प चुनें
              </label>

              {/* Option 1: Breakeven / Minimum Floor */}
              <div 
                className={`group relative rounded-xl border p-space-16 bg-surface cursor-pointer transition-all ${selectedPrice === "minimum" ? "border-2 border-primary shadow-sm" : "border-outline-variant hover:border-outline"}`}
                onClick={() => setSelectedPrice("minimum")}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-space-2 pr-space-8">
                    <span className="font-title text-[15px] font-semibold text-primary block">
                      न्यूनतम सुरक्षित कीमत
                    </span>
                    <p className="font-body text-[13px] leading-relaxed text-secondary mt-0.5">
                      लागत सुरक्षित, कोई घाटा नहीं
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-headline text-[18px] font-bold text-primary block leading-none">₹850</span>
                    <span className="font-label text-[11px] text-success font-medium">+₹100 लाभ</span>
                  </div>
                </div>
                <div className="mt-space-12 flex items-center justify-between pt-space-8 border-t border-outline-variant">
                  <span className="text-[11px] text-secondary">बाजार फ्लोर रेट</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedPrice === "minimum" ? "border-2 border-primary" : "border border-outline"}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${selectedPrice === "minimum" ? "bg-primary" : "bg-transparent"}`}></div>
                  </div>
                </div>
              </div>

              {/* Option 2: RECOMMENDED (Focal Point Highlighted with terracotta) */}
              <div 
                className={`relative rounded-xl border-2 p-space-16 bg-surface shadow-sm cursor-pointer ${selectedPrice === "recommended" ? "border-[#a8421e] ring-1 ring-[#a8421e]/10" : "border-outline-variant hover:border-outline"}`}
                onClick={() => setSelectedPrice("recommended")}
              >
                {/* Prominent Badge */}
                <div className="absolute -top-3 left-4 bg-[#a8421e] text-white px-space-8 py-0.5 rounded-full font-label text-[11px] font-bold tracking-tight shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  सबसे उपयुक्त
                </div>
                <div className="flex items-start justify-between pt-space-4">
                  <div className="space-y-space-2 pr-space-8">
                    <div className="flex items-center gap-1.5">
                      <span className="font-title text-[16px] font-bold text-primary block">
                        सुझाई गई कीमत
                      </span>
                    </div>
                    <p className="font-body text-[13px] leading-relaxed text-on-surface-variant font-medium mt-0.5">
                      मेहनत का पूरा मूल्य + खरीदार के लिए उचित
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-display text-[22px] font-bold text-primary block leading-none">₹1,150</span>
                    <span className="font-label text-[12px] text-[#a8421e] font-semibold mt-1 inline-block">+₹400 श्रेष्ठ मार्जिन</span>
                  </div>
                </div>
                <div className="mt-space-12 flex items-center justify-between pt-space-8 border-t border-outline-variant">
                  <span className="text-[12px] font-semibold text-primary">85% समान शिल्प इसी दर पर बिकते हैं</span>
                  {selectedPrice === "recommended" ? (
                    <div className="w-5 h-5 rounded-full bg-[#a8421e] text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-outline flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-transparent"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Option 3: Premium / Exhibition Value */}
              <div 
                className={`group relative rounded-xl border p-space-16 bg-surface cursor-pointer transition-all ${selectedPrice === "premium" ? "border-2 border-primary shadow-sm" : "border-outline-variant hover:border-outline"}`}
                onClick={() => setSelectedPrice("premium")}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-space-2 pr-space-8">
                    <span className="font-title text-[15px] font-semibold text-primary block">
                      प्रीमियम कीमत
                    </span>
                    <p className="font-body text-[13px] leading-relaxed text-secondary mt-0.5">
                      विशेष हस्तशिल्प गैलरी मूल्य
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-headline text-[18px] font-bold text-primary block leading-none">₹1,450</span>
                    <span className="font-label text-[11px] text-secondary font-medium">+₹700 मार्जिन</span>
                  </div>
                </div>
                <div className="mt-space-12 flex items-center justify-between pt-space-8 border-t border-outline-variant">
                  <span className="text-[11px] text-secondary">गैलरी और कला प्रदर्शनी के लिए</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedPrice === "premium" ? "border-2 border-primary" : "border border-outline"}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${selectedPrice === "premium" ? "bg-primary" : "bg-transparent"}`}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Transparent Explanation Note */}
            <section className="bg-surface-container-low rounded-xl border border-outline p-space-12 flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] text-secondary flex-shrink-0 mt-0.5">info</span>
              <p className="font-body text-[12px] leading-relaxed text-on-surface-variant">
                यह सुझाव आपकी सामग्री लागत (₹750), 18 घंटे की मेहनत और इसी प्रकार के हस्तशिल्प उत्पादों के विश्लेषण पर आधारित है। कोई छिपे शुल्क नहीं हैं।
              </p>
            </section>

            {/* Bottom Action Cluster */}
            <section className="pt-space-8 space-y-space-12 lg:mt-auto">
              <Link href="/artisan/products/new/preview" className="w-full h-[52px] bg-[#1f1f1f] hover:bg-[#303030] active:scale-[0.98] transition-all text-white font-title text-[15px] font-medium rounded-xl flex items-center justify-center gap-space-8 shadow-sm">
                <span>लिस्टिंग देखें</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <p className="text-center font-body text-[12px] text-secondary">
                आप लिस्टिंग में कभी भी कीमत बदल सकते हैं
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
