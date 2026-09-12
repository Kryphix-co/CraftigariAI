"use client";
import { useState } from "react";

import Image from "next/image";
import { ProductCard } from "@/components/buyer/ProductCard";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import Link from "next/link";


const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "Handcrafted Terracotta Planter",
    artisan: "Master Ram Singh",
    region: "Rajasthan",
    category: "Pottery & Ceramics",
    price: 850,
    minQty: 20,
    leadTime: "14 Days Lead",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop",
    batch: "AM-104",
    featured: true,
  },
  {
    id: "p2",
    name: "Indigo Block Print Shawl",
    artisan: "Chhipa Guild",
    region: "Rajasthan",
    category: "Textiles & Weaving",
    price: 2400,
    minQty: 10,
    leadTime: "21 Days Lead",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop",
    batch: "BG-092",
    featured: true,
  },
  {
    id: "p3",
    name: "Handwoven Bamboo Basket",
    artisan: "Bodo Weavers Collective",
    region: "Assam",
    category: "Bamboo & Cane",
    price: 1200,
    minQty: 15,
    leadTime: "10 Days Lead",
    image: "https://images.unsplash.com/photo-1595865886071-7059db9ec227?q=80&w=800&auto=format&fit=crop",
    batch: "AS-014",
    featured: false,
  },
  {
    id: "p4",
    name: "Carved Wooden Serving Tray",
    artisan: "Nizam Artisans",
    region: "Uttar Pradesh",
    category: "Woodcraft",
    price: 1850,
    minQty: 25,
    leadTime: "18 Days Lead",
    image: "https://images.unsplash.com/photo-1549488344-c740b2efd488?q=80&w=800&auto=format&fit=crop",
    batch: "SH-201",
    featured: false,
  }
];

