import Link from "next/link";

export default function NewProductVoicePage() {
  return (
    <div className="h-full bg-surface text-on-surface antialiased flex flex-col font-body selection:bg-surface-container-high pb-20 lg:pb-0">
      {/* Top App Bar (Dashboard global navigation integrated) */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-surface border-b border-outline-variant shrink-0">
        <div className="max-w-[1150px] mx-auto h-14 px-space-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/artisan/products/new"
              aria-label="वापस जाएं"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <span className="font-title text-[18px] text-on-surface tracking-tight font-semibold lg:hidden">कदम 2 / 4: बोलकर बताएं</span>
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
              title="ध्वनि निर्देश सुनें"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant lg:text-on-surface">volume_up</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 w-full max-w-[1150px] mx-auto px-space-16 pt-space-12 pb-space-24 lg:pb-12 flex flex-col justify-between lg:grid lg:grid-cols-12 lg:gap-12 lg:min-h-[calc(100vh-56px)] lg:content-center overflow-y-auto">
        
        {/* Left Column on Desktop / Top Section on Mobile */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Progress Bar (Mobile only) */}
          <div className="w-full grid grid-cols-4 gap-1.5 py-space-2 lg:hidden">
            <div className="h-1 rounded-full bg-[#1F1F1F]"></div>
            <div className="h-1 rounded-full bg-[#1F1F1F]"></div>
            <div className="h-1 rounded-full bg-[#E8EAED]"></div>
            <div className="h-1 rounded-full bg-[#E8EAED]"></div>
          </div>

          <div className="hidden lg:block">
            <h1 className="font-display text-[24px] font-bold text-on-surface tracking-tight mb-2">कदम 2 / 4: बोलकर बताएं</h1>
          </div>

          {/* Small Quiet Product Context Row */}
          <div className="flex items-center justify-between px-space-12 py-space-8 rounded-xl bg-surface-bright border border-outline-variant lg:-mx-2">
            <div className="flex items-center gap-space-12">
              <img
                alt="मिट्टी का फूलदान"
                className="w-10 h-10 rounded-lg object-cover bg-surface-container border border-outline-variant flex-shrink-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuARjRmCIpZdZBNjnPSNStvY433ZIo4wu85OobF9wQEnJlXQPcXAETtKZrSADS6gYMH03un5FAvXTqnpn4rwadXTX3jJW944EAIiGhmglhkP4eTHpZLKYs25-xCChuLZ9di-wcwSB_0AGp6c5Wcai5oMXiYszLuNdR8Shmxp8uFVIbRLfxKycaLXNP76nuwR7dag-BH3i7femmqTxPFwkaqpyyoJc60ByO8506SGuSPObYddkOkPyx8"
              />
              <div className="flex flex-col">
                <span className="font-title text-[14px] text-on-surface leading-tight font-medium">मिट्टी का फूलदान</span>
                <span className="font-label text-label-small text-[#5F6368] mt-0.5">शिल्प पहचान क्र. #284</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-space-8 py-1 rounded-full bg-surface-container-low border border-outline-variant">
              <span className="w-2 h-2 rounded-full bg-[#137333]"></span>
              <span className="font-label text-[11px] font-semibold text-[#137333]">तस्वीर सुरक्षित</span>
            </div>
          </div>

          {/* Large Heading & Helper Line */}
          <div className="mt-4">
            <h1 className="text-[23px] leading-[32px] font-bold text-[#1F1F1F] tracking-tight">
              अपने उत्पाद के बारे में बताएं
            </h1>
            <p className="text-[14px] text-[#5F6368] mt-1 leading-normal">
              जैसे आप किसी ग्राहक को समझा रहे हों
            </p>
          </div>

          {/* Microphone & Live Audio State */}
          <div className="flex flex-col items-center justify-center mt-7 mb-6 bg-surface-container-low py-10 rounded-2xl border border-dashed border-outline-variant lg:bg-transparent lg:border-none lg:py-4">
            {/* 72px Circular Charcoal Mic Button */}
            <button
              aria-label="ध्वनि रिकॉर्डिंग रोकें या चालू करें"
              className="w-[72px] h-[72px] rounded-full bg-[#1F1F1F] text-white flex items-center justify-center shadow-md hover:bg-[#2D3135] active:scale-95 transition-all focus:outline-none"
              type="button"
              style={{ minWidth: '72px', minHeight: '72px', aspectRatio: '1 / 1' }}
            >
              <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
            </button>

            {/* Status Row */}
            <div className="flex items-center gap-2 mt-[14px]">
              <span className="w-2 h-2 rounded-full bg-[#137333] animate-pulse"></span>
              <span className="text-[14px] font-medium text-[#1F1F1F]">सुन रहे हैं</span>
              <span className="text-[13px] text-[#5F6368] font-normal ml-0.5">00:28</span>
            </div>

            {/* Live Waveform */}
            <div className="w-full max-w-[320px] h-[24px] flex items-center justify-center mt-3.5 opacity-75">
              <svg className="w-full h-full" fill="none" viewBox="0 0 320 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M 4 12 C 16 7, 24 17, 36 12 C 48 7, 56 17, 68 12 C 80 5, 92 19, 104 12 C 116 5, 128 19, 140 12 C 152 4, 164 20, 176 12 C 188 4, 200 20, 212 12 C 224 6, 236 18, 248 12 C 260 6, 272 18, 284 12 C 296 8, 308 16, 316 12" stroke="#e08d72" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.85"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column on Desktop / Bottom Section on Mobile */}
        <div className="flex flex-col gap-8 mt-space-20 lg:mt-[60px] lg:col-span-7">
          <div>
            {/* Live Transcript Section */}
            <div className="w-full mt-1 bg-surface-bright p-5 rounded-xl border border-outline-variant shadow-sm lg:p-6 lg:text-lg">
              <div className="text-[13px] font-semibold uppercase tracking-wider text-[#5F6368] mb-2.5">
                आपने कहा
              </div>
              <p className="text-[16px] lg:text-[18px] leading-relaxed text-[#202124] font-normal">
                “यह लाल मिट्टी का हाथ से तराशा हुआ फूलदान है, प्राकृतिक रंगों से रंगा है और इसे बनाने में मुझे ३ दिन लगे।”
                <span className="inline-block w-0.5 h-4 lg:h-5 ml-1 -mb-0.5 bg-[#1F1F1F] animate-pulse"></span>
              </p>
            </div>

            {/* Identified Facts Row */}
            <div className="w-full mt-8">
              <div className="text-[12px] font-medium text-[#5F6368] mb-2">
                पहचानी गई जानकारी
              </div>
              <div className="flex items-center flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-[#FEF9E7] text-[#B06000] border border-[#F9AB00]/40 rounded-full text-[13px] font-medium shadow-sm">लाल मिट्टी</span>
                <span className="px-3 py-1.5 bg-[#FEF9E7] text-[#B06000] border border-[#F9AB00]/40 rounded-full text-[13px] font-medium shadow-sm">प्राकृतिक रंग</span>
                <span className="px-3 py-1.5 bg-[#FEF9E7] text-[#B06000] border border-[#F9AB00]/40 rounded-full text-[13px] font-medium shadow-sm">लगभग 3 दिन</span>
              </div>
            </div>
          </div>

          {/* BOTTOM ACTION GROUP: Primary CTA & Quiet Reset Option */}
          <div className="w-full flex flex-col items-center pt-8">
            <Link href="/artisan/products/new/summary" className="w-full h-[52px] rounded-xl bg-[#1F1F1F] text-white font-semibold text-[16px] flex items-center justify-center gap-2 hover:bg-[#303030] active:scale-[0.99] transition-all focus:outline-none shadow-md">
              <span>आगे बढ़ें</span>
              <span className="text-[18px]">→</span>
            </Link>
            <button className="mt-3.5 py-1.5 px-4 text-[#5F6368] hover:text-[#1F1F1F] text-[13.5px] font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none" type="button">
              <span className="text-[15px]">⟲</span>
              <span>फिर से रिकॉर्ड करें</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
