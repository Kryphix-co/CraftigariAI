"use client";

import { useParams } from "next/navigation";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerNotFound } from "@/components/buyer/BuyerNotFound";
import { FollowArtisanButton } from "@/components/buyer/FollowArtisanButton";
import { ProductCard } from "@/components/buyer/ProductCard";
import { useCatalogProducts, usePublicArtisan } from "@/hooks/useCatalog";

export default function PublicArtisanProfilePage() {
  const params = useParams();
  const artisanId = String(params.id);
  const { artisan, error, ready } = usePublicArtisan(artisanId);
  const { products } = useCatalogProducts(artisanId);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <BuyerHeader />
        <main className="flex flex-1 items-center justify-center text-[13px] text-secondary">Loading artisan profile…</main>
      </div>
    );
  }
  if (!artisan) {
    return <BuyerNotFound title="Artisan not found" message={error || "This public artisan profile is unavailable."} />;
  }

  const artisanProducts = products;

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-primary antialiased">
      <BuyerHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-surface-muted/30 px-4 py-8 sm:px-6 sm:py-12 lg:px-12">
          <div className="flex max-w-4xl flex-col gap-6 sm:flex-row sm:items-center">
            <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-full border border-border bg-white sm:h-36 sm:w-36">
              {artisan.image ? (
                <img alt={artisan.name} className="h-full w-full object-cover" src={artisan.image} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-tertiary"><span className="material-symbols-outlined text-[38px]">person</span></div>
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">Public artisan profile</span>
              <h1 className="mt-1 break-words text-3xl font-bold tracking-tight text-primary sm:text-4xl">{artisan.name}</h1>
              <p className="mt-2 break-words text-[13px] font-medium text-secondary">{artisan.specialization} · {artisan.location}</p>
              <div className="mt-4"><FollowArtisanButton artisanId={artisan.id} baseFollowerCount={artisan.followerCount} /></div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
          <div className="max-w-3xl">
            <h2 className="text-lg font-bold text-primary">About the artisan</h2>
            <p className="mt-2 break-words text-[14px] leading-relaxed text-secondary">{artisan.introduction}</p>
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <div className="mb-5 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end sm:gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">Current catalog</span>
                <h2 className="mt-1 break-words text-xl font-bold text-primary">Products by {artisan.name}</h2>
              </div>
              <span className="text-[11px] text-secondary">{artisanProducts.length} products</span>
            </div>
            {artisanProducts.length ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {artisanProducts.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="border border-dashed border-border bg-surface-muted/20 px-5 py-12 text-center text-[13px] text-secondary">No published products are available for this artisan.</div>
            )}
          </div>
        </section>
      </main>
      <BuyerFooter />
    </div>
  );
}
