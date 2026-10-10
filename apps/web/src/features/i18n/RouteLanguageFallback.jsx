"use client";

import { usePathname } from "next/navigation";
import { LanguageSelector } from "./LanguageSelector";

function needsFallbackControl(pathname) {
  if (pathname === "/admin/ai-runs") return true;
  if (pathname === "/artisan/products") return true;
  if (/^\/artisan\/products\/(?!new(?:\/|$))/.test(pathname)) return true;
  if (/^\/artisan\/inquiries\/[^/]+\/?$/.test(pathname)) return true;
  if (/^\/artisan\/inquiries\/[^/]+\/quote\/?$/.test(pathname)) return true;
  return /^\/artisan\/quotations\/[^/]+\/?$/.test(pathname);
}

export function RouteLanguageFallback() {
  const pathname = usePathname();
  if (!needsFallbackControl(pathname)) return null;

  return (
    <div className="fixed right-3 top-3 z-[70] rounded-full bg-white/95 shadow-sm backdrop-blur-sm">
      <LanguageSelector compact />
    </div>
  );
}
