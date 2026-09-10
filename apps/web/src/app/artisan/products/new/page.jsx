import Link from "next/link";

export default function NewProductPhotoPage() {
  return (
    <div className="h-full bg-surface text-on-surface antialiased flex flex-col font-body selection:bg-surface-container-high pb-20 lg:pb-0">
      {/* Top App Bar */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-surface border-b border-outline-variant shrink-0">
        <div className="max-w-[1150px] mx-auto h-14 px-space-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/artisan/dashboard"
              aria-label="वापस जाएं"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <span className="font-title text-[18px] text-on-surface tracking-tight font-semibold lg:hidden">कदम 1 / 4: फ़ोटो लें</span>
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
              aria-label="ऑडियो सहायता सुनें"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-on-surface active:scale-95 transition-all"
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
        <div className="flex flex-col gap-space-16 lg:col-span-5 lg:gap-6">
          <div className="hidden lg:block">
            <h1 className="font-display text-[24px] font-bold text-on-surface tracking-tight mb-2">कदम 1 / 4: फ़ोटो लें</h1>
            <p className="font-body text-[14px] text-on-surface-variant">अपने उत्पाद को कैमरे के सामने रखें और फ़ोटो खींचें।</p>
          </div>

          {/* Dominant Viewfinder Screen */}
          <section className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container border border-outline shadow-sm flex items-center justify-center">
            {/* Live Camera Preview Stream */}
            <img
              className="absolute inset-0 w-full h-full object-cover"
              alt="Live Camera Preview"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTugD0EN3mMtcjo9bga2uHDqdNhioHHWNyXO-yL-VOlo7RTkSkBfvhGSZXuarHPGWiX0RW7xl2XKCs66EGnA9YXDFRBwbkpVYfVUbE0VdX2tiE6aXaRnuGcqFp6Ybv2mTQ4-5SA0s9FHlK4Gkd-59K1gCrVDrOIGUmGjsRXqa1Xb5Mttzwt44uHtoTU5rhnY6mM4RBSA5J26WsK-0Jwc64ugM7ddP86SgFTywAGIoxiO9jOx744bQ"
            />
            
            {/* Reticle Corner Markers */}
            <div className="absolute w-6 h-6 border-white/85 pointer-events-none top-4 left-4 border-t-2 border-l-2"></div>
            <div className="absolute w-6 h-6 border-white/85 pointer-events-none top-4 right-4 border-t-2 border-r-2"></div>
            <div className="absolute w-6 h-6 border-white/85 pointer-events-none bottom-4 left-4 border-b-2 border-l-2"></div>
            <div className="absolute w-6 h-6 border-white/85 pointer-events-none bottom-4 right-4 border-b-2 border-r-2"></div>
            
            {/* Center Crosshair */}
            <div className="absolute w-8 h-8 pointer-events-none opacity-40 flex items-center justify-center">
              <div className="w-full h-[1px] bg-surface"></div>
              <div className="h-full w-[1px] bg-surface absolute"></div>
            </div>

            {/* Top Status Pill */}
            <div className="absolute top-space-12 left-1/2 -translate-x-1/2 z-10">
              <div className="flex items-center gap-space-8 px-space-12 py-1.5 rounded-[9999px] bg-surface/90 backdrop-blur-md border border-outline-variant shadow-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-success ring-4 ring-success/20 animate-pulse"></span>
                <span className="font-label text-[12px] font-semibold text-success">रोशनी सही है</span>
              </div>
            </div>

            {/* Shutter Trigger Overlay */}
            <button
              aria-label="फ़ोटो खींचें"
              className="absolute bottom-space-20 left-1/2 -translate-x-1/2 z-20 w-16 h-16 rounded-full border-2 border-surface flex items-center justify-center bg-surface/20 backdrop-blur-sm active:scale-95 transition-transform hover:bg-surface/30 shadow-md group"
              type="button"
            >
              <div className="w-12 h-12 rounded-full bg-surface shadow-sm group-active:scale-90 transition-transform"></div>
            </button>

            {/* Bottom Guidance Pill */}
            <div className="absolute bottom-space-2 left-1/2 -translate-x-1/2 z-10 w-full max-w-[240px] mb-space-8 pointer-events-none">
              <div className="text-center py-1 px-space-12 rounded-[9999px] bg-surface/85 backdrop-blur-sm border border-outline/50 shadow-sm">
                <p className="font-label-small text-[11px] text-on-surface tracking-wide">सामने रखें (Eye-level)</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column on Desktop / Bottom Section on Mobile */}
        <div className="flex flex-col justify-between mt-space-20 lg:mt-0 lg:col-span-7">
          {/* Photo Angle Status Tray Section */}
          <section className="flex flex-col gap-space-8 lg:mt-[100px]">
            <div className="flex items-center justify-between px-space-2">
              <h2 className="font-body-medium text-[14px] text-on-surface-variant font-medium">
                फ़ोटो के कोण <span className="text-on-surface font-semibold">(1 / 3 पूर्ण)</span>
              </h2>
              <span className="font-label-small text-[11px] text-on-surface-variant bg-surface-container px-space-8 py-0.5 rounded-full border border-outline-variant">
                360° विवरण
              </span>
            </div>

            {/* 3 Structured Angle Cards */}
            <div className="grid grid-cols-3 gap-space-8">
              {/* Angle 1: Front (Captured State) */}
              <div className="relative flex flex-col items-center justify-between p-space-8 rounded-xl border-2 border-on-surface bg-surface shadow-sm transition-all">
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-surface-container-high relative border border-outline-variant">
                  <img
                    className="w-full h-full object-cover"
                    alt="Front Angle Thumbnail"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkPSwPm9jGQpzStzjpOxLWdehtqgyz4T4VtU7ZeXX9SQR0wWRd60TBb4dB6lxOL3NCTpng_b78YBnHA_164Pk7MZ-zZJO5shwzuMYXZdvBwXGcFEXtM4Vweaq6Ammlwcnl0fkDVybwTG0j8XpZUNZ2TWCyDTAO7DkfIi0_-6EWdYv67p_TL_PPWeUwpEveBMsh4dOKA2zIVAvYrjxlNFjqSUqgfgSucH6K55fBsQ_uCfLObXmMgV8"
                  />
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center text-on-primary shadow">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                </div>
                <div className="mt-space-4 text-center">
                  <span className="font-label text-[12px] font-semibold text-on-surface">1. सामने</span>
                </div>
              </div>

              {/* Angle 2: Detail (Active / Next Angle) */}
              <button className="group relative flex flex-col items-center justify-between p-space-8 rounded-xl border border-outline bg-surface-container-low hover:border-on-surface hover:bg-surface transition-all active:scale-98" type="button">
                <div className="w-full aspect-square rounded-lg bg-surface border border-dashed border-outline flex flex-col items-center justify-center gap-1 text-on-surface-variant group-hover:text-on-surface group-hover:border-on-surface transition-colors">
                  <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                  <span className="text-[10px] font-medium text-on-surface-variant group-hover:text-on-surface">क्लिक करें</span>
                </div>
                <div className="mt-space-4 text-center">
                  <span className="font-label text-[12px] font-medium text-on-surface-variant group-hover:text-on-surface">2. नज़दीक</span>
                </div>
              </button>

              {/* Angle 3: Base / Underside (Pending Angle) */}
              <button className="group relative flex flex-col items-center justify-between p-space-8 rounded-xl border border-outline-variant bg-surface-container-low/60 hover:border-outline hover:bg-surface transition-all active:scale-98" type="button">
                <div className="w-full aspect-square rounded-lg bg-surface/60 border border-outline-variant flex flex-col items-center justify-center gap-1 text-secondary">
                  <span className="material-symbols-outlined text-[20px]">layers</span>
                  <span className="text-[10px] text-secondary">बाकी</span>
                </div>
                <div className="mt-space-4 text-center">
                  <span className="font-label text-[12px] font-medium text-secondary">3. निचला तल</span>
                </div>
              </button>
            </div>
          </section>

          {/* Action Section */}
          <div className="flex flex-col gap-space-12 mt-space-20 lg:mt-auto pt-6">
            <Link href="/artisan/products/new/voice" className="w-full h-[52px] rounded-xl bg-primary-container hover:bg-[#303030] text-on-primary font-medium text-[16px] flex items-center justify-center gap-space-8 shadow-sm transition-all active:scale-[0.99] border border-primary-container">
              <span>आगे बढ़ें: बोलकर बताएं</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
            <button className="w-full h-[48px] rounded-xl bg-surface border border-outline text-on-surface font-medium text-[15px] hover:bg-surface-container transition-colors flex items-center justify-center gap-space-8 active:scale-[0.99] shadow-sm" type="button">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">photo_library</span>
              <span>गैलरी से चुनें</span>
            </button>
            <div className="flex items-center justify-center gap-space-4 pt-space-4">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">lock</span>
              <p className="font-label-small text-[11px] text-on-surface-variant text-center">
                सुरक्षित और निजी • क्राफ़्टिगारी एआई द्वारा सहायता प्राप्त
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
