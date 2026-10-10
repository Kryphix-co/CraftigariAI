"use client";

import Link from "next/link";
import { useState } from "react";
import { QRCodeModal } from "@/components/buyer/QRCodeModal";
import { LanguageSelector } from "@/features/i18n/LanguageSelector";
import {
 PRODUCT_PRICE_OPTIONS,
 PRODUCT_SIZE_LABELS,
 useProductDraft,
} from "@/features/product/ProductDraftContext";
import { usePublicUrl } from "@/hooks/usePublicUrl";

export default function PublishedSuccessPage() {
 const [copied, setCopied] = useState(false);
 const [isQrOpen, setIsQrOpen] = useState(false);
 const { draft, photos } = useProductDraft();
 const productImage = draft.photoUploads[0]?.url ?? photos[0]?.url ?? null;
 const productTitle = draft.summary.title || "उत्पाद मसौदा";
 const selectedPrice = PRODUCT_PRICE_OPTIONS[draft.selectedPrice];
 const productId = draft.publishedProductId;
 const productPath = productId ? `/products/${productId}` : "/products";
 const passportPath = productId ? `/passport/${productId}` : "/products";
 const productUrl = usePublicUrl(productPath);
 const passportUrl = usePublicUrl(passportPath);
 const publishError = productId
  ? ""
  : "Publishing has not been confirmed. Return to preview and publish again.";

 const handleCopy = async () => {
  if (!productId) return;
  try {
   await navigator.clipboard.writeText(productUrl);
   setCopied(true);
   window.setTimeout(() => setCopied(false), 2000);
  } catch {
   setCopied(false);
  }
 };

 return (
 <div className="bg-surface text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-10 lg:pb-0">
  <div className="w-full min-h-[calc(100vh-56px)] flex flex-col">
  
  {/* Top App Bar (Dashboard global navigation integrated) */}
  <header className="w-full sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-4 lg:px-12 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
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
  <main className="flex-1 w-full px-4 lg:px-12 pt-2 pb-8 flex flex-col justify-center lg:min-h-[calc(100vh-56px)]">
   
   <div className="flex flex-col">
   {/* Subtle Elegant Status Icon */}
   <div className="w-16 h-16 bg-[#e6f4ea] text-success rounded-full flex items-center justify-center mt-6 mb-4">
    <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
   </div>

   {/* Title & Subtitle */}
   <div className="text-center mb-6">
    <h2 className="text-[22px] leading-7 font-bold text-on-surface">
    {productId ? "आपका उत्पाद प्रकाशित हो गया" : "प्रकाशन की पुष्टि नहीं हुई"}
    </h2>
    <p className="text-[14px] font-body text-secondary mt-1 w-full ">
    {productId ? "यह लिस्टिंग अब सार्वजनिक बाज़ार में उपलब्ध है।" : "पूर्वावलोकन पर लौटकर दोबारा प्रकाशित करें।"}
    </p>
   </div>

   {/* Published Product Card */}
   <section aria-label="प्रकाशित उत्पाद विवरण" className="bg-surface-container-low border border-outline-variant rounded-xl p-space-16 flex items-center gap-3.5 mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
    <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0 border border-outline-variant">
    {productImage ? (
     <img className="w-full h-full object-cover" alt={productTitle} src={productImage} />
    ) : (
     <div className="flex h-full w-full items-center justify-center text-secondary">
      <span className="material-symbols-outlined text-[24px]">image_not_supported</span>
     </div>
    )}
    </div>
    <div className="flex-1 min-w-0">
    <h3 className="text-[15px] font-semibold text-on-surface truncate leading-snug">
     {productTitle}
    </h3>
    <p className="text-[13px] font-body text-secondary mt-0.5">
     मूल्य: ₹{selectedPrice.toLocaleString("en-IN")} · {PRODUCT_SIZE_LABELS[draft.size]}
    </p>
    <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full bg-[#e6f4ea] border border-[#ceead6]">
     <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
     <span className="text-[11px] font-semibold text-success tracking-wide">Published product</span>
    </div>
    </div>
   </section>

   {/* Public URL Snippet Box */}
   <section aria-label="सार्वजनिक वेब लिंक" className="bg-surface rounded-xl border border-outline-variant p-space-12 flex items-center justify-between gap-2 mb-6">
    <div className="flex items-center gap-2 overflow-hidden">
    <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0">link</span>
    <span className="text-[11px] font-medium font-mono text-secondary truncate select-all">
     {productId ? productUrl : "स्थानीय लिंक बनाया जा रहा है…"}
    </span>
    </div>
    <button 
    aria-label="लिंक कॉपी करें" 
    className="flex items-center gap-1 text-[11px] font-medium text-on-surface px-2.5 py-1 rounded-md hover:bg-surface-container active:scale-95 transition-all border border-outline-variant flex-shrink-0 bg-surface-container-low" 
    disabled={!productId}
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
    <span className="text-[13px] font-semibold text-on-surface mt-0.5 block truncate">{productId ?? "Creating…"}</span>
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
     {productId ? <Link href={productPath} className="w-full h-[52px] bg-surface text-on-surface border border-outline hover:bg-surface-container-low font-medium text-[14px] rounded-lg flex items-center justify-center gap-2 active:scale-[0.99] transition-all">
    <span className="material-symbols-outlined text-[20px] text-success">visibility</span>
    <span>खरीदार के रूप में देखें (View Listing)</span>
     </Link> : <div className="w-full h-[52px] bg-surface-container text-secondary border border-outline font-medium text-[14px] rounded-lg flex items-center justify-center">लिस्टिंग बनाई जा रही है…</div>}
     <button className="w-full py-2 text-secondary hover:text-on-surface text-[14px] font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40" disabled={!productId} onClick={() => setIsQrOpen(true)} type="button">
    <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
    <span>QR कोड दिखाएं</span>
    </button>
   </div>
   {publishError && <p className="mt-3 text-center text-[12px] text-error">{publishError}</p>}
   </div>
  </main>
  </div>
  <QRCodeModal onClose={() => setIsQrOpen(false)} open={isQrOpen} passportUrl={passportUrl} productName={productTitle} />
 </div>
 );
}
