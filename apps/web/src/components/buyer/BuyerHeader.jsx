"use client";
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
            <Link className="hidden xl:inline-flex text-[12px] font-medium text-secondary hover:text-primary transition-colors px-2 py-1" href="/welcome">
              Login
            </Link>
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
            <div className="border-t border-border mt-2 pt-4">
              <Link className="text-[14px] font-bold text-primary hover:text-terracotta transition-colors" href="/welcome" onClick={() => setIsMobileMenuOpen(false)}>Artisan Login</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
