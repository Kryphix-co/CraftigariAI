"use client";
import { useState } from "react";

import Link from "next/link";
import { ProductCard } from "@/components/buyer/ProductCard";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";


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

export default function Home() {
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 return (
 <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white">
  <BuyerHeader />

  {/* Main Body */}
  <main className="flex-1 w-full bg-white px-4 lg:px-12">
  {/* 1. Refined Hero Section */}
  <section className="w-full px-4 sm:px-6 lg:px-12 py-6 sm:py-12 lg:py-16">
   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
   {/* Left Editorial Copy */}
   <div className="lg:col-span-6 flex flex-col justify-center">
    <div className="mb-4">
    <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-terracotta">Generational Craft Procurement</span>
    </div>
    <h1 className="text-[28px] sm:text-4xl lg:text-[46px] font-bold text-primary tracking-[-0.03em] leading-tight mb-5">
    Authentic Master Craftsmanship, Directly Sourced.
    </h1>
    <p className="text-secondary text-[15px] leading-relaxed max-w-lg mb-8 font-normal">
    Direct access to generational pottery, handlooms, metalwork, and regional studio crafts. Verified voice provenance and direct fair remuneration straight to artisan clusters across India.
    </p>
    <div className="flex flex-wrap items-center gap-3.5 mb-10">
    <a className="px-6 py-3 bg-primary hover:bg-neutral-800 text-white text-[13px] font-medium tracking-tight transition-all rounded-2xl inline-flex items-center gap-2" href="#inventory">
     <span className="">Explore Catalog</span>
     <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
    </a>
    <a className="px-6 py-3 bg-white border border-border hover:border-primary text-primary text-[13px] font-medium tracking-tight transition-all rounded-2xl inline-flex items-center gap-1.5" href="#trade">
     <span className="">Custom & Bulk Inquiry</span>
     <span className="material-symbols-outlined text-[16px]">east</span>
    </a>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 pt-6 border-t border-border">
    <div>
     <div className="text-[14px] font-bold text-primary tracking-tight">Direct Sourcing</div>
     <div className="text-[11px] text-tertiary tracking-tight mt-0.5 font-normal">Straight from artisan workshops</div>
    </div>
    <div>
     <div className="text-[14px] font-bold text-primary tracking-tight">Voice Provenance</div>
     <div className="text-[11px] text-tertiary tracking-tight mt-0.5 font-normal">Catalogued artisan speech</div>
    </div>
    <div>
     <div className="text-[14px] font-bold text-primary tracking-tight">Fair Compensation</div>
     <div className="text-[11px] text-tertiary tracking-tight mt-0.5 font-normal">Floor-protected pricing</div>
    </div>
    </div>
   </div>
   {/* Right Showcase Frame */}
   <div className="lg:col-span-6">
    <div className="relative overflow-hidden bg-surface-muted border border-border aspect-[4/3] group">
    <img alt="Architectural terracotta master vessels arranged in gallery natural light" className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out" src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200&auto=format&fit=crop" />
    <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-border p-3.5 flex items-center justify-between">
     <div className="flex items-center gap-2.5">
     <span className="w-2 h-2 rounded-full bg-terracotta shrink-0"></span>
     <span className="text-[12px] font-medium text-primary tracking-tight">Master Ram Singh · Amer Workshop, Jaipur</span>
     </div>
     <span className="text-[10px] font-mono text-tertiary uppercase tracking-wider">Batch #2409 Fired</span>
    </div>
    </div>
   </div>
   </div>
  </section>

  {/* 2. Tight, Elegant Disciplines Discovery */}
  <section className="border-y border-border bg-surface-muted/40 py-10" id="disciplines">
   <div className="w-full px-4 sm:px-6 lg:px-12">
   <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 sm:gap-0 mb-7">
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Curated Craft Disciplines</span>
    <span className="text-tertiary text-xs hidden sm:inline">/</span>
    <span className="text-[11px] sm:text-[12px] text-secondary leading-snug">Classified by regional material tradition and guild technique</span>
    </div>
    <a className="text-[12px] font-medium text-secondary hover:text-primary transition-colors inline-flex items-center gap-1" href="#inventory">
    <span className="">View All</span>
    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
    </a>
   </div>
   <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-6 text-center overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    <a className="group flex flex-col items-center min-w-[100px] sm:min-w-0 snap-start" href="#inventory">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-border p-0.5 bg-white group-hover:border-primary transition-all duration-300">
     <img alt="Terracotta & Pottery" className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300" src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop" />
    </div>
    <span className="mt-2.5 text-[12px] font-medium text-primary group-hover:text-terracotta transition-colors leading-tight">Terracotta & Clay</span>
    <span className="text-[10px] text-tertiary font-mono mt-0.5">34 Batches</span>
    </a>
    <a className="group flex flex-col items-center min-w-[100px] sm:min-w-0 snap-start" href="#inventory">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-border p-0.5 bg-white group-hover:border-primary transition-all duration-300">
     <img alt="Handloom Weaves" className="w-full h-full object-cover object-left rounded-full group-hover:scale-105 transition-transform duration-300" src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop" />
    </div>
    <span className="mt-2.5 text-[12px] font-medium text-primary group-hover:text-terracotta transition-colors leading-tight">Handloom Weaves</span>
    <span className="text-[10px] text-tertiary font-mono mt-0.5">28 Clusters</span>
    </a>
    <a className="group flex flex-col items-center min-w-[100px] sm:min-w-0 snap-start" href="#inventory">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-border p-0.5 bg-white group-hover:border-primary transition-all duration-300">
     <img alt="Cast Bell Metal" className="w-full h-full object-cover object-bottom rounded-full group-hover:scale-105 transition-transform duration-300" src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop" />
    </div>
    <span className="mt-2.5 text-[12px] font-medium text-primary group-hover:text-terracotta transition-colors leading-tight">Cast Bell Metal</span>
    <span className="text-[10px] text-tertiary font-mono mt-0.5">16 Guilds</span>
    </a>
    <a className="group flex flex-col items-center min-w-[100px] sm:min-w-0 snap-start" href="#inventory">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-border p-0.5 bg-white group-hover:border-primary transition-all duration-300">
     <img alt="Heritage Woodcraft" className="w-full h-full object-cover object-right rounded-full group-hover:scale-105 transition-transform duration-300" src="https://images.unsplash.com/photo-1549488344-c740b2efd488?q=80&w=600&auto=format&fit=crop" />
    </div>
    <span className="mt-2.5 text-[12px] font-medium text-primary group-hover:text-terracotta transition-colors leading-tight">Carved Woodcraft</span>
    <span className="text-[10px] text-tertiary font-mono mt-0.5">19 Batches</span>
    </a>
    <a className="group flex flex-col items-center min-w-[100px] sm:min-w-0 snap-start" href="#inventory">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-border p-0.5 bg-white group-hover:border-primary transition-all duration-300">
     <img alt="Architectural Stone" className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300" src="https://images.unsplash.com/photo-1558904541-efa843a96f09?q=80&w=600&auto=format&fit=crop" />
    </div>
    <span className="mt-2.5 text-[12px] font-medium text-primary group-hover:text-terracotta transition-colors leading-tight">Stone & Jali</span>
    <span className="text-[10px] text-tertiary font-mono mt-0.5">14 Batches</span>
    </a>
    <a className="group flex flex-col items-center min-w-[100px] sm:min-w-0 snap-start" href="#inventory">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-border p-0.5 bg-white group-hover:border-primary transition-all duration-300">
     <img alt="Studio Stoneware" className="w-full h-full object-cover object-left rounded-full group-hover:scale-105 transition-transform duration-300" src="https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=600&auto=format&fit=crop" />
    </div>
    <span className="mt-2.5 text-[12px] font-medium text-primary group-hover:text-terracotta transition-colors leading-tight">Glazed Ceramics</span>
    <span className="text-[10px] text-tertiary font-mono mt-0.5">22 Batches</span>
    </a>
   </div>
   </div>
  </section>

  {/* 3. Clean Gallery-Style Product Showroom */}
  <section className="w-full px-4 sm:px-6 lg:px-12 py-12 lg:py-18" id="inventory">
   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
   <div className="">
    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta block mb-1">Curated Collection</span>
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Featured Crafts</h2>
   </div>
   <a href="#inventory" className="text-[12px] font-medium text-secondary hover:text-primary transition-colors inline-flex items-center gap-1 shrink-0">
    <span className="">View All</span>
    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
   </a>
   </div>
   {/* 4-Column Grid */}
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {MOCK_PRODUCTS.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
   </div>
  </section>

  {/* 4. Editorial Brand Story & Artisan Lineage */}
  <section className="border-y border-border bg-surface-muted/50 py-14 lg:py-20" id="lineage">
   <div className="w-full px-4 sm:px-6 lg:px-12">
   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
    {/* Editorial Photo */}
    <div className="lg:col-span-6">
    <div className="relative overflow-hidden bg-white border border-border aspect-[4/3]">
     <img alt="Master artisan Ram Singh in his Amer pottery workshop" className="w-full h-full object-cover" src="https://plus.unsplash.com/premium_photo-1679811673471-8677766eb6fb?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
     <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-border px-3 py-1 text-[11px] font-mono text-primary">
     Amer Lineage Protocol #04
     </div>
    </div>
    </div>
    {/* Editorial Philosophy & Quote */}
    <div className="lg:col-span-6 flex flex-col justify-center">
    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta mb-2 block">Voice of the Lineage</span>
    <blockquote className="text-[16px] sm:text-[18px] text-primary font-normal leading-relaxed italic border-l-2 border-primary pl-4 mb-4">
     "यह मिट्टी हमारे पुरखों की तालीम है। पहिए पर जब हाथ रखते हैं, तो मिट्टी खुद बताती है कि उसे घड़ा बनना है या बड़ा मर्तबान। बिचौलियों के बिना, हमारी मेहनत का मान सीधे वास्तुकारों तक पहुँचता है।"
    </blockquote>
    <p className="text-[13px] text-secondary leading-relaxed mb-6 font-normal">
     "This alluvial clay carries generations of knowledge. When hands steady the wheel, the clay dictates its own architectural form. Without intermediate trading margins, our studio's craft reaches designers with uncompromising provenance."
    </p>
    {/* Hairline Spec Grid */}
    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
     <div>
     <div className="text-xl sm:text-2xl font-bold text-primary">22 Yrs</div>
     <div className="text-[11px] text-tertiary uppercase tracking-wider mt-0.5 font-normal">At the Wheel</div>
     </div>
     <div>
     <div className="text-xl sm:text-2xl font-bold text-primary">100%</div>
     <div className="text-[11px] text-tertiary uppercase tracking-wider mt-0.5 font-normal">Alluvial Clay</div>
     </div>
     <div>
     <div className="text-xl sm:text-2xl font-bold text-forest">₹14.2L</div>
     <div className="text-[11px] text-tertiary uppercase tracking-wider mt-0.5 font-normal">Direct Settled</div>
     </div>
    </div>
    </div>
   </div>
   </div>
  </section>

  {/* 5. Bespoke Architectural Trade Consultation */}
  <section className="w-full px-4 sm:px-6 lg:px-12 py-10 lg:py-20" id="trade">
   <div className="border border-border bg-white p-4 sm:p-8 lg:p-12">
   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
    <div className="lg:col-span-7 flex flex-col justify-between">
    <div>
     <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta block mb-2">Institutional & Project Sourcing</span>
     <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-3">
     Bulk & Custom Orders
     </h2>
     <p className="text-secondary text-[14px] leading-relaxed mb-8 font-normal max-w-xl">
     Businesses/institutions can request larger quantities or customized craft orders.
     </p>
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-border">
     <div>
      <div className="text-[11px] font-mono text-tertiary uppercase">01 / Design Translation</div>
      <h4 className="text-[13px] font-bold text-primary mt-0.5">Custom Specifications</h4>
      <p className="text-[12px] text-secondary mt-0.5">Translating project drawings into artisan workshop execution with cluster masters.</p>
     </div>
     <div>
      <div className="text-[11px] font-mono text-tertiary uppercase">02 / Quality & Material</div>
      <h4 className="text-[13px] font-bold text-primary mt-0.5">Natural Mineral Testing</h4>
      <p className="text-[12px] text-secondary mt-0.5">Regional clay, metal alloy, and vegetable dye authenticity verification.</p>
     </div>
     <div>
      <div className="text-[11px] font-mono text-tertiary uppercase">03 / Capacity Planning</div>
      <h4 className="text-[13px] font-bold text-primary mt-0.5">Multi-Guild Allocation</h4>
      <p className="text-[12px] text-secondary mt-0.5">Distributed work allocation across artisan families to fulfill project schedules.</p>
     </div>
     <div>
      <div className="text-[11px] font-mono text-tertiary uppercase">04 / Care & Transit</div>
      <h4 className="text-[13px] font-bold text-primary mt-0.5">Insured Fragile Handling</h4>
      <p className="text-[12px] text-secondary mt-0.5">Reinforced crating and door-to-project delivery coverage nationwide.</p>
     </div>
     </div>
    </div>
    <div className="mt-8 pt-5 border-t border-border flex items-center justify-between text-[12px] text-secondary">
     <span className="">Craftigari Sourcing Catalog & Standards (PDF)</span>
     <button className="font-bold text-primary hover:text-terracotta transition-colors inline-flex items-center gap-1">
     <span className="material-symbols-outlined text-[15px]">download</span>
     <span className="">Download</span>
     </button>
    </div>
    </div>
    <div className="lg:col-span-5 bg-surface-muted p-5 sm:p-6 border border-border rounded-2xl">
    <h3 className="text-[16px] font-bold text-primary tracking-tight">Initiate Project Consultation</h3>
    <p className="text-[12px] text-secondary mt-1 mb-5">Direct consultation response within 24 hours.</p>
    <form className="space-y-3.5" onSubmit={(e) => { e.preventDefault(); alert('Trade consultation logged in Simulated Prototype Mode.'); }}>
     <div>
     <label className="block text-[11px] font-medium text-primary uppercase tracking-wider mb-1">Organization/Name</label>
     <input className="w-full bg-white border border-border px-3 py-2 text-[12px] text-primary focus:border-primary focus:ring-0 placeholder:text-tertiary" placeholder="e.g. Studio Mumbai" type="text" />
     </div>
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2.5">
     <div>
      <label className="block text-[11px] font-medium text-primary uppercase tracking-wider mb-1">Craft Category</label>
      <select className="w-full bg-white border border-border px-3 py-2 text-[12px] text-primary focus:border-primary focus:ring-0">
      <option>Pottery & Planters</option>
      <option>Handloom & Textiles</option>
      <option>Cast Metal Artifacts</option>
      <option>Architectural Stone & Wood</option>
      </select>
     </div>
     <div>
      <label className="block text-[11px] font-medium text-primary uppercase tracking-wider mb-1">Approx. Quantity</label>
      <input className="w-full bg-white border border-border px-3 py-2 text-[12px] text-primary focus:border-primary focus:ring-0 placeholder:text-tertiary" placeholder="e.g. 50 pcs" type="text" />
     </div>
     </div>
     <div>
     <label className="block text-[11px] font-medium text-primary uppercase tracking-wider mb-1">Requirement / Message</label>
     <textarea className="w-full bg-white border border-border px-3 py-2 text-[12px] text-primary focus:border-primary focus:ring-0 placeholder:text-tertiary resize-none" rows="3" placeholder="Describe your custom requirements..."></textarea>
     </div>
     <div>
     <label className="block text-[11px] font-medium text-primary uppercase tracking-wider mb-1">Email / Phone</label>
     <input className="w-full bg-white border border-border px-3 py-2 text-[12px] text-primary focus:border-primary focus:ring-0 placeholder:text-tertiary" placeholder="contact@domain.com / +91..." type="text" />
     </div>
     <button className="w-full py-2.5 bg-primary hover:bg-neutral-800 text-white text-[12px] font-medium tracking-tight transition-all mt-2" type="submit">
     Send Bulk Inquiry
     </button>
     <div className="text-center pt-1">
     <span className="text-[10px] text-tertiary font-mono">Simulated Prototype Environment · No Payment Charged</span>
     </div>
    </form>
    </div>
   </div>
   </div>
  </section>
  </main>

  <BuyerFooter />
 </div>
 );
}
