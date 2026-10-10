"use client";
import Link from "next/link";
import {
  SUPPORTED_UI_LANGUAGES,
  useLanguage,
} from "@/features/i18n/LanguageContext";

export default function WelcomeLanguagePage() {
  const { language: selected, setLanguage, t } = useLanguage();

  return (
    <div className="bg-surface text-on-surface antialiased font-sans min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[560px] bg-white border border-outline p-8 sm:p-12 text-center shadow-sm">
        
        <div className="w-16 h-16 mx-auto mb-6 bg-surface-container rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[32px] text-primary">language</span>
        </div>
        
        <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">{t("welcomeTitle", "Choose your language")}</h1>
        <p className="text-[14px] text-secondary mb-10">{t("welcomeSubtitle", "Choose the language you are comfortable using.")}</p>

        <div className="mb-10 grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
          {SUPPORTED_UI_LANGUAGES.map((option) => (
            <button
              className={`flex w-full items-center justify-between border p-4 text-left transition-colors ${selected === option.code ? "border-primary bg-surface-container-low" : "border-outline hover:border-outline-variant"}`}
              key={option.code}
              onClick={() => setLanguage(option.code)}
              type="button"
            >
              <div className="min-w-0">
                <span className={`block truncate text-[18px] font-bold ${selected === option.code ? "text-primary" : "text-secondary"}`}>{option.label}</span>
                <span className="text-[12px] text-tertiary">{option.name}</span>
              </div>
              {selected === option.code && <span className="material-symbols-outlined text-primary">check_circle</span>}
            </button>
          ))}
        </div>

        <Link href="/login" className="w-full block bg-primary text-white py-4 px-6 text-[16px] font-bold hover:bg-neutral-800 transition-colors text-center">
          {t("continue", "Continue")}
        </Link>
        
      </div>
    </div>
  );
}
