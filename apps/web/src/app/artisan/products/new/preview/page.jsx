"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { LanguageSelector } from "@/features/i18n/LanguageSelector";
import {
 PRODUCT_PRICE_OPTIONS,
 PRODUCT_SIZE_LABELS,
 useProductDraft,
} from "@/features/product/ProductDraftContext";
import { useAuth } from "@/features/auth/AuthContext";
import { publishProductDraft } from "@/lib/productPublishing";

export default function ListingPreviewPage() {
 const { draft, makingProcessImages, photos, updateDraft, voice } = useProductDraft();
 const { artisan } = useAuth();
 const [isPlaying, setIsPlaying] = useState(false);
 const [isPublishing, setIsPublishing] = useState(false);
 const [publishError, setPublishError] = useState("");
 const audioRef = useRef(null);
 const publishingRef = useRef(false);
 const router = useRouter();
 const productImage = photos[0]?.url ?? draft.photoUploads[0]?.url ?? "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop";
 const productTitle = draft.summary.title || "उत्पाद का शीर्षक जोड़ें";
 const productDescription =
  draft.summary.translatedDescription ||
  draft.summary.description ||
  draft.transcript ||
  "उत्पाद का विवरण अभी नहीं जोड़ा गया है।";
 const selectedPrice =
  typeof draft.pricing?.finalPrice === "number" && draft.pricing.finalPrice > 0
   ? draft.pricing.finalPrice
   : typeof draft.selectedPrice === "number" && draft.selectedPrice > 0
   ? draft.selectedPrice
   : PRODUCT_PRICE_OPTIONS[draft.selectedPrice] ?? 1150;

 const toggleAudio = async () => {
  if (!audioRef.current || !voice) return;
  if (audioRef.current.paused) {
   await audioRef.current.play();
   setIsPlaying(true);
  } else {
   audioRef.current.pause();
   setIsPlaying(false);
  }
 };

 const handlePublish = async () => {
  if (publishingRef.current) return;
  publishingRef.current = true;
  setIsPublishing(true);
  setPublishError("");
  try {
   await publishProductDraft({
    draft,
    makingProcessImages,
    photos,
    updateDraft,
   });
   router.push("/artisan/products/new/success");
  } catch (error) {
   publishingRef.current = false;
   setIsPublishing(false);
   setPublishError(error.message || "Product could not be published.");
  }
 };

 return (
 <div className="bg-surface text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-24 lg:pb-0">
  {voice && <audio ref={audioRef} src={voice.url} onEnded={() => setIsPlaying(false)} />}
  <div className="w-full min-h-[calc(100vh-56px)] flex flex-col">
  
  {/* Top App Bar (Dashboard global navigation integrated) */}
  <header className="w-full sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-4 lg:px-12 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
   <div className="flex items-center space-x-3">
   <Link
    href="/artisan/products/new/making-process"
    aria-label="वापस जाएं"
    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all lg:hidden"
   >
    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
   </Link>
   <span className="font-title text-[15px] text-on-surface tracking-tight font-semibold lg:hidden">लिस्टिंग पूर्वावलोकन</span>
   <span className="font-headline text-[20px] text-primary tracking-tight font-bold hidden lg:block">Craftigari नमस्ते</span>
   </div>

   {/* Desktop Navigation (Hidden on mobile/tablet) */}
   <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
   <Link href="/artisan/dashboard" className="text-secondary hover:text-primary transition-colors">Home</Link>
   <Link href="/products" className="text-secondary hover:text-primary transition-colors">Crafts</Link>
   <Link href="/artisan/products/new" className="flex items-center gap-1.5 text-accent-terracotta bg-accent-terracotta-soft px-3 py-1.5 rounded-full hover:bg-tertiary-fixed transition-colors">
    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
    Add
   </Link>
   <Link href="/products" className="text-secondary hover:text-primary transition-colors">Market</Link>
   <Link href="/artisan/profile" className="text-secondary hover:text-primary transition-colors">Profile</Link>
   </nav>

   <div className="flex items-center space-x-2">
   <LanguageSelector compact />
   </div>
  </header>

  {/* Main Content Area */}
  <main className="w-full flex-1 px-4 lg:px-12 pt-space-12 pb-space-24 flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 lg:min-h-[calc(100vh-56px)] lg:content-center overflow-y-auto">
   
   {/* Left Column on Desktop */}
   <div className="lg:col-span-5 flex flex-col">
   {/* Screen Intent Heading */}
   <div className="pb-space-8 flex items-center justify-between">
    <div>
    <span className="text-success font-label-small text-[11px] uppercase tracking-wider block">चरण 3/3 • अंतिम समीक्षा</span>
    <h2 className="font-headline text-[22px] text-primary font-bold mt-0.5 tracking-tight">आपकी लिस्टिंग तैयार है</h2>
    </div>
    <div className="flex items-center space-x-1 text-secondary bg-surface-container px-2.5 py-1 rounded-full border border-outline">
    <span className="material-symbols-outlined text-[15px] text-secondary">visibility</span>
    <span className="font-label text-[11px]">क्रेता दृश्य</span>
    </div>
   </div>

   {/* Hero Product Showcase Bento Card */}
   <section className="mt-space-8 relative group">
    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container relative border border-outline-variant">
    <img className="w-full h-full object-cover object-center" alt={productTitle} src={productImage} />
    <Link aria-label="फोटो संपादित करें" className="absolute top-3 right-3 bg-surface/90 hover:bg-surface text-primary rounded-full p-1.5 backdrop-blur-sm border border-outline shadow-sm transition-transform active:scale-95 flex items-center justify-center" href="/artisan/products/new">
     <span className="material-symbols-outlined text-[18px]">edit</span>
    </Link>
    </div>
    {/* Trust Badges */}
    <div className="flex items-center gap-2 mt-3 flex-wrap">
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline text-primary font-label text-[12px] font-medium">
     <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">palette</span>
     <span>हस्तनिर्मित शिल्प</span>
    </span>
    </div>
   </section>
   </div>

   {/* Right Column on Desktop */}
   <div className="lg:col-span-7 flex flex-col lg:mt-0 mt-space-16">
   
   {/* Title, Price & Quick Affordance */}
   <section className="pb-space-16 border-b border-outline-variant">
    <div className="flex items-start justify-between gap-2">
    <h3 className="font-title text-[18px] leading-[26px] font-bold text-primary flex-1">
     {productTitle}
    </h3>
    <Link aria-label="शीर्षक बदलें" className="text-secondary hover:text-primary p-1 transition-colors" href="/artisan/products/new/summary">
     <span className="material-symbols-outlined text-[18px]">edit</span>
    </Link>
    </div>
    <div className="mt-space-12 flex items-baseline justify-between bg-surface-container-low p-space-12 rounded-lg border border-outline-variant">
    <div>
     <div className="flex items-baseline gap-1.5">
     <span className="font-display text-[26px] font-bold text-primary tracking-tight">₹{selectedPrice.toLocaleString("en-IN")}</span>
     </div>
     {draft.pricing?.totalCost > 0 && (
      <p className="font-label text-[12px] text-secondary mt-0.5">
       घोषित न्यूनतम लागत: ₹{draft.pricing.totalCost.toLocaleString("en-IN")} · अनुमानित लाभ: ₹{Math.max(0, selectedPrice - draft.pricing.totalCost).toLocaleString("en-IN")}
      </p>
     )}
     <p className="font-label text-[12px] text-success flex items-center gap-1 mt-0.5">
     <span className="material-symbols-outlined text-[14px]">local_shipping</span>
     निःशुल्क डिलीवरी सम्मिलित (अखिल भारतीय)
     </p>
    </div>
    <Link className="inline-flex items-center gap-1 text-primary hover:bg-surface-container px-2.5 py-1 rounded-md font-label text-[12px] font-semibold border border-outline bg-surface transition-all active:scale-95" href="/artisan/products/new/pricing">
     <span className="material-symbols-outlined text-[14px]">edit</span>
     <span>बदलें</span>
    </Link>
    </div>
   </section>

   {/* AI Voice & Story Audio Banner */}
   <section className="mt-space-16 p-space-12 rounded-lg bg-surface-container border border-outline flex items-center justify-between">
    <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center">
     <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
    </div>
    <div>
     <h4 className="font-label text-[12px] font-bold text-primary">कारीगर की आवाज में विवरण</h4>
     <p className="font-label-small text-[11px] text-secondary">{voice ? "आपका रिकॉर्ड किया गया वॉयस नोट" : "कोई वॉयस नोट रिकॉर्ड नहीं किया गया"}</p>
    </div>
    </div>
    <button aria-label="ऑडियो सुनें" className="w-8 h-8 rounded-full bg-surface border border-outline text-primary flex items-center justify-center hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled={!voice} onClick={toggleAudio} type="button">
    <span className="material-symbols-outlined text-[18px]">{isPlaying ? "pause" : "volume_up"}</span>
    </button>
   </section>

   {/* Structured Product Story & Craft Information */}
   <section className="mt-space-16 space-y-space-16 flex-1">
    {/* Section Header */}
    <div className="flex items-center justify-between">
    <h3 className="font-title text-[16px] font-bold text-primary flex items-center gap-2">
     <span>उत्पाद का विवरण</span>
    </h3>
    <Link aria-label="विवरण संपादित करें" className="text-secondary hover:text-primary p-1" href="/artisan/products/new/voice">
     <span className="material-symbols-outlined text-[18px]">edit</span>
    </Link>
    </div>
    {/* Description text */}
    <p className="font-body text-[14px] text-on-surface-variant leading-relaxed">
    {productDescription}
    </p>

    {/* Technical / Provenance Craft Details (Clean Divided List) */}
    <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface mt-4">
    <div className="bg-surface-container-low px-4 py-2.5 border-b border-outline-variant flex items-center justify-between">
     <span className="font-label text-[12px] font-bold text-primary uppercase tracking-wide">हस्तकला विशेषताएँ (Craft Specs)</span>
     <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
    </div>
    <div className="divide-y divide-outline-variant">
     <div className="px-4 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
     <span className="font-label text-[12px] text-secondary">शिल्प प्रकार</span>
     <span className="font-body-medium text-[14px] text-primary text-right font-medium">{draft.summary.craftType || "जानकारी नहीं जोड़ी गई"}</span>
     </div>
     <div className="px-4 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
     <span className="font-label text-[12px] text-secondary">मुख्य सामग्री</span>
     <span className="font-body-medium text-[14px] text-primary text-right font-medium">{draft.summary.material || "जानकारी नहीं जोड़ी गई"}</span>
     </div>
     <div className="px-4 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
     <span className="font-label text-[12px] text-secondary">उत्पाद का आकार</span>
     <span className="font-body-medium text-[14px] text-primary text-right font-medium">{PRODUCT_SIZE_LABELS[draft.size]}</span>
     </div>
     <div className="px-4 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
     <span className="font-label text-[12px] text-secondary">निर्माण समय</span>
     <span className="font-body-medium text-[14px] text-primary text-right font-medium">{draft.summary.effort || "जानकारी नहीं जोड़ी गई"}</span>
     </div>
     <div className="px-4 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
     <span className="font-label text-[12px] text-secondary">कारीगर व क्षेत्र</span>
     <div className="text-right">
      <span className="font-body-medium text-[14px] text-primary font-medium block">{artisan?.name || "आपका कारीगर प्रोफ़ाइल"}</span>
      <span className="font-label-small text-[11px] text-secondary flex items-center justify-end gap-0.5 mt-0.5">
      <span className="material-symbols-outlined text-[13px] text-secondary">location_on</span>
      {artisan?.location || "स्थान नहीं जोड़ा गया"}
      </span>
     </div>
     </div>
    </div>
    </div>
   </section>

   {/* Making Process */}
   <section className="mt-space-16 space-y-space-12">
    <div className="flex items-center justify-between">
    <h3 className="font-title text-[16px] font-bold text-primary flex items-center gap-2">
     <span className="material-symbols-outlined text-[19px] text-secondary">handyman</span>
     <span>Making Process</span>
    </h3>
    <Link aria-label="Edit making process" className="inline-flex items-center gap-1 rounded-md border border-outline bg-surface px-2.5 py-1 font-label text-[12px] font-semibold text-primary transition-colors hover:bg-surface-container" href="/artisan/products/new/making-process">
     <span className="material-symbols-outlined text-[14px]">edit</span>
     <span>Edit</span>
    </Link>
    </div>

    <div className="space-y-3">
    {draft.makingProcess.map((step, index) => {
     const processImage = makingProcessImages[step.id];
     return (
     <article className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 rounded-xl border border-outline-variant bg-surface p-3 sm:grid-cols-[128px_minmax(0,1fr)]" key={step.id}>
      <div className="aspect-square overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
      {processImage?.url || step.imageUrl ? (
       <img alt={step.title || `Process step ${index + 1}`} className="h-full w-full object-cover" src={processImage?.url || step.imageUrl} />
      ) : (
       <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center text-secondary">
       <span className="material-symbols-outlined text-[22px]">image_not_supported</span>
       <span className="font-label text-[9px]">Photo unavailable</span>
       </div>
      )}
      </div>
      <div className="min-w-0 py-0.5">
      <span className="font-label text-[10px] font-semibold uppercase tracking-wider text-secondary">Step {index + 1}</span>
      <h4 className="mt-0.5 font-title text-[14px] font-bold text-primary sm:text-[15px]">{step.title || "Untitled process step"}</h4>
      <p className="mt-1 font-body text-[12px] leading-relaxed text-on-surface-variant sm:text-[13px]">
       {step.description || "No description added."}
      </p>
      </div>
     </article>
     );
    })}
    </div>
   </section>

   {/* Quality Assurance & AI Optimization Notice */}
   <section className="mt-space-16 p-space-12 rounded-lg bg-surface-container-low border border-outline-variant flex items-start gap-3">
    <span className="material-symbols-outlined text-[20px] text-primary mt-0.5">auto_awesome</span>
    <div className="text-left">
    <h4 className="font-label text-[12px] font-bold text-primary">प्रकाशन से पहले अंतिम मसौदा</h4>
    <p className="font-body text-[12px] text-on-surface-variant mt-0.5 leading-snug">
     केवल आपके द्वारा दर्ज और चुनी गई जानकारी दिखाई जा रही है। कोई AI प्रक्रिया नहीं चलाई गई है।
    </p>
    </div>
   </section>

   {publishError && <p className="mt-4 text-[12px] text-error" role="alert">{publishError}</p>}

   {/* Bottom Docked Actions for Desktop */}
   <div className="hidden lg:flex gap-4 mt-8 pt-6 border-t border-outline-variant">
    <Link className="flex-1 h-[52px] bg-surface border border-outline text-[#1f1f1f] hover:bg-surface-container-low active:scale-[0.99] font-body-medium text-[15px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all" href="/artisan/products/new/summary">
    <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
    <span>बदलाव करें</span>
    </Link>
    <button disabled={isPublishing} onClick={handlePublish} type="button" className="flex-1 h-[52px] bg-[#1f1f1f] text-white hover:bg-[#303030] active:scale-[0.99] font-body-medium text-[15px] font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60">
    <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
    <span>{isPublishing ? "प्रकाशित हो रहा है…" : "प्रकाशित करें"}</span>
    </button>
   </div>
   </div>
  </main>
  </div>

  {/* Bottom Docked Actions for Mobile */}
  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 border-t border-outline-variant p-space-16 z-50 backdrop-blur-md">
  <button disabled={isPublishing} onClick={handlePublish} type="button" className="w-full h-[52px] bg-[#1f1f1f] text-white hover:bg-[#303030] active:scale-[0.99] font-body-medium text-[15px] font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60">
   <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
   <span>{isPublishing ? "प्रकाशित हो रहा है…" : "प्रकाशित करें"}</span>
  </button>
  <Link className="w-full h-11 mt-2 bg-surface border border-outline text-[#1f1f1f] hover:bg-surface-container-low active:scale-[0.99] font-body-medium text-[14px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all" href="/artisan/products/new/summary">
   <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
   <span>बदलाव करें</span>
  </Link>
  </div>
 </div>
 );
}
