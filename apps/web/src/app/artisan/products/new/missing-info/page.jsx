"use client";

import Link from "next/link";
import { useState } from "react";

export default function MissingInfoPage() {
  const [selectedSize, setSelectedSize] = useState("medium");

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-20 lg:pb-0">
      <div className="w-full max-w-[1150px] mx-auto min-h-[calc(100vh-56px)] flex flex-col">
        {/* Top App Bar (Dashboard global navigation integrated) */}
        <header className="sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-space-16 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
          <div className="flex items-center space-x-3">
            <Link
              href="/artisan/products/new/summary"
              aria-label="वापस जाएं"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <span className="font-title text-[15px] text-on-surface tracking-tight font-semibold lg:hidden">कदम 3 / 4: विवरण स्पष्ट करें</span>
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

        {/* Segmented Linear Progress (Mobile only) */}
        <div className="w-full px-space-16 pt-3 pb-2 lg:hidden">
          <div aria-hidden="true" className="grid grid-cols-4 gap-1.5 h-1 w-full">
            <div className="h-full bg-on-secondary-container rounded-full"></div>
            <div className="h-full bg-on-secondary-container rounded-full"></div>
            <div className="h-full bg-on-tertiary-container rounded-full"></div>
            <div className="h-full bg-outline-variant rounded-full"></div>
          </div>
        </div>

        {/* Main Viewport */}
        <main className="flex-1 w-full max-w-[640px] mx-auto px-space-16 pt-space-16 pb-space-24 flex flex-col justify-between lg:justify-center lg:gap-12 lg:min-h-[calc(100vh-56px)] overflow-y-auto">
          
          <div className="flex flex-col flex-1 lg:flex-none">
            {/* Small Product Context Banner */}
            <div className="my-space-8 py-2 px-3 bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <img className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-outline-variant" alt="Product" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGel-sFSXiOvGC5vFZQx3fQHFADE9dcoxToJR3ZSEzpYnIU6cV9jiVfc_o1xcOtD7gb5rBjVw6IhjijsB1kIEIdUN_r7g1h6nRUJ2yYoIPBJJI_FANRVBUFTij48d7OLcgne-48F9kejzDwXncgph93vNo81UzOxZTGV1Rn38Q7r2_WmfpP-Wssr41jTIcfPkqQQrcYI40XE3Hz8-sMn3Hy1kqpWXHH3iq3ERtg9SWHecmhiCd0Ts" />
                <div className="truncate">
                  <p className="font-title text-[14px] font-medium text-on-surface truncate">मिट्टी का फूलदान</p>
                  <p className="font-label-small text-[11px] text-secondary tracking-tight">शिल्प क्र. #284</p>
                </div>
              </div>
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container border border-outline text-warning font-label text-[11px] whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                केवल 1 जानकारी शेष
              </span>
            </div>

            {/* Conversational Heading Group */}
            <div className="space-y-1 mt-4 lg:mt-6">
              <h1 className="font-headline text-[22px] leading-[28px] font-bold text-on-secondary-container tracking-tight">
                बस एक जानकारी और
              </h1>
              <p className="font-body text-[14px] text-secondary">
                सही कीमत और लिस्टिंग बनाने के लिए हमें आकार जानना है
              </p>
            </div>

            {/* Prominent Question */}
            <div className="mt-space-24">
              <div className="flex items-center justify-between mb-space-12">
                <label className="font-title text-[17px] leading-[24px] font-medium text-on-secondary-container block">
                  उत्पाद का आकार क्या है?
                </label>
                <span className="font-label text-label-small text-secondary tracking-wide uppercase">वैकल्पिक इकाई</span>
              </div>
              
              {/* Size Options */}
              <div aria-label="उत्पाद का आकार चुनें" className="space-y-space-12" role="radiogroup">
                {/* Option 1: Small */}
                <label className={`relative flex items-center justify-between w-full min-h-[56px] px-space-16 py-3.5 bg-surface-container-lowest rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.99] ${selectedSize === "small" ? "border-2 border-on-secondary-container shadow-sm" : "border border-outline-variant hover:border-outline"}`}>
                  <input className="sr-only" name="product_size" type="radio" value="small" checked={selectedSize === "small"} onChange={() => setSelectedSize("small")} />
                  <div className="flex flex-col">
                    <span className={`font-title text-[16px] ${selectedSize === "small" ? "font-semibold" : ""} text-on-secondary-container`}>छोटा</span>
                    <span className="font-label text-[12px] text-secondary">6–8 इंच (हथेलिया आकार)</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedSize === "small" ? "border-2 border-on-secondary-container" : "border border-outline"}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${selectedSize === "small" ? "bg-on-secondary-container" : "bg-transparent"}`}></div>
                  </div>
                </label>

                {/* Option 2: Medium */}
                <label className={`relative flex items-center justify-between w-full min-h-[56px] px-space-16 py-3.5 bg-surface-container-lowest rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.99] ${selectedSize === "medium" ? "border-2 border-on-secondary-container shadow-sm" : "border border-outline-variant hover:border-outline"}`}>
                  <input className="sr-only" name="product_size" type="radio" value="medium" checked={selectedSize === "medium"} onChange={() => setSelectedSize("medium")} />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={`font-title text-[16px] ${selectedSize === "medium" ? "font-semibold" : ""} text-on-secondary-container`}>मध्यम</span>
                      <span className="inline-block px-1.5 py-0.5 bg-surface-container-high rounded text-[10px] font-label font-medium text-secondary">सुझाव</span>
                    </div>
                    <span className="font-label text-[12px] text-secondary">10–12 इंच (मानक मेज़ सजावट)</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedSize === "medium" ? "border-2 border-on-secondary-container" : "border border-outline"}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${selectedSize === "medium" ? "bg-on-secondary-container" : "bg-transparent"}`}></div>
                  </div>
                </label>

                {/* Option 3: Large */}
                <label className={`relative flex items-center justify-between w-full min-h-[56px] px-space-16 py-3.5 bg-surface-container-lowest rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.99] ${selectedSize === "large" ? "border-2 border-on-secondary-container shadow-sm" : "border border-outline-variant hover:border-outline"}`}>
                  <input className="sr-only" name="product_size" type="radio" value="large" checked={selectedSize === "large"} onChange={() => setSelectedSize("large")} />
                  <div className="flex flex-col">
                    <span className={`font-title text-[16px] ${selectedSize === "large" ? "font-semibold" : ""} text-on-secondary-container`}>बड़ा</span>
                    <span className="font-label text-[12px] text-secondary">14+ इंच (फ़र्श या मुख्य शोपीस)</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedSize === "large" ? "border-2 border-on-secondary-container" : "border border-outline"}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${selectedSize === "large" ? "bg-on-secondary-container" : "bg-transparent"}`}></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Secondary Voice Input Action Pill */}
            <div className="mt-space-24 flex justify-center">
              <button className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-surface-container-low border border-outline hover:bg-surface-container hover:border-secondary transition-all duration-150 active:scale-95 group" type="button">
                <span className="material-symbols-outlined text-[18px] text-secondary group-hover:text-on-secondary-container transition-colors">mic</span>
                <span className="font-body-medium text-[14px] text-on-secondary-variant font-medium">बोलकर बताएं</span>
              </button>
            </div>

            {/* Contextual Hint Strip */}
            <div className="mt-space-24 lg:mb-0 flex items-center justify-center gap-1.5 text-secondary">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <p className="font-label text-[11px] font-semibold">
                आप लिस्टिंग के बाद भी इसे कभी भी बदल सकते हैं
              </p>
            </div>
          </div>

          {/* DOCKED BOTTOM ACTION AREA */}
          <div className="w-full bg-surface-container-lowest mt-10 lg:mt-0">
            <Link href="/artisan/products/new/pricing" className="w-full h-[52px] bg-on-secondary-container text-surface rounded-xl font-headline text-[16px] font-medium flex items-center justify-center gap-2 hover:bg-primary transition-all duration-150 active:scale-[0.98] shadow-sm">
              <span>जारी रखें</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
