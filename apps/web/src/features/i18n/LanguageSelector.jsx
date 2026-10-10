"use client";

import {
  SUPPORTED_UI_LANGUAGES,
  useLanguage,
} from "./LanguageContext";

export function LanguageSelector({ className = "", compact = false }) {
  const { language, setLanguage } = useLanguage();

  return (
    <label className={`relative inline-flex min-w-0 items-center ${className}`}>
      <span className="sr-only">Choose language</span>
      <span className="material-symbols-outlined pointer-events-none absolute left-2.5 text-[16px] text-secondary">
        language
      </span>
      <select
        aria-label="Choose language"
        className={`h-8 appearance-none rounded-full border border-outline bg-surface-container pl-8 pr-6 font-medium text-on-surface outline-none transition-colors hover:border-primary focus:border-primary ${compact ? "max-w-[90px] text-[10px] sm:max-w-[132px] sm:text-[11px]" : "max-w-[160px] text-[12px]"}`}
        onChange={(event) => setLanguage(event.target.value)}
        value={language}
      >
        {SUPPORTED_UI_LANGUAGES.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label} · {option.name}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined pointer-events-none absolute right-2 text-[15px] text-secondary">
        expand_more
      </span>
    </label>
  );
}
