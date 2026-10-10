"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations } from "./translations";

const STORAGE_KEY = "craftigari_lang";
const DEFAULT_LANGUAGE = "hi";

export const SUPPORTED_UI_LANGUAGES = [
  { code: "hi", label: "हिन्दी", name: "Hindi" },
  { code: "en", label: "English", name: "English" },
  { code: "bn", label: "বাংলা", name: "Bengali" },
  { code: "as", label: "অসমীয়া", name: "Assamese" },
  { code: "gu", label: "ગુજરાતી", name: "Gujarati" },
  { code: "kn", label: "ಕನ್ನಡ", name: "Kannada" },
  { code: "ml", label: "മലയാളം", name: "Malayalam" },
  { code: "mr", label: "मराठी", name: "Marathi" },
  { code: "or", label: "ଓଡ଼ିଆ", name: "Odia" },
  { code: "pa", label: "ਪੰਜਾਬੀ", name: "Punjabi" },
  { code: "ta", label: "தமிழ்", name: "Tamil" },
  { code: "te", label: "తెలుగు", name: "Telugu" },
  { code: "ur", label: "اردو", name: "Urdu" },
];

const SUPPORTED_LANGUAGE_CODES = new Set(
  SUPPORTED_UI_LANGUAGES.map(({ code }) => code),
);

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (SUPPORTED_LANGUAGE_CODES.has(stored)) setLanguageState(stored);
      } catch {
        // Storage unavailable in private browsing mode
      }
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = useCallback((newLang) => {
    const valid = SUPPORTED_LANGUAGE_CODES.has(newLang)
      ? newLang
      : DEFAULT_LANGUAGE;
    setLanguageState(valid);
    try {
      localStorage.setItem(STORAGE_KEY, valid);
      document.cookie = `${STORAGE_KEY}=${valid}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = valid;
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "hi" ? "en" : "hi");
  }, [language, setLanguage]);

  const t = useCallback(
    (key, fallback = "") => {
      const dict = translations[language] || translations.en;
      return dict[key] ?? fallback ?? key;
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      toggleLanguage,
    }),
    [language, setLanguage, t, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      t: (key, fallback = "") => translations[DEFAULT_LANGUAGE]?.[key] ?? fallback,
      toggleLanguage: () => {},
    };
  }
  return context;
}
