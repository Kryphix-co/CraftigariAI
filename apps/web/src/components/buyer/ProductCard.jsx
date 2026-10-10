import Link from "next/link";

export function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.id}`} className="group flex min-w-0 flex-col overflow-hidden border border-border bg-white transition-colors hover:border-primary">
      <div className="relative aspect-square overflow-hidden bg-surface-muted border-b border-border">
        {product.image ? (
          <img
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={product.image}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-tertiary">
            <span className="material-symbols-outlined text-[30px]">image_not_supported</span>
            <span className="px-2 text-center text-[10px]">Image unavailable</span>
          </div>
        )}
        <span className="absolute left-2.5 top-2.5 max-w-[calc(100%-1.25rem)] truncate border border-border bg-white/95 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary sm:text-[11px]">
          Batch #{product.batch}
        </span>
        {product.isSampleProduct && (
          <span className="absolute bottom-2.5 right-2.5 rounded-full border border-border bg-white/95 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-secondary sm:text-[10px]">
            Sample
          </span>
        )}
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] sm:text-[12px] mb-1.5">
            <span className="font-semibold text-terracotta truncate mr-2">{product.region}</span>
            <span className="text-tertiary font-mono shrink-0">{product.leadTime}</span>
          </div>
          <h3 className="line-clamp-2 min-h-10 break-words text-[14px] font-bold leading-snug tracking-tight text-primary transition-colors group-hover:text-terracotta sm:text-[15px]">
            {product.name}
          </h3>
          <p className="text-[12px] sm:text-[13px] text-secondary mt-1 font-normal truncate">
            {product.artisan}
          </p>
        </div>
        <div className="mt-4 flex flex-col items-start gap-1 border-t border-border pt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
          <div className="whitespace-nowrap text-[14px] font-bold text-primary sm:text-[15px]">
            ₹{product.price.toLocaleString("en-IN")} <span className="text-[11px] sm:text-[12px] font-normal text-tertiary">/ pc</span>
          </div>
          <div className="whitespace-nowrap font-mono text-[11px] text-secondary sm:text-[12px]">
            Min. {product.minQty}
          </div>
        </div>
      </div>
    </Link>
  );
}