export default function ProductPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const heights = [20, 35, 50, 80, 60, 40, 30, 45, 75, 90, 85, 60, 45, 30, 20, 25, 40, 55, 70, 50, 40, 30, 45, 65, 80, 70, 50, 35, 20, 25];

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white">
      <BuyerHeader />

      {/* Breadcrumb */}
      <section className="border-b border-border bg-surface-muted/30">
        <div className="w-full px-4 sm:px-6 lg:px-12 py-3 flex flex-col gap-3 text-[12px] sm:text-[13px] font-normal">
          <div className="flex flex-wrap items-center gap-1.5 text-secondary">
            <Link className="hover:text-primary transition-colors" href="/">Home</Link>
            <span className="text-tertiary">/</span>
            <Link className="hover:text-primary transition-colors whitespace-nowrap" href="/#inventory">Terracotta & Earthenware</Link>
            <span className="text-tertiary">/</span>
            <span className="text-primary font-medium">Amer High-Fire Terracotta Water Urn</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-forest animate-pulse shrink-0"></span>
            <span className="text-forest whitespace-nowrap">Kiln Batch Active</span>
            <span className="text-tertiary hidden sm:inline">·</span>
            <span className="text-secondary whitespace-nowrap">42 Units Remaining</span>
            <span className="text-tertiary hidden sm:inline">·</span>
            <span className="text-secondary whitespace-nowrap">Amer, Rajasthan</span>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="flex-1 w-full bg-white px-4 lg:px-12">
        <div className="w-full px-4 sm:px-6 lg:px-12 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative bg-surface-muted/30 border border-border overflow-hidden">
                <div className="aspect-[4/3] sm:aspect-video lg:aspect-[4/3] w-full relative">
                  <img alt="Amer High-Fire Terracotta Water Urn on travertine pedestal exhibition plinth" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200&auto=format&fit=crop" />
                </div>
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex flex-col sm:flex-row sm:items-start justify-between bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 border border-border text-[10px] sm:text-[11px] font-medium tracking-tight gap-2">
                  <div className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-terracotta shrink-0">verified</span>
                    <span className="">Authentic Museum Exhibition Specimen #04</span>
                  </div>
                  <div className="flex items-center text-secondary">
                    <span className="">Natural Sunlight / Unretouched Clay Texture</span>
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <button className="relative border-2 border-primary bg-white aspect-square overflow-hidden group">
                  <img alt="Primary angle plinth view" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop" />
                  <span className="absolute bottom-1 right-1 text-[8px] sm:text-[9px] bg-primary text-white px-1 sm:px-1.5 uppercase font-mono">01/04</span>
                </button>
                <button className="relative border border-border hover:border-primary transition-colors bg-white aspect-square overflow-hidden group">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Clay" src="https://images.unsplash.com/photo-1584444533036-7c9886f45cc3?q=80&w=600&auto=format&fit=crop" />
                  <span className="absolute bottom-1 right-1 text-[8px] sm:text-[9px] bg-primary/80 text-white px-1 sm:px-1.5 uppercase font-mono">Clay</span>
                </button>
                <button className="relative border border-border hover:border-primary transition-colors bg-white aspect-square overflow-hidden group">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Wheel" src="https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=600&auto=format&fit=crop" />
                  <span className="absolute bottom-1 right-1 text-[8px] sm:text-[9px] bg-primary/80 text-white px-1 sm:px-1.5 uppercase font-mono">Wheel</span>
                </button>
                <button className="relative border border-border hover:border-primary transition-colors bg-white aspect-square overflow-hidden group">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Seal" src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop" />
                  <span className="absolute bottom-1 right-1 text-[8px] sm:text-[9px] bg-primary/80 text-white px-1 sm:px-1.5 uppercase font-mono">Seal</span>
                </button>
              </div>

              {/* Artisan Voice Note */}
              <div className="p-4 sm:p-6 bg-white border border-border relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px] sm:text-[20px]">graphic_eq</span>
                    </div>
                    <div>
                      <p className="text-[13px] sm:text-[14px] font-semibold text-primary">Artisan Oral Lineage Verification</p>
                      <p className="text-[11px] sm:text-[12px] font-normal text-secondary">Master Ram Singh in Regional Dhundhari (Hindi)</p>
                    </div>
                  </div>
                  <div className="flex items-center self-start sm:self-auto border border-border bg-surface-muted/50 p-1">
                    <button className="px-3 py-1 text-[10px] sm:text-[11px] font-semibold bg-primary text-white shadow-sm transition-colors">Translated</button>
                    <button className="px-3 py-1 text-[10px] sm:text-[11px] text-secondary hover:text-primary transition-colors">मूल बोली</button>
                  </div>
                </div>

                {/* Fixed Voice UI */}
                <div className="py-4 sm:py-5 flex items-center gap-3 sm:gap-4">
                  <button className="w-9 h-9 sm:w-10 sm:h-10 bg-primary text-white flex items-center justify-center hover:bg-neutral-800 transition-all shrink-0 rounded-full">
                    <span className="material-symbols-outlined text-[20px] sm:text-[22px]">play_arrow</span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-end gap-[1px] sm:gap-[2px] h-6 sm:h-8 opacity-80">
                      {heights.map((h, i) => (
                        <div key={i} className="flex-1 bg-terracotta transition-all hover:bg-primary" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between text-[10px] sm:text-[11px] text-tertiary mt-2 font-mono gap-1">
                      <span className="">0:42 / 2:18</span>
                      <span className="tracking-tight truncate">Field Recorded at Amer Kiln #2</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-muted/40 p-4 border border-border">
                  <blockquote className="text-[12px] sm:text-[13px] text-primary italic leading-relaxed">
                    "This batch uses exclusively the lakebed clay harvested after the late winter rains in Amer. We temper the silt with 12% washed quartz sand so the urn retains water cold naturally through evaporation without cracking under 800°C open fire reduction. My father taught this ratio to me fifty winters ago."
                  </blockquote>
                  <p className="text-left sm:text-right text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-terracotta mt-3">— Verified by Field Assessor RJ-09</p>
                </div>
              </div>

              {/* Provenance Card */}
              <div className="border border-border bg-white p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-primary">
                    Cluster Provenance & Origin Ledger
                  </h3>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-forest bg-forest/10 px-2.5 py-1 border border-forest self-start sm:self-auto rounded-full">GI Tag Verified</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 pt-4 sm:pt-5">
                  <div>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-tertiary font-medium">Geographic Origin</p>
                    <p className="text-[12px] sm:text-[13px] font-semibold text-primary mt-1">Amer, Jaipur Dist.</p>
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-tertiary font-medium">Cluster Registry</p>
                    <p className="text-[12px] sm:text-[13px] font-semibold text-primary mt-1">ID #RJ-AM-POT-04</p>
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-tertiary font-medium">Composition</p>
                    <p className="text-[12px] sm:text-[13px] font-semibold text-primary mt-1">100% Non-Toxic</p>
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-tertiary font-medium">Kiln Firing</p>
                    <p className="text-[12px] sm:text-[13px] font-semibold text-primary mt-1">Reduction (36 hrs)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              <div className="border border-border bg-white p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-sm">

                {/* Batch Header */}
                <div className="space-y-2 sm:space-y-3 border-b border-border pb-5 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-terracotta">Batch #AM-104 · Studio Edition 2025</span>
                    <span className="text-[10px] sm:text-[11px] text-tertiary font-mono">Item: URN-AM-01</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tight leading-[1.15]">Amer High-Fire Terracotta Water Urn</h1>
                  <p className="text-[13px] sm:text-[14px] text-secondary leading-relaxed">
                    Handcrafted by <strong className="text-primary font-bold">Master Ram Singh</strong>, 4th Gen Potter.
                    <br className="hidden sm:block" /><span className="inline-block mt-1">Amer Artisan Cluster · <span className="text-terracotta font-semibold">B2B Lead Time: 10–12 Days</span></span>
                  </p>
                </div>

                {/* Price */}
                <div className="space-y-4 bg-surface-muted/30 p-4 sm:p-5 border border-border">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-2">
                    <div>
                      <span className="text-2xl sm:text-3xl font-bold text-primary">₹750</span>
                      <span className="text-[12px] sm:text-[13px] text-secondary font-medium"> / wholesale piece</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[12px] sm:text-[13px] font-bold text-primary">MOQ: 25 pieces</span>
                      <p className="text-[10px] sm:text-[11px] text-tertiary font-mono mt-0.5">Batch Min. Investment: ₹18,750</p>
                    </div>
                  </div>

                  {/* Wage Breakdown */}
                  <div className="pt-4 border-t border-border space-y-2.5">
                    <div className="flex justify-between text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-secondary">
                      <span className="">Living Wage Protocol</span>
                      <span className="text-forest">100% Transparent</span>
                    </div>
                    <div className="w-full h-2 sm:h-2.5 bg-surface-muted flex overflow-hidden rounded-full">
                      <div className="h-full bg-forest" style={{ width: '72%' }} title="72% Direct Artisan Remittance"></div>
                      <div className="h-full bg-terracotta" style={{ width: '18%' }} title="18% Clay, Sand, Firewood Fuel"></div>
                      <div className="h-full bg-neutral-400" style={{ width: '10%' }} title="10% Cluster Logistics & Packaging"></div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[9px] sm:text-[10px] font-medium text-secondary pt-1">
                      <div className="flex items-center"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-forest mr-1.5"></span>72% Master</div>
                      <div className="flex items-center"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-terracotta mr-1.5"></span>18% Materials</div>
                      <div className="flex items-center"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-neutral-400 mr-1.5"></span>10% Freight</div>
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-[12px] sm:text-[13px] font-semibold text-primary mb-2 sm:mb-2.5">Selected Architectural Finish</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-[12px] sm:text-[13px]">
                      <button className="border-2 border-primary bg-white px-3 py-2 text-left flex items-center justify-between font-medium text-primary rounded-xl">
                        <span className="">Traditional Matte</span>
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-primary">check_circle</span>
                      </button>
                      <button className="border rounded-xl border-border hover:border-primary transition-colors bg-white px-3 py-2 text-left text-secondary">
                        <span className="">Raw Bisque</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-surface-muted/30 border border-border text-[12px] sm:text-[13px] space-y-2">
                    <div className="flex justify-between text-secondary pb-2 border-b border-border">
                      <span className="">Vessel Dimensions</span>
                      <span className="font-semibold text-primary">H: 14.5 in · Dia: 11.2 in</span>
                    </div>
                    <div className="flex justify-between text-secondary py-2 border-b border-border">
                      <span className="">Unit Net Weight</span>
                      <span className="font-semibold text-primary">3.8 kg (Dry)</span>
                    </div>
                    <div className="flex justify-between text-secondary pt-2">
                      <span className="">Liquid Capacity</span>
                      <span className="font-semibold text-primary">8.5 Liters</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <label className="text-[12px] sm:text-[13px] font-semibold text-primary whitespace-nowrap">Order Allocation:</label>
                    <div className="flex items-center border border-border bg-white overflow-hidden w-fit">
                      <button className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-muted transition-colors text-lg font-bold border-r border-border">−</button>
                      <input className="w-12 sm:w-14 text-center border-none text-[13px] sm:text-[14px] font-bold text-primary focus:ring-0 p-0" readOnly type="text" value="25" />
                      <button className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-muted transition-colors text-lg font-bold border-l border-border">+</button>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-tertiary">Units (Batch increments of 5)</span>
                  </div>
                  <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3">
                    <Link href="/artisan/inquiries/demo" className="w-full bg-primary text-white py-3 sm:py-3.5 px-4 sm:px-6 text-[13px] sm:text-[14px] font-bold tracking-tight hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 rounded-full">
                      <span className="material-symbols-outlined text-[18px] sm:text-[20px]">assignment</span>
                      <span className="">Request Batch Allocation / Inquire</span>
                    </Link>
                    <button className="w-full border border-border bg-white text-primary py-3 px-4 sm:px-6 text-[12px] sm:text-[13px] font-semibold hover:border-primary transition-colors flex items-center justify-center gap-2 rounded-full">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px]">download</span>
                      <span className="hidden sm:inline">Download 3D CAD & Spec Sheet (.PDF)</span>
                      <span className="sm:hidden">CAD & Spec Sheet</span>
                    </button>
                  </div>
                  <div className="p-3 sm:p-4 bg-forest/5 border border-forest flex items-start gap-2 sm:gap-3">
                    <span className="material-symbols-outlined text-forest text-[18px] sm:text-[20px] shrink-0 mt-0.5">verified_user</span>
                    <p className="text-[11px] sm:text-[12px] text-primary leading-relaxed">
                      <strong className="text-forest">Fair Living Wage Protocol:</strong> 100% of the artisan component (₹540 per unit) is directly wired to Master Ram Singh's cluster account with zero middleman commissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dossier Section */}
        <section className="border-t border-border bg-surface-muted/30 py-12 sm:py-16 lg:py-20">
          <div className="w-full px-4 sm:px-6 lg:px-12">
            <div className="max-w-2xl mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary tracking-tight">Architectural & Technical Dossier</h2>
              <p className="text-[13px] sm:text-[15px] text-secondary mt-2 sm:mt-3 leading-relaxed">Rigorous material purity standards for hospitality, architectural installations, and heritage landscape spaces.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { n: '01', t: 'Composition', h: 'Material & Clay Composition', p: 'Primary alluvial lake-bed terracotta enriched with naturally occurring iron oxides. Blended with washed quartz river silt temper. Burnished with raw mustard seed vegetable oil prior to kiln loading.', l: ['Silica ratio: 54.2%', 'Alumina ratio: 21.8%', '100% Heavy Metal Free'] },
                { n: '02', t: 'Thermal Cycle', h: 'Kiln & Firing Process', p: 'Fired in community wood-and-husk reduction updraft kilns over 22 hours, attaining a peak heat plateau of 820°C. Controlled natural cooling cycle spans 36 uninterrupted hours to prevent micro-fracturing.', l: ['Fuel: Agricultural mustard husk', 'Firing atmosphere: Reduction', 'Thermal stability: High'] },
                { n: '03', t: 'Maintenance', h: 'Architectural & Interior Care', p: 'Suitable for internal corridors, sheltered courtyards, and covered veranda installation. Wash with clean soft water and natural bristles. Avoid chemical detergents or acidic cleaning agents.', l: ['Natural breathability: Yes', 'Porosity: Semi-permeable', 'Weather rating: Covered outdoor'] },
                { n: '04', t: 'B2B Freight', h: 'Logistics & B2B Crating', p: 'Molded shock-absorbing recycled honeycomb pulp internal casing. Bundled into ISPM-15 heat-treated pinewood transport crates on standardized pallets for national and air-freight export.', l: ['Breakage Insurance: 100% Covered', 'Pallet dimensions: 120 x 100 cm', 'Batch dispatch: Tracked GPS'] }
              ].map((spec, i) => (
                <div key={i} className="border border-border bg-white p-5 sm:p-6 space-y-3 sm:space-y-4 hover:border-primary transition-colors shadow-sm">
                  <span className="text-primary font-bold text-[9px] sm:text-[10px] uppercase tracking-widest block">{(spec.n)} / {spec.t}</span>
                  <h3 className="text-[14px] sm:text-[16px] font-bold text-primary">{spec.h}</h3>
                  <p className="text-[12px] sm:text-[13px] text-secondary leading-relaxed">{spec.p}</p>
                  <ul className="text-[11px] sm:text-[12px] space-y-1.5 text-tertiary pt-3 border-t border-border font-medium">
                    {spec.l.map((l, j) => <li key={j}>• {l}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sister Batches Section */}
        <section className="py-12 sm:py-16 lg:py-20 border-t border-border bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-10">
              <div>
                <span className="text-terracotta font-bold text-[10px] sm:text-[11px] uppercase tracking-widest block mb-1.5 sm:mb-2">Coordinated Procurement</span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary tracking-tight">Curated Sister Batches</h2>
              </div>
              <Link className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-secondary hover:text-primary transition-colors w-fit" href="/#inventory">
                <span className="">Explore All 14 Craft Clusters</span>
                <span className="material-symbols-outlined text-[14px] sm:text-[16px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {MOCK_PRODUCTS.slice(0, 3).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Custom Commission Banner */}
        <section className="border-t border-border bg-surface-muted/50 py-12 sm:py-16 lg:py-24">
          <div className="w-full px-4 sm:px-6 lg:px-12">
            <div className="border border-border bg-white p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-10 shadow-sm">
              <div className="space-y-3 sm:space-y-4 max-w-2xl">
                <span className="text-terracotta font-bold text-[10px] sm:text-[11px] uppercase tracking-widest block">Architectural Procurement Desk</span>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tight leading-[1.2] sm:leading-[1.15]">Need Bespoke Vessel Dimensions for Your Hospitality Project?</h2>
                <p className="text-[13px] sm:text-[15px] text-secondary leading-relaxed pt-1 sm:pt-2">
                  We coordinate custom sizing, proprietary surface glazes, and private label batch production directly with Master Ram Singh’s Amer guild. Guaranteed line-item traceability and lead-time guarantees.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0 w-full lg:w-auto mt-2 lg:mt-0">
                <button className="w-full sm:w-auto bg-primary text-white px-5 sm:px-8 py-3 sm:py-4 text-[13px] sm:text-[14px] font-bold hover:bg-neutral-800 transition-colors rounded-2xl text-center">
                  Connect with Cluster Officer
                </button>
                <button className="w-full sm:w-auto border border-border bg-white text-primary px-5 sm:px-8 py-3 sm:py-4 text-[13px] sm:text-[14px] font-bold hover:border-primary transition-colors rounded-2xl text-center">
                  Order Swatch Box (₹1,500)
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <BuyerFooter />
    </div>
  );
}
