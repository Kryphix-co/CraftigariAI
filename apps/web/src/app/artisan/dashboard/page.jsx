"use client";

import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/i18n/LanguageContext";

export default function ArtisanDashboardPage() {
 const { artisan } = useAuth();
 const { language: uiLang, t } = useLanguage();

 return (
 <div className="bg-surface text-on-surface antialiased min-h-full flex flex-col justify-between selection:bg-surface-container-high pb-20 lg:pb-0">
  <ArtisanHeader activeTab="home" />

  {/* Main Canvas Container */}
  <main className="flex-1 w-full px-4 lg:px-12 pt-8 pb-28 lg:pb-12 lg:grid lg:grid-cols-12 lg:gap-12 lg:min-h-[calc(100vh-56px)] lg:content-center">
  
  {/* Left Column (Desktop) / Main Column (Mobile) */}
  <div className="lg:col-span-5">
   {/* Header / Artisan Identity Section */}
   <section className="py-space-12 flex items-center justify-between lg:py-0 lg:mb-8">
   <div className="flex items-center gap-3">
    <div className="relative">
    {artisan?.profilePhoto ? (
     <img
      className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover border border-outline-variant"
      alt={artisan.name || "Artisan profile"}
      src={artisan.profilePhoto}
     />
    ) : (
     <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center text-tertiary">
      <span className="material-symbols-outlined text-[28px]">person</span>
     </div>
    )}
    </div>
    <div>
     <h1 className="text-[20px] lg:text-[24px] leading-7 font-bold text-[#202124] tracking-tight">
      {uiLang === "hi" ? `नमस्ते, ${artisan?.name || "कारीगर"}` : `Hello, ${artisan?.name || "Artisan"}`}
     </h1>
     <div className="flex items-center gap-1 text-[13px] text-[#5F6368] font-body mt-0.5">
      <span className="material-symbols-outlined text-[15px] text-on-surface-variant">location_on</span>
      <span>{artisan?.location || (uiLang === "hi" ? "अपना क्षेत्र जोड़ें" : "Add your region")}</span>
     </div>
    </div>
   </div>
   </section>

   {/* Dominant Primary Action (Add Product via Voice or Photo) */}
   <section className="mt-space-20 mb-space-32 lg:mt-0 lg:mb-8">
   <Link href="/artisan/products/new" className="w-full h-[52px] rounded-[10px] bg-primary-container text-on-primary flex items-center justify-center gap-2.5 px-4 lg:px-12 text-[16px] font-medium shadow-sm hover:bg-[#303030] active:scale-[0.99] transition-all">
    <span className="material-symbols-outlined text-[22px]">photo_camera</span>
    <span className="text-secondary-fixed-dim font-light text-base">+</span>
    <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
    <span className="ml-1 tracking-wide">{uiLang === "hi" ? "नया उत्पाद जोड़ें" : "Add New Craft"}</span>
   </Link>
   {/* Subtle Helper Copy */}
   <p className="text-center text-[13px] text-[#5F6368] mt-2.5 font-body flex items-center justify-center gap-1.5">
    <span className="material-symbols-outlined text-[14px] text-on-surface-variant">auto_awesome</span>
    <span>{uiLang === "hi" ? "फ़ोटो खींचें या बोलकर बताएं • कोई टाइपिंग नहीं" : "Take photos or speak • No typing required"}</span>
   </p>
   </section>
   
   {/* Quiet Help Assistance Notice */}
   <div className="hidden lg:flex p-3.5 rounded-xl border border-outline-variant bg-[#F8F9FA] items-center justify-center gap-2 text-center text-[13px] text-[#5F6368]">
   <span className="material-symbols-outlined text-[18px] text-on-surface-variant">support_agent</span>
   <span>सहायता चाहिए? ऊपर स्पीकर बटन दबाएं या सहायता केंद्र चुनें</span>
   </div>
  </div>

  {/* Right Column (Desktop) / Second Block (Mobile) */}
  <div className="lg:col-span-7">
   {/* Section Header: Recent Crafts */}
   <div className="flex items-center justify-between mb-space-12">
   <h2 className="text-[18px] leading-6 font-semibold text-[#202124] tracking-tight">हाल के उत्पाद</h2>
   <a className="text-[14px] font-medium text-[#5F6368] hover:text-primary transition-colors flex items-center gap-0.5" href="#all-crafts">
    <span>सभी देखें</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
   </a>
   </div>

   {/* Recent Products List: Quiet Uncluttered Rows */}
   <section className="space-y-3 lg:space-y-4">
   {/* Item 1: Terracotta Floral Vase */}
   <div className="bg-surface rounded-[12px] border border-outline-variant p-3.5 lg:p-4 flex items-center justify-between gap-3 hover:border-outline transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
    <div className="flex items-center gap-3 min-w-0">
    <img
     className="w-16 h-16 lg:w-20 lg:h-20 rounded-[8px] object-cover bg-surface-container flex-shrink-0 border border-outline-variant"
     alt="Terracotta Vase"
     src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop"
    />
    <div className="min-w-0">
     <h3 className="text-[15px] lg:text-[16px] font-semibold text-[#202124] truncate mb-1">टेराकोटा नक्काशी फूलदान</h3>
     <div className="flex items-center gap-2">
     <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-accent-terracotta-soft text-accent-terracotta border border-tertiary-fixed">तैयार</span>
     <span className="text-[15px] lg:text-[16px] font-bold text-[#202124]">₹1,450</span>
     </div>
    </div>
    </div>
    <div className="flex-shrink-0 pl-2">
    <button
     className="h-9 lg:h-10 px-3 lg:px-4 rounded-lg border border-outline text-[#1F1F1F] bg-surface text-[13px] lg:text-[14px] font-medium hover:bg-surface-container active:scale-95 transition-all flex items-center gap-1"
     type="button"
    >
     <span>जारी रखें</span>
     <span className="material-symbols-outlined text-[16px] lg:text-[18px]">arrow_forward</span>
    </button>
    </div>
   </div>

   {/* Item 2: Indigo Block Print Shawl */}
   <div className="bg-surface rounded-[12px] border border-outline-variant p-3.5 lg:p-4 flex items-center justify-between gap-3 hover:border-outline transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
    <div className="flex items-center gap-3 min-w-0">
    <img
     className="w-16 h-16 lg:w-20 lg:h-20 rounded-[8px] object-cover bg-surface-container flex-shrink-0 border border-outline-variant"
     alt="Indigo Block Print Shawl"
     src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop"
    />
    <div className="min-w-0">
     <h3 className="text-[15px] lg:text-[16px] font-semibold text-[#202124] truncate mb-1">इंडिगो ब्लॉक प्रिंट शॉल</h3>
     <div className="flex items-center gap-2">
     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-container text-success border border-outline">
      <span className="w-1.5 h-1.5 rounded-full bg-success inline-block"></span>
      सक्रिय (Live)
     </span>
     <span className="text-[15px] lg:text-[16px] font-bold text-[#202124]">₹2,800</span>
     </div>
    </div>
    </div>
    <div className="flex-shrink-0 pl-2">
    <button
     className="h-9 lg:h-10 px-3 lg:px-4 rounded-lg border border-outline-variant text-[#5F6368] bg-transparent text-[13px] lg:text-[14px] font-medium hover:bg-surface-container hover:text-on-surface active:scale-95 transition-all flex items-center gap-1"
     type="button"
    >
     <span>देखें</span>
     <span className="material-symbols-outlined text-[16px] lg:text-[18px]">chevron_right</span>
    </button>
    </div>
   </div>

   {/* Item 3: Clay Water Jug (Matka) */}
   <div className="bg-surface rounded-[12px] border border-outline-variant p-3.5 lg:p-4 flex items-center justify-between gap-3 hover:border-outline transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
    <div className="flex items-center gap-3 min-w-0">
    <img
     className="w-16 h-16 lg:w-20 lg:h-20 rounded-[8px] object-cover bg-surface-container flex-shrink-0 border border-outline-variant"
     alt="Clay Water Jug"
     src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop"
    />
    <div className="min-w-0">
     <h3 className="text-[15px] lg:text-[16px] font-semibold text-[#202124] truncate mb-1">मिट्टी का पानी का मटका</h3>
     <div className="flex items-center gap-2">
     <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-container text-[#5F6368] border border-outline">अधूरा ड्राफ़्ट</span>
     <span className="text-[13px] text-[#5F6368]">मूल्य शेष</span>
     </div>
    </div>
    </div>
    <div className="flex-shrink-0 pl-2">
    <button
     className="h-9 lg:h-10 px-3.5 lg:px-4 rounded-lg bg-primary-container text-on-primary text-[13px] lg:text-[14px] font-medium hover:bg-[#303030] active:scale-95 transition-all flex items-center gap-1"
     type="button"
    >
     <span>पूरा करें</span>
     <span className="material-symbols-outlined text-[16px] lg:text-[18px]">arrow_forward</span>
    </button>
    </div>
   </div>
   </section>
  </div>

  {/* Quiet Help Assistance Notice (Mobile) */}
  <div className="lg:hidden mt-space-32 p-3.5 rounded-xl border border-outline-variant bg-[#F8F9FA] flex items-center justify-center gap-2 text-center text-[13px] text-[#5F6368]">
   <span className="material-symbols-outlined text-[18px] text-on-surface-variant">support_agent</span>
   <span>सहायता चाहिए? ऊपर स्पीकर बटन दबाएं या सहायता केंद्र चुनें</span>
  </div>
  </main>
  
  <BottomNav activeTab="home" />
 </div>
 );
}
