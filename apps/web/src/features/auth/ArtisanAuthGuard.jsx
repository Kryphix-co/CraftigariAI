"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export function ArtisanAuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { error, profileComplete, refreshAuth, status } = useAuth();

  useEffect(() => {
    const search = window.location.search;
    const intendedPath = `${pathname}${search}`;
    if (status === "unauthenticated") {
      router.replace(`/login?next=${encodeURIComponent(intendedPath)}`);
      return;
    }
    if (
      status === "authenticated" &&
      !profileComplete &&
      pathname !== "/artisan/profile"
    ) {
      router.replace(
        `/artisan/profile?onboarding=1&next=${encodeURIComponent(intendedPath)}`,
      );
    }
  }, [pathname, profileComplete, router, status]);

  if (
    status === "authenticated" &&
    (profileComplete || pathname === "/artisan/profile")
  ) {
    return children;
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-4 text-center">
        <div className="w-full max-w-md border border-outline bg-white p-6 shadow-sm">
          <span className="material-symbols-outlined text-[30px] text-terracotta">cloud_off</span>
          <h1 className="mt-3 text-lg font-bold text-primary">Unable to verify your session</h1>
          <p className="mt-2 text-[13px] text-secondary">{error}</p>
          <button className="mt-5 h-11 rounded-lg bg-primary px-5 text-[13px] font-semibold text-white" onClick={() => refreshAuth()} type="button">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface text-secondary">
      <div className="flex items-center gap-2 text-[13px]">
        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        Checking your session…
      </div>
    </div>
  );
}
