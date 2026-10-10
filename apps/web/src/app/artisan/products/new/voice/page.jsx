"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useLanguage } from "@/features/i18n/LanguageContext";
import { LanguageSelector } from "@/features/i18n/LanguageSelector";
import { useProductDraft } from "@/features/product/ProductDraftContext";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { apiUpload } from "@/lib/api";

function formatDuration(duration) {
  const minutes = Math.floor(duration / 60).toString().padStart(2, "0");
  const seconds = (duration % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function NewProductVoicePage() {
  const { language: uiLang, t } = useLanguage();
  const {
    clearVoice,
    draft,
    photos,
    setVoiceFile,
    updateDraft,
    voice,
  } = useProductDraft();

  const [speechLanguage, setSpeechLanguage] = useState(draft.aiLanguage || "hi");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState("");
  const [transcriptionStatus, setTranscriptionStatus] = useState("");

  const handleTranscribe = useCallback(
    async (file, lang) => {
      if (!file) return;
      setIsTranscribing(true);
      setTranscriptionError("");
      setTranscriptionStatus("");

      try {
        const formData = new FormData();
        formData.append("audio", file);
        formData.append("language", lang);

        const data = await apiUpload("/api/ai/voice-transcription", formData);
        if (data?.transcript) {
          updateDraft({
            transcript: data.transcript,
            aiLanguage: lang,
          });
          setTranscriptionStatus(t("voiceTranscribeSuccess", "प्रतिलिपि सुरक्षित"));
        } else {
          setTranscriptionError(
            uiLang === "hi"
              ? "Sarvam को रिकॉर्डिंग में स्पष्ट आवाज़ नहीं मिली। माइक्रोफ़ोन जांचकर फिर से बोलें।"
              : "Sarvam could not detect clear speech. Check your microphone and record again.",
          );
        }
      } catch (err) {
        let msg = t("voiceTranscribeFailed", "स्वचालित प्रतिलिपि उपलब्ध नहीं है। आप नीचे लिख सकते हैं।");
        if (err?.code === "BHASHINI_NOT_CONFIGURED" || err?.code === "SARVAM_NOT_CONFIGURED") {
          msg = uiLang === "hi"
            ? "ध्वनि पहचान सेवा अभी कॉन्फ़िगर नहीं है। आप विवरण नीचे सीधे लिख सकते हैं।"
            : "Voice transcription service is not configured. You can type your description below.";
        } else if (err?.message) {
          msg = `${err.message}. ${uiLang === "hi" ? "आप नीचे सीधे लिख सकते हैं।" : "You can type below."}`;
        }
        setTranscriptionError(msg);
      } finally {
        setIsTranscribing(false);
      }
    },
    [t, uiLang, updateDraft],
  );

  const handleRecorded = useCallback(
    (file) => {
      setVoiceFile(file);
      handleTranscribe(file, speechLanguage);
    },
    [handleTranscribe, setVoiceFile, speechLanguage],
  );

  const {
    cancelRecording,
    duration,
    error: recorderError,
    isRecording,
    toggleRecording,
  } = useVoiceRecorder({ onRecorded: handleRecorded });

  const productTitle = draft.summary.title || (uiLang === "hi" ? "नया उत्पाद" : "New Craft");
  const productImage = photos[0]?.url ?? "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop";

  const resetRecording = () => {
    if (isRecording) cancelRecording();
    clearVoice();
    setTranscriptionError("");
    setTranscriptionStatus("");
  };

  const handleLanguageChange = (newLang) => {
    setSpeechLanguage(newLang);
    updateDraft({ aiLanguage: newLang });
    if (voice?.file && !isRecording && !isTranscribing) {
      handleTranscribe(voice.file, newLang);
    }
  };

  return (
    <div className="h-full bg-surface text-on-surface antialiased flex flex-col font-body selection:bg-surface-container-high pb-20 lg:pb-0">
      {/* Top App Bar */}
      <header className="w-full sticky top-0 left-0 right-0 z-40 bg-surface border-b border-outline-variant shrink-0 px-4 lg:px-12">
        <div className="w-full h-14 px-4 lg:px-12 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/artisan/products/new"
              aria-label={t("back", "वापस जाएं")}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <span className="font-title text-[18px] text-on-surface tracking-tight font-semibold lg:hidden">
              {t("step2Title", "कदम 2 / 4: बोलकर बताएं")}
            </span>
            <span className="font-headline text-[20px] text-primary tracking-tight font-bold hidden lg:block">
              {t("brandGreeting", "Craftigari नमस्ते")}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <Link href="/artisan/dashboard" className="text-secondary hover:text-primary transition-colors">{t("navHome", "Home")}</Link>
            <Link href="/products" className="text-secondary hover:text-primary transition-colors">{t("navCrafts", "Crafts")}</Link>
            <Link href="/artisan/products/new" className="flex items-center gap-1.5 text-accent-terracotta bg-accent-terracotta-soft px-3 py-1.5 rounded-full hover:bg-tertiary-fixed transition-colors">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              {t("navAdd", "Add")}
            </Link>
            <Link href="/products" className="text-secondary hover:text-primary transition-colors">{t("navMarket", "Market")}</Link>
            <Link href="/artisan/profile" className="text-secondary hover:text-primary transition-colors">{t("navProfile", "Profile")}</Link>
          </nav>

          <div className="flex items-center space-x-2">
            <LanguageSelector compact />
            <button
              aria-label="ध्वनि निर्देश सुनें"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-on-surface active:scale-95 transition-all"
              title="ध्वनि निर्देश सुनें"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant lg:text-on-surface">volume_up</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 w-full px-4 lg:px-12 pt-space-12 pb-space-24 lg:pb-12 flex flex-col justify-between lg:grid lg:grid-cols-12 lg:gap-12 lg:min-h-[calc(100vh-56px)] lg:content-center overflow-y-auto">
        {/* Left Column on Desktop / Top Section on Mobile */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Progress Bar (Mobile only) */}
          <div className="w-full grid grid-cols-4 gap-1.5 py-space-2 lg:hidden">
            <div className="h-1 rounded-full bg-[#1F1F1F]"></div>
            <div className="h-1 rounded-full bg-[#1F1F1F]"></div>
            <div className="h-1 rounded-full bg-[#E8EAED]"></div>
            <div className="h-1 rounded-full bg-[#E8EAED]"></div>
          </div>

          <div className="hidden lg:block">
            <h1 className="font-display text-[24px] font-bold text-on-surface tracking-tight mb-2">
              {t("step2Title", "कदम 2 / 4: बोलकर बताएं")}
            </h1>
          </div>

          {/* Product Context Row */}
          <div className="flex items-center justify-between px-space-12 py-space-8 rounded-xl bg-surface-bright border border-outline-variant lg:-mx-2">
            <div className="flex items-center gap-space-12">
              <img
                alt={productTitle}
                className="w-10 h-10 rounded-lg object-cover bg-surface-container border border-outline-variant flex-shrink-0"
                src={productImage}
              />
              <div className="flex flex-col">
                <span className="font-title text-[14px] text-on-surface leading-tight font-medium">{productTitle}</span>
                <span className="font-label text-label-small text-[#5F6368] mt-0.5">{t("voicePromptContext", "उत्पाद मसौदा")}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-space-8 py-1 rounded-full bg-surface-container-low border border-outline-variant">
              <span className={`w-2 h-2 rounded-full ${photos.length ? "bg-[#137333]" : "bg-warning"}`}></span>
              <span className={`font-label text-[11px] font-semibold ${photos.length ? "text-[#137333]" : "text-warning"}`}>
                {photos.length ? t("voicePhotoSaved", "तस्वीर सुरक्षित") : t("voiceNoPhoto", "तस्वीर नहीं चुनी")}
              </span>
            </div>
          </div>

          {/* Heading & Helper Line */}
          <div className="mt-2">
            <h1 className="text-[23px] leading-[32px] font-bold text-[#1F1F1F] tracking-tight">
              {t("voiceHeadline", "अपने उत्पाद के बारे में बताएं")}
            </h1>
            <p className="text-[14px] text-[#5F6368] mt-1 leading-normal">
              {t("voiceSubtitle", "जैसे आप किसी ग्राहक को समझा रहे हों")}
            </p>
          </div>

          {/* Speech Language Selector Pill */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[12px] font-medium text-secondary">
              {t("voiceSelectLang", "बोलने की भाषा:")}
            </span>
            <div className="inline-flex rounded-lg border border-outline bg-surface-container p-0.5">
              <button
                type="button"
                className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all ${
                  speechLanguage === "hi"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-secondary hover:text-primary"
                }`}
                onClick={() => handleLanguageChange("hi")}
              >
                {t("voiceLangHi", "हिंदी")}
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all ${
                  speechLanguage === "en"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-secondary hover:text-primary"
                }`}
                onClick={() => handleLanguageChange("en")}
              >
                {t("voiceLangEn", "English")}
              </button>
            </div>
          </div>

          {/* Microphone & Live Audio State */}
          <div className="flex flex-col items-center justify-center mt-3 mb-4 bg-surface-container-low py-8 rounded-2xl border border-dashed border-outline-variant lg:bg-transparent lg:border-none lg:py-2">
            <button
              aria-label={isRecording ? "ध्वनि रिकॉर्डिंग रोकें" : "ध्वनि रिकॉर्डिंग शुरू करें"}
              className={`w-[72px] h-[72px] rounded-full text-white flex items-center justify-center shadow-md active:scale-95 transition-all focus:outline-none ${
                isRecording ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-[#1F1F1F] hover:bg-[#2D3135]"
              }`}
              disabled={isTranscribing}
              onClick={toggleRecording}
              style={{ minWidth: "72px", minHeight: "72px", aspectRatio: "1 / 1" }}
              type="button"
            >
              <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isRecording ? "stop" : "mic"}
              </span>
            </button>

            {/* Status Row */}
            <div className="flex items-center gap-2 mt-[14px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isRecording
                    ? "bg-red-600 animate-pulse"
                    : isTranscribing
                    ? "bg-warning animate-spin"
                    : voice
                    ? "bg-[#137333]"
                    : "bg-[#5F6368]"
                }`}
              ></span>
              <span className="text-[14px] font-medium text-[#1F1F1F]">
                {isRecording
                  ? t("voiceListening", "सुन रहे हैं…")
                  : isTranscribing
                  ? t("voiceTranscribing", "Sarvam से प्रतिलिपि बनाई जा रही है…")
                  : voice
                  ? t("voiceSaved", "रिकॉर्डिंग सुरक्षित")
                  : t("voiceTapToRecord", "रिकॉर्ड करने के लिए दबाएं")}
              </span>
              <span className="text-[13px] text-[#5F6368] font-normal ml-0.5">
                {formatDuration(duration)}
              </span>
            </div>

            {/* Waveform */}
            <div className="w-full h-[24px] flex items-center justify-center mt-3 opacity-75">
              <svg className="w-full h-full" fill="none" viewBox="0 0 320 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 4 12 C 16 7, 24 17, 36 12 C 48 7, 56 17, 68 12 C 80 5, 92 19, 104 12 C 116 5, 128 19, 140 12 C 152 4, 164 20, 176 12 C 188 4, 200 20, 212 12 C 224 6, 236 18, 248 12 C 260 6, 272 18, 284 12 C 296 8, 308 16, 316 12"
                  stroke="#e08d72"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  opacity={isRecording ? "1" : "0.7"}
                ></path>
              </svg>
            </div>

            {recorderError && (
              <p className="text-[12px] text-error text-center mt-1">{recorderError}</p>
            )}
            {transcriptionError && (
              <p className="text-[12px] text-error text-center mt-1 px-4 leading-relaxed">{transcriptionError}</p>
            )}
            {transcriptionStatus && !transcriptionError && (
              <p className="text-[12px] text-success text-center mt-1 font-medium">{transcriptionStatus}</p>
            )}
          </div>
        </div>

        {/* Right Column on Desktop / Bottom Section on Mobile */}
        <div className="flex flex-col gap-6 mt-space-12 lg:mt-[40px] lg:col-span-7">
          <div>
            {/* Live Transcript Section */}
            <div className="w-full bg-surface-bright p-5 rounded-xl border border-outline-variant shadow-sm lg:p-6">
              <div className="flex items-center justify-between mb-2.5">
                <div className="text-[13px] font-semibold uppercase tracking-wider text-[#5F6368]">
                  {t("voiceYouSaid", "आपने कहा")}
                </div>
                {voice?.file && !isTranscribing && (
                  <button
                    type="button"
                    className="text-[12px] font-medium text-primary hover:underline flex items-center gap-1"
                    onClick={() => handleTranscribe(voice.file, speechLanguage)}
                  >
                    <span className="material-symbols-outlined text-[15px]">refresh</span>
                    <span>{t("voiceRetryTranscribe", "फिर से प्रतिलिपि बनाएं")}</span>
                  </button>
                )}
              </div>
              <textarea
                aria-label="वॉयस नोट की प्रतिलिपि"
                className="w-full min-h-[110px] resize-y bg-transparent border-0 p-0 text-[15px] lg:text-[17px] leading-relaxed text-[#202124] font-normal outline-none focus:ring-0"
                onChange={(event) => updateDraft({ transcript: event.target.value })}
                placeholder={t("voicePlaceholder", "यहाँ अपनी बात लिखें या सुधारें।")}
                value={draft.transcript}
              />
            </div>

            {/* Identified Facts Row */}
            <div className="w-full mt-6">
              <div className="text-[12px] font-medium text-[#5F6368] mb-2">
                {t("voiceFactsSummary", "मसौदे में उपलब्ध जानकारी")}
              </div>
              <div className="flex items-center flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-[#FEF9E7] text-[#B06000] border border-[#F9AB00]/40 rounded-full text-[13px] font-medium shadow-sm">
                  {voice ? t("voiceNoteSaved", "वॉयस नोट सुरक्षित") : t("voiceNoteOptional", "वॉयस नोट वैकल्पिक")}
                </span>
                <span className="px-3 py-1.5 bg-[#FEF9E7] text-[#B06000] border border-[#F9AB00]/40 rounded-full text-[13px] font-medium shadow-sm">
                  {draft.transcript ? t("voiceTranscriptAdded", "प्रतिलिपि सुरक्षित") : t("voiceTranscriptNeeded", "प्रतिलिपि जोड़ें")}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col items-center pt-4">
            <Link
              href="/artisan/products/new/summary"
              className="w-full h-[52px] rounded-xl bg-[#1F1F1F] text-white font-semibold text-[16px] flex items-center justify-center gap-2 hover:bg-[#303030] active:scale-[0.99] transition-all focus:outline-none shadow-md"
            >
              <span>{t("next", "आगे बढ़ें")}</span>
              <span className="text-[18px]">→</span>
            </Link>
            <button
              className="mt-3.5 py-1.5 px-4 text-[#5F6368] hover:text-[#1F1F1F] text-[13.5px] font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none"
              onClick={resetRecording}
              type="button"
            >
              <span className="text-[15px]">⟲</span>
              <span>{t("voiceReRecord", "फिर से रिकॉर्ड करें")}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
