"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function PublicProductPage() {
  const params = useParams();
  const slug = params?.slug || "terracotta-urn";

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-24 lg:pb-0">
      <div className="w-full max-w-[1150px] mx-auto min-h-[calc(100vh-56px)] flex flex-col">
      
        {/* Public Top App Bar */}
        <header className="sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-space-16 h-14 flex items-center justify-between border-b border-outline-variant shrink-0 lg:px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            aria-label="Go Back"
            className="w-10 h-10 -ml-2 lg:ml-0 rounded-xl flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="font-headline text-[18px] lg:text-[22px] font-bold tracking-tight text-primary">Craftigari</span>
            <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6 mr-6 text-[14px] font-medium text-secondary">
            <Link href="#" className="hover:text-primary transition-colors">Artisans</Link>
            <Link href="#" className="hover:text-primary transition-colors">Categories</Link>
            <Link href="#" className="hover:text-primary transition-colors">About Craftigari</Link>
          </nav>
          
          <button aria-label="Listen details" className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary hover:bg-surface-container-low hover:text-primary transition-colors hidden lg:flex" type="button">
            <span className="material-symbols-outlined text-[20px]">volume_up</span>
          </button>
          <button aria-label="Share craft" className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary hover:bg-surface-container-low hover:text-primary transition-colors" type="button">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 w-full max-w-[1150px] mx-auto pt-4 lg:pt-12 px-0 lg:px-8 pb-12 lg:grid lg:grid-cols-12 lg:gap-16">
        
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-6 flex flex-col">
          <section className="px-space-16 lg:px-0">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant">
              <img 
                alt="Handcrafted Terracotta Heritage Urn" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ2Eipg69w5oIkwtb1XVdTcdNB_AEnECXHZGUXEQrdx3TiiN3MXqBxITWTY0JGNTk31uz_egjCeNnq8T_UiwS6eOBWLNfgN5fPFq2eUA3C7F1VYYn_LQRK7y2U9Rfrtdp3cMuDm5uldEGiwA7S8nn5qfHYU7zdLaxeb9MzfgJO-3jCv3NQ4sqz1RyaCz5OpsZr-kxv0_SCAMfF4YPE7OY6hiWwK2WQjKQjKYa0kZIrET5yEpHr6G8" 
              />
              {/* Artisan Heritage Badge Floating */}
              <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-outline flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span>
                <span className="font-label-small text-[11px] uppercase tracking-wider text-primary font-bold">Authentic Handcraft</span>
              </div>
            </div>
            {/* Gallery Dots Indicator */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <span className="w-6 h-1.5 rounded-full bg-primary transition-all"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline transition-all cursor-pointer hover:bg-secondary"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline transition-all cursor-pointer hover:bg-secondary"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline transition-all cursor-pointer hover:bg-secondary"></span>
            </div>
          </section>

          {/* Trust Indicators / Quiet Badges (Desktop moves here, Mobile at bottom) */}
          <section className="hidden lg:grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px] text-on-tertiary-container">eco</span>
              <div className="flex flex-col">
                <span className="font-body-medium text-[15px] font-semibold text-primary">100% Natural</span>
                <span className="font-label-small text-[12px] text-secondary">Zero chemical glaze</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px] text-on-tertiary-container">handshake</span>
              <div className="flex flex-col">
                <span className="font-body-medium text-[15px] font-semibold text-primary">Direct Artisan</span>
                <span className="font-label-small text-[12px] text-secondary">Fair compensation</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-6 flex flex-col mt-8 lg:mt-0">
          
          {/* Title & Price Block */}
          <section className="px-space-16 lg:px-0">
            {/* Dual Language Title */}
            <div className="space-y-1">
              <h1 className="font-headline text-[24px] lg:text-[32px] lg:leading-[40px] font-bold text-primary tracking-tight">
                Handcrafted Terracotta Heritage Urn
              </h1>
              <p className="font-body-medium text-[15px] lg:text-[16px] text-secondary">
                पारंपरिक हाथ से तराशा हुआ टेराकोटा कलश
              </p>
            </div>
            
            {/* Price Display & Trade Transparency */}
            <div className="mt-6 p-4 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[28px] lg:text-[32px] font-bold text-primary tracking-tight">₹1,150</span>
                <span className="font-label text-[13px] text-secondary">indicative price</span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label text-[13px]">
                <span className="material-symbols-outlined text-[18px] text-success" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span>Direct artisan price · Custom quantities available</span>
              </div>
            </div>
          </section>

          {/* Artisan Context & Heritage Row */}
          <section className="px-space-16 lg:px-0 mt-6">
            <div className="p-4 rounded-xl border border-outline bg-surface flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold font-title text-[16px] border border-outline-variant">
                  RS
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-title text-[16px] font-semibold text-primary">Ram Singh</span>
                    <span className="material-symbols-outlined text-[16px] text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <p className="font-label text-[13px] text-secondary">Master Potter · Jaipur, Rajasthan</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-surface-container text-secondary border border-outline-variant">
                3rd Gen Craft
              </span>
            </div>
          </section>

          {/* Product Story */}
          <section className="px-space-16 lg:px-0 mt-8">
            <h2 className="font-title text-[18px] font-bold text-primary mb-3">Artisan Story & Process</h2>
            <p className="font-body text-[15px] text-on-surface-variant leading-relaxed">
              Molded entirely by hand on a manual stone potter’s wheel in Jaipur, this urn highlights authentic sun-dried clay burnished with river pebbles. The intricate geometric carvings are etched by hand using bamboo needles while the clay remains leather-hard, creating a natural porous texture that keeps stored contents pleasantly cool.
            </p>
          </section>

          {/* Craft Specifications */}
          <section className="px-space-16 lg:px-0 mt-8 mb-8 lg:mb-0">
            <h2 className="font-title text-[18px] font-bold text-primary mb-4">Craft Specifications</h2>
            <div className="divide-y divide-outline-variant border-y border-outline-variant">
              <div className="py-3 lg:py-4 flex justify-between items-start gap-4">
                <span className="font-body text-[14px] text-secondary shrink-0">Craft Technique</span>
                <span className="font-body-medium text-[14px] text-primary text-right">
                  Traditional Terracotta Carving <br/><span className="text-secondary font-label text-[12px]">(हस्तनिर्मित नक्काशी)</span>
                </span>
              </div>
              <div className="py-3 lg:py-4 flex justify-between items-start gap-4">
                <span className="font-body text-[14px] text-secondary shrink-0">Material</span>
                <span className="font-body-medium text-[14px] text-primary text-right">
                  100% Natural Red Clay <br/><span className="text-secondary font-label text-[12px]">(प्राकृतिक लाल चिकनी मिट्टी)</span>
                </span>
              </div>
              <div className="py-3 lg:py-4 flex justify-between items-center gap-4">
                <span className="font-body text-[14px] text-secondary">Dimensions</span>
                <span className="font-body-medium text-[14px] text-primary text-right">Medium (11" height, 7" diameter)</span>
              </div>
              <div className="py-3 lg:py-4 flex justify-between items-center gap-4">
                <span className="font-body text-[14px] text-secondary">Production Time</span>
                <span className="font-body-medium text-[14px] text-primary text-right">3 days per piece</span>
              </div>
              <div className="py-3 lg:py-4 flex justify-between items-start gap-4">
                <span className="font-body text-[14px] text-secondary shrink-0">Customization</span>
                <span className="font-body-medium text-[14px] text-primary text-right">Custom batch sizes and colors available on request</span>
              </div>
            </div>
          </section>

          {/* Trust Indicators (Mobile Only) */}
          <section className="px-space-16 mt-8 lg:hidden">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-on-tertiary-container">eco</span>
                <div className="flex flex-col">
                  <span className="font-body-medium text-[14px] font-semibold text-primary">100% Natural</span>
                  <span className="font-label-small text-[11px] text-secondary">Zero chemical glaze</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-on-tertiary-container">handshake</span>
                <div className="flex flex-col">
                  <span className="font-body-medium text-[14px] font-semibold text-primary">Direct Artisan</span>
                  <span className="font-label-small text-[11px] text-secondary">Fair compensation</span>
                </div>
              </div>
            </div>
          </section>

          {/* Desktop Direct-To-Artisan Action Block */}
          <section className="hidden lg:flex flex-col gap-4 mt-12 bg-surface-container-low p-6 rounded-xl border border-outline-variant">
            <h3 className="font-title text-[18px] font-bold text-primary">Interested in this piece?</h3>
            <p className="text-[14px] text-secondary">Connect directly with Ram Singh to discuss your requirements, bulk orders, or custom color requests. No middlemen involved.</p>
            <div className="flex items-center gap-4 mt-2">
              <button aria-label="Direct message via WhatsApp or call" className="w-12 h-12 rounded-xl border border-outline flex items-center justify-center text-primary bg-surface hover:bg-surface-container transition-all shrink-0" type="button">
                <span className="material-symbols-outlined text-[22px]">chat</span>
              </button>
              <Link href={`/p/${slug}/inquiry`} className="flex-1 h-12 px-6 rounded-xl bg-primary text-surface font-body-medium text-[16px] font-semibold flex items-center justify-center gap-2 hover:bg-[#303030] active:scale-[0.99] transition-all shadow-md">
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>पूछताछ भेजें / Send Inquiry</span>
              </Link>
            </div>
          </section>

        </div>
      </main>
    </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-outline-variant">
        <div className="max-w-[420px] mx-auto px-space-16 py-3 flex items-center gap-3">
          <button aria-label="Direct message via WhatsApp or call" className="w-12 h-12 rounded-xl border border-outline flex items-center justify-center text-primary bg-surface hover:bg-surface-container-low active:scale-95 transition-all shrink-0" type="button">
            <span className="material-symbols-outlined text-[22px]">chat</span>
          </button>
          <Link href={`/p/${slug}/inquiry`} className="flex-1 h-12 px-space-16 rounded-xl bg-primary text-surface font-body-medium text-[15px] font-semibold flex items-center justify-center gap-2 hover:bg-[#303030] active:scale-[0.98] transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span className="truncate">पूछताछ भेजें / Send Inquiry</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
