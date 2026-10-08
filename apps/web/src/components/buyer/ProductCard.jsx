import Link from "next/link";

export function ProductCard({ product }) {
  return (
    <Link href="/product" className="group flex flex-col border border-border bg-white hover:border-primary transition-colors">
      <div className="relative aspect-square overflow-hidden bg-surface-muted border-b border-border">
        <img 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          src={product.image} 
        />
        <span className="absolute top-2.5 left-2.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider bg-white/95 px-2 py-0.5 text-primary border border-border">
          Batch #{product.batch}
        </span>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] sm:text-[12px] mb-1.5">
            <span className="font-semibold text-terracotta truncate mr-2">{product.region}</span>
            <span className="text-tertiary font-mono shrink-0">{product.leadTime}</span>
          </div>
          <h3 className="text-[14px] sm:text-[15px] font-bold text-primary tracking-tight group-hover:text-terracotta transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-[12px] sm:text-[13px] text-secondary mt-1 font-normal truncate">
            {product.artisan}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
          <div className="text-[14px] sm:text-[15px] font-bold text-primary">
            ₹{product.price} <span className="text-[11px] sm:text-[12px] font-normal text-tertiary">/ pc</span>
          </div>
          <div className="text-[11px] sm:text-[12px] text-secondary font-mono">
            Min. {product.minQty}
          </div>
        </div>
      </div>
    </Link>
  );
}
