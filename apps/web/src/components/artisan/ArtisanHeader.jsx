import Link from "next/link";

export function ArtisanHeader({ activeTab = "home" }) {
  return (
    <header className="w-full sticky top-0 left-0 right-0 z-40 bg-surface border-b border-outline-variant px-0 lg:px-12">
      <div className="w-full h-14 flex items-center justify-between px-4 lg:px-0">
        <div className="flex items-center space-x-3">
          <Link
            href="/artisan/dashboard"
            aria-label="वापस जाएं"
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <span className="font-headline text-[18px] lg:text-[20px] text-primary tracking-tight font-bold">Craftigari नमस्ते</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium h-full">
          <Link href="/artisan/dashboard" className={`h-full flex items-center ${activeTab === 'home' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>Home</Link>
          <Link href="/artisan/orders" className={`h-full flex items-center ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>Orders</Link>
          <Link href="/artisan/products/new" className="flex items-center gap-1.5 text-accent-terracotta bg-accent-terracotta-soft px-3 py-1.5 rounded-full hover:bg-tertiary-fixed transition-colors">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
            Add
          </Link>
          <Link href="/artisan/inquiries" className={`h-full flex items-center ${activeTab === 'inquiries' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>Inquiries</Link>
          <Link href="/artisan/profile" className={`h-full flex items-center ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>Profile</Link>
        </nav>

        <div className="flex items-center space-x-2">
          {/* Language Switcher Pill */}
          <button className="h-8 px-2.5 rounded-full border border-outline bg-surface-container text-on-surface font-label text-[12px] hover:bg-surface-container-high active:scale-95 transition-all flex items-center gap-1" type="button">
            <span>हिंदी</span>
            <span className="text-on-surface-variant font-normal">/ EN</span>
          </button>
          {/* Audio Guidance */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-on-surface active:scale-95 transition-all" type="button">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">volume_up</span>
          </button>
        </div>
      </div>
    </header>
  );
}
