"use client";

import Link from "next/link";

export default function ListingPreviewPage() {
  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-24 lg:pb-0">
      <div className="w-full max-w-[1150px] mx-auto min-h-[calc(100vh-56px)] flex flex-col">
        
        {/* Top App Bar (Dashboard global navigation integrated) */}
        <header className="sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-space-16 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
          <div className="flex items-center space-x-3">
            <Link
              href="/artisan/products/new/pricing"
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
            {/* Mobile Language Switcher Pill */}
            <div className="flex items-center bg-surface-container rounded-full p-0.5 border border-outline text-[11px] font-label font-medium select-none lg:hidden">
              <span className="px-2 py-0.5 rounded-full bg-surface text-primary shadow-xs font-semibold">हिंदी</span>
              <span className="px-2 py-0.5 text-secondary">EN</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-space-16 pt-space-12 pb-space-24 flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 lg:min-h-[calc(100vh-56px)] lg:content-center overflow-y-auto">
          
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
                <img className="w-full h-full object-cover object-center" alt="Product" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOJ2r1YD28garMAAEXsEjAx01DiMoD6fei4oBhjuGlpxqI4s5fdxYgMDG6Ut8RIW4fvlZcZiTa7aIILvc9nFkTzVdnbSewKv1XB7hazzXd52vDX_lvCKo7aASXrLYHsaxyG3yUZJUBnMvgwZrRocfHQTUAblN8XhajtNGl-Ehjo9bx0E54zJO7nte22Gtx7T4Zuxehf3DXED7J-UVrwUFqT6khEFfbmfcTaZPMXzpR2uDLC9jkpPE" />
                <button aria-label="फोटो संपादित करें" className="absolute top-3 right-3 bg-surface/90 hover:bg-surface text-primary rounded-full p-1.5 backdrop-blur-sm border border-outline shadow-sm transition-transform active:scale-95 flex items-center justify-center" type="button">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              {/* Trust Badges */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline text-primary font-label text-[12px] font-medium">
                  <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">palette</span>
                  <span>हस्तनिर्मित शिल्प</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline text-primary font-label text-[12px] font-medium">
                  <span className="material-symbols-outlined text-[16px] text-success" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span>प्रमाणित कारीगर</span>
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
                  पारंपरिक हाथ से तराशा हुआ टेराकोटा कलश (फूलदान)
                </h3>
                <button aria-label="शीर्षक बदलें" className="text-secondary hover:text-primary p-1 transition-colors" type="button">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              <div className="mt-space-12 flex items-baseline justify-between bg-surface-container-low p-space-12 rounded-lg border border-outline-variant">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-[26px] font-bold text-primary tracking-tight">₹1,150</span>
                    <span className="text-secondary line-through font-label text-[12px]">₹1,499</span>
                  </div>
                  <p className="font-label text-[12px] text-success flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                    निःशुल्क डिलीवरी सम्मिलित (अखिल भारतीय)
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 text-primary hover:bg-surface-container px-2.5 py-1 rounded-md font-label text-[12px] font-semibold border border-outline bg-surface transition-all active:scale-95" type="button">
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>बदलें</span>
                </button>
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
                  <p className="font-label-small text-[11px] text-secondary">AI द्वारा स्वचालित रूप से तैयार किया गया ऑडियो</p>
                </div>
              </div>
              <button aria-label="ऑडियो सुनें" className="w-8 h-8 rounded-full bg-surface border border-outline text-primary flex items-center justify-center hover:bg-surface-container-high transition-colors" type="button">
                <span className="material-symbols-outlined text-[18px]">volume_up</span>
              </button>
            </section>

            {/* Structured Product Story & Craft Information */}
            <section className="mt-space-16 space-y-space-16 flex-1">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-title text-[16px] font-bold text-primary flex items-center gap-2">
                  <span>उत्पाद का विवरण</span>
                </h3>
                <button aria-label="विवरण संपादित करें" className="text-secondary hover:text-primary p-1" type="button">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              {/* Description text */}
              <p className="font-body text-[14px] text-on-surface-variant leading-relaxed">
                प्राकृतिक लाल चिकनी मिट्टी से तैयार किया गया यह सजावटी कलश कुशल पारंपरिक कारीगरी का उत्कृष्ट उदाहरण है। प्राकृतिक गेरुआ व वनस्पति रंगों से सुसज्जित, यह आपके घर और बैठक को पारंपरिक भारतीय कला से समृद्ध करता है।
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
                    <span className="font-body-medium text-[14px] text-primary text-right font-medium">पारंपरिक टेराकोटा नक्काशी</span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                    <span className="font-label text-[12px] text-secondary">मुख्य सामग्री</span>
                    <span className="font-body-medium text-[14px] text-primary text-right font-medium">100% प्राकृतिक लाल चिकनी मिट्टी</span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                    <span className="font-label text-[12px] text-secondary">उत्पाद का आकार</span>
                    <span className="font-body-medium text-[14px] text-primary text-right font-medium">मध्यम (ऊंचाई 11", व्यास 7")</span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                    <span className="font-label text-[12px] text-secondary">निर्माण समय</span>
                    <span className="font-body-medium text-[14px] text-primary text-right font-medium">3 दिन (लगभग 18 घंटे)</span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                    <span className="font-label text-[12px] text-secondary">कारीगर व क्षेत्र</span>
                    <div className="text-right">
                      <span className="font-body-medium text-[14px] text-primary font-medium block">मोहन लाल कुम्हार</span>
                      <span className="font-label-small text-[11px] text-secondary flex items-center justify-end gap-0.5 mt-0.5">
                        <span className="material-symbols-outlined text-[13px] text-secondary">location_on</span>
                        अलवर (राजस्थान)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quality Assurance & AI Optimization Notice */}
            <section className="mt-space-16 p-space-12 rounded-lg bg-surface-container-low border border-outline-variant flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] text-primary mt-0.5">auto_awesome</span>
              <div className="text-left">
                <h4 className="font-label text-[12px] font-bold text-primary">Craftigari AI बाज़ार अनुकूलन सक्रिय</h4>
                <p className="font-body text-[12px] text-on-surface-variant mt-0.5 leading-snug">
                  यह लिस्टिंग सर्च, सोशल मीडिया और अंतरराष्ट्रीय खरीदारों के लिए स्वतः कीवर्ड-अनुकूलित कर दी गई है।
                </p>
              </div>
            </section>

            {/* Bottom Docked Actions for Desktop */}
            <div className="hidden lg:flex gap-4 mt-8 pt-6 border-t border-outline-variant">
              <button className="flex-1 h-[52px] bg-surface border border-outline text-[#1f1f1f] hover:bg-surface-container-low active:scale-[0.99] font-body-medium text-[15px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all" type="button">
                <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
                <span>बदलाव करें</span>
              </button>
              <Link href="/artisan/products/new/success" className="flex-1 h-[52px] bg-[#1f1f1f] text-white hover:bg-[#303030] active:scale-[0.99] font-body-medium text-[15px] font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all">
                <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                <span>प्रकाशित करें</span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Docked Actions for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 border-t border-outline-variant p-space-16 z-50 backdrop-blur-md">
        <Link href="/artisan/products/new/success" className="w-full h-[52px] bg-[#1f1f1f] text-white hover:bg-[#303030] active:scale-[0.99] font-body-medium text-[15px] font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all">
          <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
          <span>प्रकाशित करें</span>
        </Link>
        <button className="w-full h-11 mt-2 bg-surface border border-outline text-[#1f1f1f] hover:bg-surface-container-low active:scale-[0.99] font-body-medium text-[14px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all" type="button">
          <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
          <span>बदलाव करें</span>
        </button>
      </div>
    </div>
  );
}
