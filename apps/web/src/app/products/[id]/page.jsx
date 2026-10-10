"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerNotFound } from "@/components/buyer/BuyerNotFound";
import { FollowArtisanButton } from "@/components/buyer/FollowArtisanButton";
import { ProductCard } from "@/components/buyer/ProductCard";
import { QRCodeModal } from "@/components/buyer/QRCodeModal";
import { useCatalogProduct, useCatalogProducts } from "@/hooks/useCatalog";
import { usePublicUrl } from "@/hooks/usePublicUrl";
import { getArtisanById } from "@/lib/catalog";

function ProductImage({ product }) {
  if (!product.image) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-muted text-tertiary">
        <span className="material-symbols-outlined text-[38px]">image_not_supported</span>
        <span className="text-[12px]">Image unavailable in this browser</span>
      </div>
    );
  }
  return <img alt={product.name} className="h-full w-full object-cover" src={product.image} />;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = String(params.id);
  const { error, product, ready } = useCatalogProduct(productId);
  const { products } = useCatalogProducts();
  const [isQrOpen, setIsQrOpen] = useState(false);
  const passportUrl = usePublicUrl(`/passport/${productId}`);

  if (!product && !ready) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <BuyerHeader />
        <main className="flex flex-1 items-center justify-center text-[13px] text-secondary">Loading product…</main>
      </div>
    );
  }
  if (!product) {
    return <BuyerNotFound title="Product not found" message={error || "No published product matches this ID."} />;
  }

  const artisan = product.artisanProfile ?? getArtisanById(product.artisanId);
  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-primary antialiased selection:bg-primary selection:text-white">
      <BuyerHeader />

      <section className="border-b border-border bg-surface-muted/30 px-4 py-3 sm:px-6 lg:px-12">
        <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-secondary">
          <Link className="transition-colors hover:text-primary" href="/products">Products</Link>
          <span className="text-tertiary">/</span>
          <span>{product.category}</span>
          <span className="text-tertiary">/</span>
          <span className="min-w-0 break-words font-medium text-primary">{product.name}</span>
        </div>
      </section>

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="aspect-[4/3] overflow-hidden border border-border bg-surface-muted">
              <ProductImage product={product} />
            </div>

            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {product.images.map((image, index) => (
                  <div className="aspect-square overflow-hidden border border-border bg-surface-muted" key={image}>
                    <img alt={`${product.name}, view ${index + 1}`} className="h-full w-full object-cover" src={image} />
                  </div>
                ))}
              </div>
            )}

            <section className="border border-border bg-white p-5 sm:p-7">
              <h2 className="text-lg font-bold text-primary">About this craft</h2>
              <p className="mt-3 break-words text-[14px] leading-relaxed text-secondary">{product.description}</p>
              <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">Category</dt>
                  <dd className="mt-1 break-words text-[13px] font-semibold text-primary">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">Material</dt>
                  <dd className="mt-1 break-words text-[13px] font-semibold text-primary">{product.material}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">Craft type</dt>
                  <dd className="mt-1 break-words text-[13px] font-semibold text-primary">{product.craftType || product.category}</dd>
                </div>
              </dl>
            </section>

            <section className="border border-border bg-surface-muted/20 p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">Product journey</span>
                  <h2 className="mt-1 text-lg font-bold text-primary">Making Process</h2>
                  <p className="mt-1 text-[12px] text-secondary">See the artisan-entered stages from raw material to finished product.</p>
                </div>
                <Link className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-primary bg-white px-4 text-[12px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white" href={`/passport/${product.id}`}>
                  <span className="material-symbols-outlined text-[17px]">badge</span>
                  View Craft Passport
                </Link>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {(product.makingProcess ?? []).slice(0, 3).map((step, index) => (
                  <div className="border border-border bg-white p-3" key={step.id}>
                    <span className="text-[10px] font-semibold text-terracotta">STEP {index + 1}</span>
                    <h3 className="mt-1 text-[13px] font-bold text-primary">{step.title}</h3>
                  </div>
                ))}
                {!product.makingProcess?.length && (
                  <div className="border border-dashed border-border bg-white p-4 text-[12px] text-secondary sm:col-span-3">
                    Making Process documentation is not available for this product.
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <section className="border border-border bg-white p-5 shadow-sm sm:p-8">
              <div className="border-b border-border pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-terracotta">Batch #{product.batch}</span>
                  {product.isSampleProduct && <span className="rounded-full bg-surface-muted px-2 py-1 text-[10px] font-medium text-secondary">Sample catalog product</span>}
                  {product.isLocalDemo && <span className="rounded-full bg-surface-muted px-2 py-1 text-[10px] font-medium text-secondary">Local browser demo</span>}
                </div>
                <h1 className="mt-3 break-words text-2xl font-bold leading-tight tracking-tight text-primary sm:text-3xl">{product.name}</h1>
                <p className="mt-3 text-[13px] leading-relaxed text-secondary">
                  Handcrafted by{" "}
                  <Link className="font-bold text-primary underline decoration-border underline-offset-4 transition-colors hover:text-terracotta" href={`/artisans/${product.artisanId}`}>
                    {product.artisan}
                  </Link>
                  <br />
                  {artisan?.location ?? product.region}
                </p>
                {artisan && (
                  <div className="mt-4">
                    <FollowArtisanButton artisanId={artisan.id} baseFollowerCount={artisan.followerCount} />
                  </div>
                )}
              </div>

              <div className="my-5 border border-border bg-surface-muted/30 p-4">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                  <div>
                    <span className="text-2xl font-bold text-primary">₹{product.price.toLocaleString("en-IN")}</span>
                    <span className="text-[12px] text-secondary"> / piece</span>
                  </div>
                  <span className="whitespace-nowrap text-[12px] font-semibold text-primary">Min. {product.minQty}</span>
                </div>
                <p className="mt-2 text-[11px] text-secondary">{product.leadTime}</p>
              </div>

              <div className="space-y-3">
                <Link className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-[13px] font-semibold text-white transition-colors hover:bg-neutral-800" href={`/product/inquiry?productId=${encodeURIComponent(product.id)}`}>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Send buyer inquiry
                </Link>
                <Link className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-primary bg-white text-[13px] font-semibold text-primary transition-colors hover:bg-surface-muted" href={`/passport/${product.id}`}>
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  View Craft Passport
                </Link>
                <button className="flex h-11 w-full items-center justify-center gap-2 text-[12px] font-medium text-secondary transition-colors hover:text-primary" onClick={() => setIsQrOpen(true)} type="button">
                  <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                  Show passport QR
                </button>
              </div>
            </section>
          </aside>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-14 border-t border-border pt-8">
            <h2 className="mb-5 text-xl font-bold text-primary">More from this craft</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </section>
        )}
      </main>

      <BuyerFooter />
      <QRCodeModal onClose={() => setIsQrOpen(false)} open={isQrOpen} passportUrl={passportUrl} productName={product.name} />
    </div>
  );
}
