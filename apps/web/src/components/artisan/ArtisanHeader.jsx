"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/i18n/LanguageContext";
import { LanguageSelector } from "@/features/i18n/LanguageSelector";

export function ArtisanHeader({ activeTab = "home" }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const router = useRouter();
  const { logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      router.replace("/login");
      router.refresh();
    } catch (requestError) {
      setLogoutError(requestError.message || "Unable to log out.");
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="w-full sticky top-0 left-0 right-0 z-40 bg-surface border-b border-outline-variant px-0 lg:px-12">
      <div className="w-full h-14 flex items-center justify-between px-4 lg:px-0">
        <div className="flex items-center space-x-3">
          <Link
            href="/artisan/dashboard"
            aria-label={t("back", "वापस जाएं")}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <span className="font-headline text-[18px] lg:text-[20px] text-primary tracking-tight font-bold">{t("brandGreeting", "Craftigari नमस्ते")}</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium h-full">
          <Link href="/artisan/dashboard" className={`h-full flex items-center ${activeTab === 'home' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>{t("navHome", "Home")}</Link>
          <Link href="/artisan/orders" className={`h-full flex items-center ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>{t("navOrders", "Orders")}</Link>
          <Link href="/artisan/products/new" className="flex items-center gap-1.5 text-accent-terracotta bg-accent-terracotta-soft px-3 py-1.5 rounded-full hover:bg-tertiary-fixed transition-colors">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
            {t("navAdd", "Add")}
          </Link>
          <Link href="/artisan/inquiries" className={`h-full flex items-center ${activeTab === 'inquiries' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>{t("navInquiries", "Inquiries")}</Link>
          <Link href="/artisan/profile" className={`h-full flex items-center ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>{t("navProfile", "Profile")}</Link>
        </nav>

        <div className="flex items-center space-x-2">
          <span className="sr-only" aria-live="assertive">{logoutError}</span>
          <LanguageSelector compact />
          {/* Audio Guidance */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-on-surface active:scale-95 transition-all" type="button">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">volume_up</span>
          </button>
          <button
            aria-label="Log out"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-on-surface active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoggingOut}
            onClick={handleLogout}
            title={logoutError || "Log out"}
            type="button"
          >
            <span className={`material-symbols-outlined text-[20px] text-on-surface-variant ${isLoggingOut ? "animate-pulse" : ""}`}>logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
