"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BuyerInquiryPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      
      // For demo flow, auto-navigate to the Artisan's view of this inquiry after a short delay
      setTimeout(() => {
        router.push("/artisan/inquiries/inq-12345");
      }, 3000);
    }, 800);
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-24 lg:pb-0">
      <div className="w-full max-w-[1150px] mx-auto min-h-[calc(100vh-56px)] flex flex-col">
        
        {/* Top Navigation Bar */}
        <header className="sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-space-16 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              aria-label="Go Back" 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-primary hover:bg-surface-container transition-colors active:scale-95" 
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <span className="font-title text-[15px] font-semibold text-primary tracking-tight">कारीगर से पूछें</span>
              <span className="font-label-small text-[11px] text-secondary">Inquire with Artisan</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-small text-[11px] bg-surface-container text-secondary font-medium">
              Direct Connect
            </span>
          </div>
        </header>

        {/* Scrollable Form Container */}
        <main className="flex-1 px-space-16 pt-space-16 pb-32 flex flex-col lg:flex-row lg:gap-12 lg:min-h-[calc(100vh-56px)] lg:items-center lg:justify-center overflow-y-auto">
          
          <div className="w-full max-w-[760px] mx-auto flex flex-col gap-6">
            {/* Product Context Card */}
            <section className="bg-surface-container-low border border-outline-variant rounded-xl p-3 lg:p-4 flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface border border-outline-variant">
                <img className="w-full h-full object-cover" alt="Product thumbnail" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCR7rKbCVkztBl2j5hej2iszE7NrdRWBcoyF2I9xmk0RN9uFccjZ_J6YtXavI7zH5fvmdW3azjBBCmZOTgzQvXaiwmA8h2oeyzg69SF1t1anrtxrA3k6J3PdSz05N_JmbGPu2aRGh2fcHdFaDok7ezTnRJnu7vfIrM8lkbub1Vg0wX6cA2ax2eapH47M1HsE7SwoOea6t-mMcpGJK7rxPl0nwcZ5B1HTJK7174362iRr3JVLxVWnE" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-label-small text-[11px] text-on-tertiary-container font-semibold">हस्तशिल्प / Terracotta</span>
                </div>
                <h2 className="font-title text-[15px] font-semibold text-primary truncate">पारंपरिक टेराकोटा कलश</h2>
                <p className="font-label text-[13px] text-secondary flex items-center gap-1 mt-1">
                  <span className="text-primary font-semibold">₹1,150</span> / piece 
                  <span className="text-outline mx-1">•</span>
                  <span className="text-secondary font-normal truncate">कारीगर: राम सिंह (अलवर)</span>
                </p>
              </div>
            </section>

            {/* Trust Direct Connect Banner */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex items-start gap-3 lg:gap-4">
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-tertiary-container flex-shrink-0 shadow-sm border border-outline-variant">
                <span className="material-symbols-outlined text-[18px]">handshake</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-title text-[14px] font-semibold text-primary">सीधा संपर्क (No Middlemen)</span>
                  <span className="material-symbols-outlined text-success text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <p className="font-body text-[13px] text-secondary leading-snug">
                  कोई बिचौलिया नहीं — आपका संदेश सीधे कारीगर राम सिंह को भेजा जाएगा। वे स्वयं आपके व्हाट्सएप/फोन पर संपर्क करेंगे।
                </p>
              </div>
            </div>

            {/* Primary Form */}
            <form className="flex flex-col gap-6" id="inquiryForm" onSubmit={handleSubmit}>
              
              {/* Field: Quantity */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline">
                  <label className="font-title text-[14px] font-semibold text-primary" htmlFor="quantity">
                    मात्रा (संख्या) <span className="font-normal text-secondary">/ Required Quantity</span>
                  </label>
                  <span className="font-label-small text-[11px] text-on-tertiary-container">Bulk orders preferred</span>
                </div>
                <div className="relative">
                  <input className="w-full h-12 px-4 bg-surface text-primary border border-outline rounded-xl font-body text-[15px] focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-secondary/60" id="quantity" name="quantity" placeholder="e.g. 50 pieces or 100 sets" required type="text" defaultValue="80 pieces" />
                  <div className="absolute right-3 top-3 text-secondary pointer-events-none">
                    <span className="material-symbols-outlined text-[20px]">inventory</span>
                  </div>
                </div>
              </div>

              {/* Field: Delivery City / Pincode */}
              <div className="flex flex-col gap-1.5">
                <label className="font-title text-[14px] font-semibold text-primary" htmlFor="location">
                  डिलीवरी का शहर या पिनकोड <span className="font-normal text-secondary">/ Delivery Location</span>
                </label>
                <div className="relative">
                  <input className="w-full h-12 px-4 bg-surface text-primary border border-outline rounded-xl font-body text-[15px] focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-secondary/60" id="location" name="location" placeholder="e.g. Mumbai 400001 या जयपुर" required type="text" />
                  <div className="absolute right-3 top-3 text-secondary pointer-events-none">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                </div>
              </div>

              {/* Field: Requirement Details */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline">
                  <label className="font-title text-[14px] font-semibold text-primary" htmlFor="details">
                    अपनी ज़रूरत का विवरण <span className="font-normal text-secondary">/ Custom Requirement</span>
                  </label>
                  <span className="font-label-small text-[11px] text-secondary">कस्टमाइजेशन संभव</span>
                </div>
                <textarea className="w-full p-4 bg-surface text-primary border border-outline rounded-xl font-body text-[15px] focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-secondary/60 resize-none" id="details" name="details" placeholder="जैसे: हमें 15 दिनों में लाल रंग के 80 पीस चाहिए, साथ ही लकड़ी का बेस चाहिए। (e.g., I need 80 pieces in natural terracotta finish delivered within 15 days for festive gifting)." rows={4}></textarea>
              </div>

              {/* Contact Section Divider */}
              <div className="pt-6 border-t border-outline-variant flex flex-col gap-5 mt-2">
                <div>
                  <h3 className="font-title text-[16px] font-semibold text-primary">आपकी संपर्क जानकारी</h3>
                  <p className="font-label-small text-[12px] text-secondary mt-1">कारीगर आपसे कैसे संपर्क करें? किसी खाते या पासवर्ड की ज़रूरत नहीं है।</p>
                </div>
                
                {/* Field: Buyer Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-title text-[14px] font-semibold text-primary" htmlFor="buyer_name">
                    आपका नाम <span className="font-normal text-secondary">/ Your Name or Organization</span>
                  </label>
                  <input className="w-full h-12 px-4 bg-surface text-primary border border-outline rounded-xl font-body text-[15px] focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-secondary/60" id="buyer_name" name="buyer_name" placeholder="e.g. राजेश शर्मा / Studio Craft" required type="text" />
                </div>

                {/* Field: WhatsApp / Phone */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="font-title text-[14px] font-semibold text-primary" htmlFor="contact_number">
                      व्हाट्सएप / मोबाइल नंबर <span className="font-normal text-secondary">/ WhatsApp or Mobile</span>
                    </label>
                    <span className="font-label-small text-[11px] text-success flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[13px]">chat</span> WhatsApp Reply
                    </span>
                  </div>
                  <div className="flex rounded-xl border border-outline overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                    <span className="inline-flex items-center px-4 bg-surface-container text-primary font-title text-[15px] font-medium border-r border-outline select-none">
                      +91
                    </span>
                    <input className="w-full h-12 px-4 bg-surface text-primary border-0 font-body text-[15px] focus:ring-0 placeholder:text-secondary/60 outline-none" id="contact_number" name="contact_number" placeholder="98765 43210" required type="tel" />
                  </div>
                </div>
              </div>

              {/* Privacy & Protection Micro-Note */}
              <div className="flex items-center gap-2 text-secondary font-label-small text-[11px] pt-2 mb-2 lg:mb-4">
                <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
                <span>आपका नंबर सुरक्षित है। हम कभी स्पैम संदेश या विज्ञापन नहीं भेजते।</span>
              </div>
              
              {/* Desktop Submit Button (Inline) */}
              <button 
                className="hidden lg:flex w-full h-[52px] bg-primary text-surface rounded-xl font-title text-[16px] font-semibold items-center justify-center gap-2 hover:bg-[#303030] active:scale-[0.98] transition-all shadow-sm disabled:opacity-70 mt-2" 
                form="inquiryForm" 
                type="submit"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "भेजा जा रहा है..." : "पूछताछ भेजें / Send Inquiry"}</span>
                {!isSubmitting && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* Mobile Sticky Bottom Action Area */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-outline-variant p-4">
        <div className="flex flex-col gap-2 max-w-[420px] mx-auto w-full">
          <button 
            className="w-full h-[52px] bg-primary text-surface rounded-xl font-title text-[16px] font-semibold flex items-center justify-center gap-2 hover:bg-[#303030] active:scale-[0.98] transition-all shadow-sm disabled:opacity-70" 
            form="inquiryForm" 
            type="submit"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? "भेजा जा रहा है..." : "पूछताछ भेजें / Send Inquiry"}</span>
            {!isSubmitting && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
          </button>
          <p className="font-label-small text-[11px] text-center text-secondary">
            सीधे कारीगर राम सिंह को त्वरित अलर्ट भेजा जाएगा
          </p>
        </div>
      </div>

        {/* Feedback Toast Modal Simulation */}
        <div className={`fixed top-20 left-4 right-4 lg:left-1/2 lg:-ml-[194px] max-w-[388px] w-full bg-surface border border-outline rounded-xl p-4 shadow-xl z-50 transition-all duration-300 pointer-events-none ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center text-success flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div className="flex-1 mt-0.5">
              <p className="font-title text-[15px] font-semibold text-primary">पूछताछ सफलतापूर्वक भेज दी गई!</p>
              <p className="font-body text-[13px] text-secondary mt-1 leading-snug">कारीगर राम सिंह को आपका संदेश मिल गया है। (Navigating to artisan view...)</p>
            </div>
          </div>
        </div>

      </div>
  );
}
