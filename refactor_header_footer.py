import os
import re

def refactor_header_footer():
    # 1. Create BuyerHeader.jsx
    header_content = """"use client";
import { useState } from "react";
import Link from "next/link";

export function BuyerHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Subtle Micro Announcement Bar */}
      <div className="border-b border-border-light bg-surface-muted text-secondary text-[11px] font-normal tracking-wide px-4 sm:px-6 lg:px-12 py-2">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-terracotta shrink-0"></span>
            <span className="text-primary font-medium tracking-tight">Active Kiln Batches: Amer, Khurja & Alwar</span>
            <span className="text-tertiary hidden sm:inline">/</span>
            <span className="text-secondary text-[10px] sm:text-[11px] hidden xl:inline">Direct Artisan Floor Settlement · 0% Spread</span>
          </div>
        </div>
      </div>

      <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border transition-all px-4 lg:px-12">
        <div className="w-full h-16 sm:h-20 flex items-center justify-between gap-4 sm:gap-6">
          <Link className="flex items-baseline gap-2.5 shrink-0" href="/">
            <span className="text-[19px] sm:text-[21px] font-bold tracking-[-0.03em] text-primary">Craftigari</span>
            <span className="text-[10px] tracking-[0.18em] font-medium text-tertiary uppercase hidden sm:inline">Handmade Heritage · Verified Provenance</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-tight font-medium text-secondary">
            <Link className="hover:text-primary transition-colors text-primary" href="/products">Explore</Link>
            <Link className="hover:text-primary transition-colors" href="/#disciplines">Crafts</Link>
            <Link className="hover:text-primary transition-colors" href="/#lineage">Artisans</Link>
            <Link className="hover:text-primary transition-colors" href="/#about">About</Link>
            <Link className="hover:text-primary transition-colors" href="/#trade">Inquire</Link>
          </nav>
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="hidden xl:flex items-center border border-border rounded-full px-3 py-1.5 bg-surface-muted/50 focus-within:bg-white focus-within:border-primary transition-all w-48 lg:w-52">
              <span className="material-symbols-outlined text-tertiary text-[17px] mr-2">search</span>
              <input className="bg-transparent border-none p-0 text-[12px] placeholder:text-tertiary focus:ring-0 w-full text-primary font-normal" placeholder="Search craft..." type="text" />
            </div>
            <Link className="hidden xl:inline-flex text-[12px] font-medium text-secondary hover:text-primary transition-colors px-2 py-1" href="/#trade">
              Trade Portal
            </Link>
            <button className="relative p-2 text-primary hover:text-terracotta transition-colors flex items-center gap-1.5 text-[12px] font-medium" title="Inquiry Bag">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span className="text-[11px] font-mono">0</span>
            </button>
            <Link className="px-4 py-2 bg-primary hover:bg-neutral-800 text-white text-[12px] font-medium tracking-tight rounded-full transition-all hidden sm:inline-flex items-center gap-1.5" href="/#trade">
              <span>Inquire</span>
            </Link>
            <button className="lg:hidden relative p-2 text-primary hover:text-terracotta transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-border shadow-2xl z-40 px-6 py-5 flex flex-col gap-4">
            <Link className="text-[14px] font-medium text-primary hover:text-terracotta transition-colors" href="/products" onClick={() => setIsMobileMenuOpen(false)}>Explore Catalog</Link>
            <Link className="text-[14px] font-medium text-primary hover:text-terracotta transition-colors" href="/#disciplines" onClick={() => setIsMobileMenuOpen(false)}>Craft Traditions</Link>
            <Link className="text-[14px] font-medium text-primary hover:text-terracotta transition-colors" href="/#lineage" onClick={() => setIsMobileMenuOpen(false)}>Artisan Registry</Link>
            <Link className="text-[14px] font-medium text-primary hover:text-terracotta transition-colors" href="/#about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link className="text-[14px] font-medium text-primary hover:text-terracotta transition-colors" href="/#trade" onClick={() => setIsMobileMenuOpen(false)}>Custom & Bulk Orders</Link>
          </div>
        )}
      </header>
    </>
  );
}
"""

    os.makedirs('apps/web/src/components/buyer', exist_ok=True)
    with open('apps/web/src/components/buyer/BuyerHeader.jsx', 'w', encoding='utf-8') as f:
        f.write(header_content)

    # 2. Create BuyerFooter.jsx
    footer_content = """import Link from "next/link";

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
"""
    with open('apps/web/src/components/buyer/BuyerFooter.jsx', 'w', encoding='utf-8') as f:
        f.write(footer_content)

    # 3. Modify page.jsx
    with open('apps/web/src/app/page.jsx', 'r', encoding='utf-8') as f:
        page_content = f.read()

    # We need to extract the inline header and footer
    # Replace from {/* Subtle Micro Announcement Bar */} up to </header>
    header_pattern = r'\{/\* Subtle Micro Announcement Bar \*/\}.*?</header>'
    page_content = re.sub(header_pattern, '<BuyerHeader />', page_content, flags=re.DOTALL)
    
    # Replace from {/* High-End Minimal Luxury Footer */} up to </footer>
    footer_pattern = r'\{/\* High-End Minimal Luxury Footer \*/\}.*?</footer>'
    page_content = re.sub(footer_pattern, '<BuyerFooter />', page_content, flags=re.DOTALL)
    
    # Add imports
    if 'BuyerHeader' not in page_content:
        import_statement = 'import { BuyerHeader } from "@/components/buyer/BuyerHeader";\nimport { BuyerFooter } from "@/components/buyer/BuyerFooter";\n'
        page_content = page_content.replace('import Link from "next/link";', import_statement + 'import Link from "next/link";')
        
    with open('apps/web/src/app/page.jsx', 'w', encoding='utf-8') as f:
        f.write(page_content)

    # 4. Modify product/page.jsx
    with open('apps/web/src/app/product/page.jsx', 'r', encoding='utf-8') as f:
        product_content = f.read()

    product_header_pattern = r'\{/\* Subtle Micro Announcement Bar \*/\}.*?</header>'
    product_content = re.sub(product_header_pattern, '<BuyerHeader />', product_content, flags=re.DOTALL)
    
    product_footer_pattern = r'\{/\* High-End Minimal Luxury Footer \*/\}.*?</footer>'
    product_content = re.sub(product_footer_pattern, '<BuyerFooter />', product_content, flags=re.DOTALL)
    
    if 'BuyerHeader' not in product_content:
        import_statement = 'import { BuyerHeader } from "@/components/buyer/BuyerHeader";\nimport { BuyerFooter } from "@/components/buyer/BuyerFooter";\n'
        product_content = product_content.replace('import Link from "next/link";', import_statement + 'import Link from "next/link";')

    with open('apps/web/src/app/product/page.jsx', 'w', encoding='utf-8') as f:
        f.write(product_content)

refactor_header_footer()
