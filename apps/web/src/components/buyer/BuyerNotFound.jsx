import Link from "next/link";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";

export function BuyerNotFound({ message, title }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-primary">
      <BuyerHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg border border-dashed border-border bg-surface-muted/30 px-6 py-14 text-center">
          <span className="material-symbols-outlined text-[42px] text-tertiary">search_off</span>
          <h1 className="mt-3 text-2xl font-bold text-primary">{title}</h1>
          <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-secondary">{message}</p>
          <Link className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-[12px] font-semibold text-white transition-colors hover:bg-neutral-800" href="/products">
            Browse products
          </Link>
        </div>
      </main>
      <BuyerFooter />
    </div>
  );
}
