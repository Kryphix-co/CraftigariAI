import Link from "next/link";

export default function NewProductSummaryPage() {
  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-20 lg:pb-0">
      {/* Main Sub-Flow Task Context */}
      <div className="w-full max-w-[1150px] mx-auto min-h-[calc(100vh-56px)] bg-surface flex flex-col justify-between relative lg:border-none">
        
        {/* Top App Bar (Dashboard global navigation integrated) */}
        <header className="sticky top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-space-16 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
          <div className="flex items-center space-x-3">
            <Link
              href="/artisan/products/new/voice"
              aria-label="वापस जाएं"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <span className="font-title text-[15px] text-on-surface tracking-tight font-semibold lg:hidden">कदम 3 / 4: विवरण समीक्षा</span>
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

        {/* Main Content Canvas */}
        <main className="flex-1 px-space-16 pt-space-24 pb-space-32 lg:pb-12 lg:grid lg:grid-cols-12 lg:gap-12 lg:content-center lg:min-h-[calc(100vh-56px)]">
          
          {/* Left Column (Desktop) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="hidden lg:block mb-8">
              <h1 className="font-display text-[24px] font-bold text-on-surface tracking-tight">कदम 3 / 4: विवरण समीक्षा</h1>
              <p className="font-body text-[14px] text-on-surface-variant mt-1">आपकी आवाज़ और फ़ोटो से तैयार सारांश</p>
            </div>

            {/* Screen Context & Single Unified Status State (Mobile) */}
            <section className="mb-space-24 lg:hidden">
              <div className="flex items-center justify-between gap-2 mb-space-8 mt-4">
                <h1 className="font-display text-[22px] font-bold text-on-surface tracking-tight">कारीगरी का विवरण</h1>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E6F4EA] text-success border border-[#CEEAD6]">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-label-small text-[12px] font-semibold tracking-tight">4 तथ्य सत्यापित</span>
                </div>
              </div>
              <p className="font-body text-on-surface-variant text-[14px]">आपकी आवाज़ और फ़ोटो से तैयार सारांश</p>
            </section>

            {/* Artifact AI Visual Thumbnail Preview */}
            <div className="mb-space-24 flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant lg:bg-surface-bright lg:shadow-sm">
              <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden bg-surface-container shrink-0 border border-outline">
                <img
                  className="w-full h-full object-cover"
                  alt="Product Thumbnail"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK-uXRrIta62kK9qabzaO5fcSuyRqeewzqglDF5gYQQKWXMqyJhL8pE0B_ILyCSgKhfZ7WXRSc0HK7XwWklp68zqS03ks5F5cd8BEIwX8m0dopd5PoS0Y9GXLxxLY-cWyjzyeYLglzYGL3OAD4lk7ciHH_--ctQ57hsiT99GVVFoyjFJpRiB2ioIKOqGcd8VJqDQsM8WQ1yon-9UtcLK34g-8PnBzHYOK3f4x55SyIdmU182razxw"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary mb-1">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  <span>AI द्वारा विश्लेषण पूर्ण</span>
                </div>
                <p className="font-title text-[15px] lg:text-[18px] text-on-surface font-semibold truncate">टेराकोटा सजावटी कलश</p>
                <p className="font-body text-[12px] lg:text-[14px] text-on-surface-variant mt-0.5">अपलोड की गई 2 तस्वीरें व 1 वॉयस नोट</p>
              </div>
              <div className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E6F4EA] text-success border border-[#CEEAD6]">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-label-small text-[13px] font-semibold tracking-tight">4 तथ्य सत्यापित</span>
              </div>
            </div>

            {/* Structured Summary Card */}
            <section className="bg-surface rounded-xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-space-24 lg:mb-0 overflow-hidden">
              {/* Row 1: Craft Type */}
              <div className="p-space-16 flex items-center justify-between hover:bg-surface-bright transition-colors group">
                <div className="space-y-0.5 pr-3">
                  <span className="font-label text-on-surface-variant text-[12px]">शिल्प</span>
                  <p className="font-title text-[15px] font-semibold text-on-surface leading-snug">पारंपरिक टेराकोटा नक्काशी</p>
                </div>
                <button aria-label="संपादित करें शिल्प" className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              <div className="h-px bg-outline-variant w-full"></div>
              
              {/* Row 2: Material */}
              <div className="p-space-16 flex items-center justify-between hover:bg-surface-bright transition-colors group">
                <div className="space-y-0.5 pr-3">
                  <span className="font-label text-on-surface-variant text-[12px]">सामग्री</span>
                  <p className="font-title text-[15px] font-semibold text-on-surface leading-snug">प्राकृतिक लाल चिकनी मिट्टी</p>
                </div>
                <button aria-label="संपादित करें सामग्री" className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              <div className="h-px bg-outline-variant w-full"></div>
              
              {/* Row 3: Effort / Time */}
              <div className="p-space-16 flex items-center justify-between hover:bg-surface-bright transition-colors group">
                <div className="space-y-0.5 pr-3">
                  <span className="font-label text-on-surface-variant text-[12px]">समय व मेहनत</span>
                  <p className="font-title text-[15px] font-semibold text-on-surface leading-snug">3 दिन (लगभग 18 घंटे हस्तकला)</p>
                </div>
                <button aria-label="संपादित करें समय व मेहनत" className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              <div className="h-px bg-outline-variant w-full"></div>
              
              {/* Row 4: Colors */}
              <div className="p-space-16 flex items-center justify-between hover:bg-surface-bright transition-colors group">
                <div className="space-y-0.5 pr-3">
                  <span className="font-label text-on-surface-variant text-[12px]">रंग</span>
                  <p className="font-title text-[15px] font-semibold text-on-surface leading-snug">प्राकृतिक गेरुआ व वनस्पति रंग</p>
                </div>
                <button aria-label="संपादित करें रंग" className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
            </section>
          </div>

          {/* Right Column (Desktop) */}
          <div className="lg:col-span-6 lg:mt-[60px] flex flex-col gap-6">
            {/* Genuine Missing Information Section */}
            <section className="rounded-xl border border-[#F9AB00]/50 bg-[#FEF9E7]/60 p-5 lg:p-6 space-y-4 mb-space-24 shadow-sm">
              {/* Attention Badge */}
              <div className="flex items-center gap-2 text-[#B06000]">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <span className="font-label text-[14px] font-semibold text-on-surface">केवल 1 जानकारी शेष: अनुमानित ऊंचाई</span>
              </div>
              <div>
                <label className="block font-title text-[15px] font-semibold text-on-surface mb-3">
                  उत्पाद का आकार चुनें
                </label>
                {/* 3 Clean Selector Tabs */}
                <div aria-label="उत्पाद का आकार" className="flex flex-col sm:grid sm:grid-cols-3 lg:grid-cols-1 lg:gap-3 gap-2" role="radiogroup">
                  <button aria-checked="false" className="h-12 lg:h-14 rounded-lg bg-surface border border-outline flex items-center justify-center lg:justify-start px-4 text-center lg:text-left text-on-surface text-[14px] lg:text-[15px] font-medium hover:border-secondary transition-all active:scale-[0.99]" role="radio" type="button">
                    <span className="hidden lg:inline-block w-4 h-4 rounded-full border border-outline mr-3"></span>
                    छोटा (6–8")
                  </button>
                  <button aria-checked="true" className="h-12 lg:h-14 rounded-lg bg-surface border-2 border-[#1F1F1F] flex items-center justify-center lg:justify-start px-4 text-center lg:text-left text-on-surface text-[14px] lg:text-[15px] font-semibold shadow-sm relative transition-all active:scale-[0.99]" role="radio" type="button">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F1F1F] absolute left-4 lg:hidden"></span>
                    <span className="hidden lg:flex w-4 h-4 rounded-full border-[5px] border-[#1F1F1F] mr-3 items-center justify-center"></span>
                    <span className="ml-2 lg:ml-0">मध्यम (10–12")</span>
                  </button>
                  <button aria-checked="false" className="h-12 lg:h-14 rounded-lg bg-surface border border-outline flex items-center justify-center lg:justify-start px-4 text-center lg:text-left text-on-surface text-[14px] lg:text-[15px] font-medium hover:border-secondary transition-all active:scale-[0.99]" role="radio" type="button">
                    <span className="hidden lg:inline-block w-4 h-4 rounded-full border border-outline mr-3"></span>
                    बड़ा (14"+)
                  </button>
                </div>
              </div>
              
              {/* Audio Alternative Action */}
              <div className="pt-2 flex items-center justify-end">
                <button className="inline-flex items-center gap-1.5 text-[14px] font-medium text-on-surface hover:text-primary px-4 py-2 rounded-lg border border-[#F9AB00]/40 bg-surface/80 hover:bg-surface transition-all shadow-sm" type="button">
                  <span className="material-symbols-outlined text-[20px] text-[#B06000]">mic</span>
                  <span>बोलकर बताएं</span>
                </button>
              </div>
            </section>

            {/* Bottom Sticky CTA Section (Desktop pushed to bottom) */}
            <div className="pt-6 lg:border-t lg:border-outline-variant">
              <Link href="/artisan/products/new/missing-info" className="w-full h-[56px] rounded-[10px] bg-[#1F1F1F] hover:bg-[#303030] active:scale-[0.99] text-white flex items-center justify-center gap-2 transition-all font-body-medium text-[16px] lg:text-[18px] font-medium shadow-md">
                <span>कीमत और सूचीकरण देखें</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
              <p className="text-center text-[12px] lg:text-[13px] text-on-surface-variant mt-3">आप अगले कदम पर अंतिम कीमत निर्धारित कर सकेंगे</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
