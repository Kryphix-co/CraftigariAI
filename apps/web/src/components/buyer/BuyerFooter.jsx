import Link from "next/link";

export function BuyerFooter() {
  return (
    <footer className="bg-white border-t border-border pt-10 sm:pt-12 pb-6 sm:pb-8 text-primary">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 sm:pb-10 border-b border-border">
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-lg font-bold tracking-tight text-primary">Craftigari</span>
              <span className="text-[9px] sm:text-[10px] text-tertiary uppercase tracking-widest">Handmade Heritage</span>
            </div>
            <p className="text-[11px] sm:text-[12px] text-secondary max-w-sm leading-relaxed mb-4 font-normal">
              Direct infrastructure for authentic Indian craft lineages. Connecting master artisans directly with thoughtful spaces, collectors, and institutions.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-secondary font-mono">
              <span className="">Jaipur</span>
              <span className="hidden sm:inline">·</span>
              <span className="">Khurja</span>
              <span className="hidden sm:inline">·</span>
              <span className="">Bastar</span>
              <span className="hidden sm:inline">·</span>
              <span className="">Kachchh</span>
              <span className="text-forest sm:ml-2 w-full sm:w-auto mt-1 sm:mt-0">● Direct Artisan Remuneration</span>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-[0.15em] mb-2 sm:mb-3">Crafts</h4>
            <ul className="space-y-2 text-[11px] sm:text-[12px] text-secondary">
              <li className=""><Link className="hover:text-primary transition-colors" href="/products">Terracotta & Pottery</Link></li>
              <li className=""><Link className="hover:text-primary transition-colors" href="/products">Handloom Weaves</Link></li>
              <li className=""><Link className="hover:text-primary transition-colors" href="/products">Cast Bell Metal</Link></li>
              <li className=""><Link className="hover:text-primary transition-colors" href="/products">Carved Woodcraft</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-[0.15em] mb-2 sm:mb-3">Navigation</h4>
            <ul className="space-y-2 text-[11px] sm:text-[12px] text-secondary">
              <li className=""><Link className="hover:text-primary transition-colors" href="/products">Explore Catalog</Link></li>
              <li className=""><Link className="hover:text-primary transition-colors" href="/#disciplines">Craft Traditions</Link></li>
              <li className=""><Link className="hover:text-primary transition-colors" href="/#lineage">Artisan Registry</Link></li>
              <li className=""><Link className="hover:text-primary transition-colors" href="/#trade">Custom & Bulk Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-[0.15em] mb-2 sm:mb-3">Provenance</h4>
            <ul className="space-y-2 text-[11px] sm:text-[12px] text-secondary">
              <li className=""><Link className="hover:text-primary transition-colors" href="/#lineage">Voice Dialect Records</Link></li>
              <li className=""><Link className="hover:text-primary transition-colors" href="/#lineage">Fair Floor Charter</Link></li>
              <li className=""><Link className="hover:text-primary transition-colors" href="/#trade">Quality Standards</Link></li>
              <li className=""><Link className="hover:text-primary transition-colors" href="#">Artisan Cluster Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-tertiary">
          <div className="text-center sm:text-left">
            © 2025 Craftigari Technologies. Authentic generational craft provenance platform.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
            <Link className="hover:text-primary transition-colors" href="#">Fair Trade Terms</Link>
            <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
            <Link className="hover:text-primary transition-colors" href="#">Artisan Charter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
