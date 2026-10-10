"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/buyer/ProductCard";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { CRAFT_CATEGORIES, REGIONS } from "@/lib/catalog";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function BuyerCollectionPage() {
  const { error, products, ready } = useCatalogProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Crafts");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [sortBy, setSortBy] = useState("featured");
  
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.material?.toLowerCase().includes(searchQuery.toLowerCase());
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
  }, [products, searchQuery, selectedCategory, selectedRegion, sortBy]);
  const categoryOptions = useMemo(
    () => [
      ...CRAFT_CATEGORIES,
      ...products
        .map((product) => product.category)
        .filter(
          (category, index, values) =>
            category &&
            !CRAFT_CATEGORIES.includes(category) &&
            values.indexOf(category) === index,
        ),
    ],
    [products],
  );
  const regionOptions = useMemo(
    () => [
      ...REGIONS,
      ...products
        .map((product) => product.region)
        .filter(
          (region, index, values) =>
            region && !REGIONS.includes(region) && values.indexOf(region) === index,
        ),
    ],
    [products],
  );

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
            {categoryOptions.map(category => (
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
                {regionOptions.map(region => (
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
          {error && products.length > 0 && (
            <p className="mb-4 border border-amber-200 bg-amber-50 px-4 py-2 text-[12px] text-amber-800" role="status">
              {error}
            </p>
          )}
          {!ready ? (
            <div className="w-full py-20 text-center text-[13px] text-secondary">Loading published crafts…</div>
          ) : error && products.length === 0 ? (
            <div className="w-full border border-dashed border-border bg-surface-muted/20 px-5 py-16 text-center">
              <h3 className="text-[15px] font-bold text-primary">Marketplace unavailable</h3>
              <p className="mx-auto mt-2 max-w-md text-[13px] text-secondary">{error}</p>
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
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
