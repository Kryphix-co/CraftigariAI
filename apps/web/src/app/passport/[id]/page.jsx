"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerNotFound } from "@/components/buyer/BuyerNotFound";
import { DigitalCraftPassport } from "@/components/buyer/DigitalCraftPassport";
import { useCatalogProduct } from "@/hooks/useCatalog";
import { usePublicUrl } from "@/hooks/usePublicUrl";
import { getArtisanById } from "@/lib/catalog";

export default function PassportPage() {
  const params = useParams();
  const productId = String(params.id);
  const { error, product, ready } = useCatalogProduct(productId);
  const passportUrl = usePublicUrl(`/passport/${productId}`);

  if (!product && !ready) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <BuyerHeader />
        <main className="flex flex-1 items-center justify-center text-[13px] text-secondary">Loading passport…</main>
      </div>
    );
  }
  if (!product) {
    return <BuyerNotFound title="Craft passport not found" message={error || "No published product matches this passport ID."} />;
  }

  const artisan = product.artisanProfile ?? getArtisanById(product.artisanId);

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted/20 font-sans text-primary antialiased">
      <BuyerHeader />
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <Link className="mb-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-secondary transition-colors hover:text-primary" href={`/products/${product.id}`}>
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to product
          </Link>
          <DigitalCraftPassport artisan={artisan} passportUrl={passportUrl} product={product} />
          <p className="mt-4 text-center text-[11px] text-tertiary">This passport contains catalog or artisan-entered information. It is not an AI certification or independent authenticity claim.</p>
        </div>
      </main>
      <BuyerFooter />
    </div>
  );
}
