"use client";

import Link from "next/link";
import { useState } from "react";

export default function PublishedSuccessPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('https://craftigari.in/p/terracotta-kalash-284');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-10 lg:pb-0">
      <div className="w-full max-w-[1150px] mx-auto min-h-[calc(100vh-56px)] flex flex-col">
        
        {/* Top App Bar (Dashboard global navigation integrated) */}
        <header className="sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-space-16 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
          <div className="flex items-center space-x-3">
            <Link
              href="/artisan/dashboard"
              aria-label="बंद करें"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </Link>
            <span className="font-title text-[15px] text-on-surface tracking-tight font-semibold lg:hidden">सफलतापूर्वक प्रकाशित</span>
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
              aria-label="ध्वनि सहायता"
              className="w-9 h-9 flex items-center justify-center rounded-full border lg:border-outline-variant bg-surface hover:bg-surface-container text-on-surface active:scale-95 transition-all border-transparent"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary lg:text-on-surface">volume_up</span>
            </button>
          </div>
        </header>

        {/* Main Content Area: Calm Utility Flow */}
        <main className="flex-1 w-full max-w-[560px] mx-auto px-space-20 pt-2 pb-8 flex flex-col justify-center lg:min-h-[calc(100vh-56px)]">
          
          <div className="flex flex-col">
            {/* Subtle Elegant Status Icon */}
            <div className="w-16 h-16 bg-[#e6f4ea] text-success rounded-full flex items-center justify-center mx-auto mt-6 mb-4">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-6">
              <h2 className="text-[22px] leading-7 font-bold text-on-surface">
                आपका उत्पाद प्रकाशित हो गया
              </h2>
              <p className="text-[14px] font-body text-secondary mt-1 max-w-[300px] mx-auto">
                अब खरीदार आपकी लिस्टिंग देख सकते हैं और सीधे ऑर्डर कर सकते हैं।
              </p>
            </div>

            {/* Published Product Card */}
            <section aria-label="प्रकाशित उत्पाद विवरण" className="bg-surface-container-low border border-outline-variant rounded-xl p-space-16 flex items-center gap-3.5 mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0 border border-outline-variant">
                <img className="w-full h-full object-cover" alt="Product" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtWLl0boZT5cggoR-derf_uE8hGA1j7er2SFb3_3RRF-asmqvN0SDFB-rOC_3s2-LHmwZvzs414D10ETdjl0Tcn0VBan4HpPdKeIl_Tm7HlpNTOoYAjZobzayY4jbwZ7aPxGe-RpPE6JzoRznBcQIcBo8Ur58kBblTMJxHyxUnkhOwPZeKKK-51KZn6YTUnSS5aMp-Rf7IUSfBGSoZx0aztCEPF-a-vcIpu_RNbeqzHIPBCljAM5A" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-on-surface truncate leading-snug">
                  पारंपरिक टेराकोटा नक्काशी कलश
                </h3>
                <p className="text-[13px] font-body text-secondary mt-0.5">
                  मूल्य: ₹1,150 · मध्यम आकार
                </p>
                <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full bg-[#e6f4ea] border border-[#ceead6]">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  <span className="text-[11px] font-semibold text-success tracking-wide">
                    बाज़ार में लाइव (Live on Market)
                  </span>
                </div>
              </div>
            </section>

            {/* Public URL Snippet Box */}
            <section aria-label="सार्वजनिक वेब लिंक" className="bg-surface rounded-xl border border-outline-variant p-space-12 flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0">link</span>
                <span className="text-[11px] font-medium font-mono text-secondary truncate select-all">
                  craftigari.in/p/terracotta-kalash-284
                </span>
              </div>
              <button 
                aria-label="लिंक कॉपी करें" 
                className="flex items-center gap-1 text-[11px] font-medium text-on-surface px-2.5 py-1 rounded-md hover:bg-surface-container active:scale-95 transition-all border border-outline-variant flex-shrink-0 bg-surface-container-low" 
                onClick={handleCopy}
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                <span>{copied ? "कॉपी हुआ!" : "कॉपी"}</span>
              </button>
            </section>

            {/* Key Metrics Utility Row */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-surface border border-outline-variant rounded-lg">
                <span className="text-[11px] font-medium text-secondary block">लिस्टिंग आईडी</span>
                <span className="text-[16px] font-semibold text-on-surface mt-0.5 block">#CRF-2849</span>
              </div>
              <div className="p-3 bg-surface border border-outline-variant rounded-lg">
                <span className="text-[11px] font-medium text-secondary block">डिलीवरी उपलब्धता</span>
                <span className="text-[16px] font-semibold text-success flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  अखिल भारतीय
                </span>
              </div>
            </div>
            
            {/* Action Group */}
            <div className="space-y-3 pt-2">
              <Link href="/artisan/dashboard" className="w-full h-[52px] bg-[#1f1f1f] text-white font-medium text-[15px] rounded-lg flex items-center justify-center gap-2 hover:bg-[#303030] active:scale-[0.99] transition-all shadow-sm">
                <span className="material-symbols-outlined text-[20px]">visibility</span>
                <span>डैशबोर्ड पर लौटें</span>
              </Link>
              <button className="w-full h-[52px] bg-surface text-on-surface border border-outline hover:bg-surface-container-low font-medium text-[14px] rounded-lg flex items-center justify-center gap-2 active:scale-[0.99] transition-all" type="button">
                <span className="material-symbols-outlined text-[20px] text-success">share</span>
                <span>WhatsApp पर साझा करें</span>
              </button>
              <button className="w-full py-2 text-secondary hover:text-on-surface text-[14px] font-medium flex items-center justify-center gap-1.5 transition-colors" type="button">
                <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                <span>QR कोड दिखाएं</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
