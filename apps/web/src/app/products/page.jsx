"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/buyer/ProductCard";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";

const CRAFT_CATEGORIES = [
  "All Crafts",
  "Pottery & Ceramics",
  "Textiles & Weaving",
  "Bamboo & Cane",
  "Woodcraft",
  "Metalcraft"
];

const REGIONS = ["All Regions", "Rajasthan", "Assam", "Uttar Pradesh", "Gujarat", "Manipur"];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

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
  },
  {
    id: "p5",
    name: "Brass Decorative Diya Set",
    artisan: "Metalcraft Guild",
    region: "Uttar Pradesh",
    category: "Metalcraft",
    price: 3200,
    minQty: 5,
    leadTime: "30 Days Lead",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    batch: "MB-055",
    featured: true,
  },
  {
    id: "p6",
    name: "Handwoven Cushion Cover",
    artisan: "Kala Raksha",
    region: "Gujarat",
    category: "Textiles & Weaving",
    price: 950,
    minQty: 50,
    leadTime: "25 Days Lead",
    image: "https://images.unsplash.com/photo-1584444533036-7c9886f45cc3?q=80&w=800&auto=format&fit=crop",
    batch: "KC-088",
    featured: false,
  },
  {
    id: "p7",
    name: "Ceramic Tableware Set",
    artisan: "Khurja Master Potters",
    region: "Uttar Pradesh",
    category: "Pottery & Ceramics",
    price: 4500,
    minQty: 10,
    leadTime: "40 Days Lead",
    image: "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=800&auto=format&fit=crop",
    batch: "KJ-312",
    featured: true,
  },
  {
    id: "p8",
    name: "Cane Storage Basket",
    artisan: "Manipur Cane Collective",
    region: "Manipur",
    category: "Bamboo & Cane",
    price: 1600,
    minQty: 15,
    leadTime: "20 Days Lead",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f09?q=80&w=800&auto=format&fit=crop",
    batch: "MN-042",
    featured: false,
  }
];

export default function BuyerCollectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Crafts");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [sortBy, setSortBy] = useState("featured");
  
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.artisan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Crafts" || product.category === selectedCategory;
      const matchesRegion = selectedRegion === "All Regions" || product.region === selectedRegion;
      
      return matchesSearch && matchesCategory && matchesRegion;
    });

    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // featured
      result.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
    }

    return result;
  }, [searchQuery, selectedCategory, selectedRegion, sortBy]);

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />

      <main className="flex-1 w-full flex flex-col bg-white">
        
        {/* Intro Area */}
        <section className="w-full px-4 sm:px-6 lg:px-12 pt-6 sm:pt-14 pb-5 sm:pb-8 border-b border-border">
          <div className="max-w-3xl">
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-terracotta mb-2 sm:mb-3 block">
              Craftigari Collection
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-primary tracking-[-0.03em] leading-[1.12] mb-3 sm:mb-4">
              Explore Indian Craft
            </h1>
            <p className="text-secondary text-[14px] sm:text-[15px] leading-relaxed max-w-xl font-normal mb-5 sm:mb-8">
              Discover handmade products directly from artisans across different crafts and regions. 
              Authentic lineage, verified provenance, and direct sourcing.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md flex items-center border border-border rounded-full px-4 py-2 sm:py-2.5 bg-surface-muted/30 focus-within:bg-white focus-within:border-primary transition-all">
              <span className="material-symbols-outlined text-tertiary text-[18px] sm:text-[20px] mr-2">search</span>
              <input 
                className="bg-transparent border-none p-0 text-[13px] sm:text-[14px] placeholder:text-tertiary focus:ring-0 w-full text-primary font-normal outline-none" 
                placeholder="Search crafts, artisans, or materials..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Categories / Tabs (Horizontal Scroll on Mobile) */}
        <section className="w-full px-4 sm:px-6 lg:px-12 py-2.5 sm:py-4 border-b border-border bg-surface-muted/20">
          <div className="flex items-center gap-2 overflow-x-auto scroll-smooth whitespace-nowrap pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {CRAFT_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors border ${
                  selectedCategory === category 
                    ? "bg-primary text-white border-primary" 
                    : "bg-white text-secondary border-border hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Filter and Sort Bar */}
        <section className="w-full px-4 sm:px-6 lg:px-12 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Region Filter */}
            <div className="relative flex-1 sm:flex-none">
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-white border border-border text-[12px] font-medium text-primary px-3 py-1.5 pr-8 hover:border-primary transition-colors cursor-pointer outline-none"
              >
                {REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[16px] text-tertiary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
            </div>
            
            {/* Results Count */}
            <span className="text-[11px] text-tertiary font-mono hidden sm:inline-block">
              {filteredAndSortedProducts.length} Batches Found
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-[11px] text-tertiary font-mono sm:hidden">
              {filteredAndSortedProducts.length} Results
            </span>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent border-none text-[12px] font-medium text-primary py-1.5 pl-2 pr-6 hover:text-terracotta transition-colors cursor-pointer outline-none text-right"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[16px] text-tertiary absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">sort</span>
            </div>
          </div>
        </section>

        {/* Product Grid Area */}
        <section className="w-full px-4 sm:px-6 lg:px-12 py-8 lg:py-10 flex-1">
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center border border-dashed border-border bg-surface-muted/20">
              <span className="material-symbols-outlined text-[32px] text-tertiary mb-3">inventory_2</span>
              <h3 className="text-[15px] font-bold text-primary mb-1">No crafts found</h3>
              <p className="text-[13px] text-secondary max-w-sm mb-5">
                No artisan batches match your current filters. Try adjusting your category, region, or search terms.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Crafts");
                  setSelectedRegion("All Regions");
                }}
                className="px-5 py-2 bg-white border border-border hover:border-primary text-primary text-[12px] font-medium tracking-tight transition-colors rounded-full"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <BuyerFooter />
    </div>
  );
}
