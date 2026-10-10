"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageSelector } from "@/features/i18n/LanguageSelector";
import MakingProcessStep from "@/features/product/MakingProcessStep";
import { useProductDraft } from "@/features/product/ProductDraftContext";
import { analyzeMakingProcessDraft } from "@/lib/productAnalysis";

export default function MakingProcessPage() {
  const {
    addMakingProcessStep,
    draft,
    makingProcessImages,
    moveMakingProcessStep,
    removeMakingProcessStep,
    setMakingProcessImage,
    updateMakingProcessStep,
    updateDraft,
  } = useProductDraft();
  const [aiStatus, setAiStatus] = useState("idle");
  const [aiError, setAiError] = useState("");
  const steps = draft.makingProcess;
  const imageCount = steps.filter(
    (step) => makingProcessImages[step.id] || step.imageUrl,
  ).length;
  const hasAllPhotos = steps.length >= 3 && steps.every(
    (step) => makingProcessImages[step.id] || step.imageUrl,
  );

  const requestAiHelp = async () => {
    setAiStatus("loading");
    setAiError("");
    try {
      await analyzeMakingProcessDraft({ draft, makingProcessImages, updateDraft });
      setAiStatus("complete");
    } catch (error) {
      setAiStatus("error");
      setAiError(error.message || "AI suggestions are unavailable. Manual editing still works.");
    }
  };

  return (
    <div className="min-h-full bg-surface-container-lowest pb-24 font-body text-on-surface antialiased lg:pb-10">
      <header className="sticky left-0 right-0 top-0 z-40 flex h-14 w-full items-center justify-between border-b border-outline-variant bg-surface/95 px-4 backdrop-blur-md lg:px-12">
        <div className="flex items-center space-x-3">
          <Link
            aria-label="Back to pricing"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface transition-all hover:bg-surface-container active:scale-95 lg:hidden"
            href="/artisan/products/new/pricing"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <span className="font-title text-[15px] font-semibold tracking-tight text-on-surface lg:hidden">
            Making Process
          </span>
          <span className="hidden font-headline text-[20px] font-bold tracking-tight text-primary lg:block">
            Craftigari नमस्ते
          </span>
        </div>

        <nav className="hidden items-center space-x-6 text-sm font-medium lg:flex">
          <Link className="text-secondary transition-colors hover:text-primary" href="/artisan/dashboard">Home</Link>
          <Link className="text-secondary transition-colors hover:text-primary" href="/products">Crafts</Link>
          <Link className="flex items-center gap-1.5 rounded-full bg-accent-terracotta-soft px-3 py-1.5 text-accent-terracotta transition-colors hover:bg-tertiary-fixed" href="/artisan/products/new">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
            Add
          </Link>
          <Link className="text-secondary transition-colors hover:text-primary" href="/products">Market</Link>
          <Link className="text-secondary transition-colors hover:text-primary" href="/artisan/profile">Profile</Link>
        </nav>

        <LanguageSelector compact />
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-5 lg:px-8 lg:pt-8">
        <section className="mb-5 rounded-xl border border-outline-variant bg-surface p-4 lg:p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <span className="font-label text-[11px] font-semibold uppercase tracking-wider text-success">
                Step 5 / 5 · Optional
              </span>
              <h1 className="mt-1 font-headline text-[22px] font-bold tracking-tight text-primary lg:text-[26px]">
                Document the Making Process
              </h1>
              <p className="mt-1 max-w-2xl font-body text-[14px] leading-relaxed text-secondary">
                Optional for this prototype. Add up to 5 real photos and explain how your product was made, or continue directly to preview.
              </p>
            </div>
            <div className={`inline-flex h-8 flex-shrink-0 items-center gap-1.5 self-start rounded-full border px-3 font-label text-[12px] font-semibold ${hasAllPhotos ? "border-[#CEEAD6] bg-[#E6F4EA] text-success" : "border-outline bg-surface-container text-secondary"}`}>
              <span className="material-symbols-outlined text-[16px]">{hasAllPhotos ? "check_circle" : "photo_library"}</span>
              Optional · {imageCount} / {steps.length} photos
            </div>
          </div>
        </section>

        <section className="mb-4 rounded-xl border border-outline-variant bg-surface p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-1.5 font-title text-[14px] font-semibold text-primary"><span className="material-symbols-outlined text-[18px]">auto_awesome</span>Optional Gemini wording help</h2>
              <p className="mt-1 text-[12px] text-secondary">Runs only when requested and never adds unseen steps.</p>
            </div>
            <button className="h-10 rounded-lg border border-primary px-4 text-[13px] font-semibold text-primary disabled:opacity-60" disabled={aiStatus === "loading"} onClick={requestAiHelp} type="button">{aiStatus === "loading" ? "Analyzing…" : "Suggest descriptions"}</button>
          </div>
          {aiError && <p className="mt-3 text-[12px] text-error">{aiError}</p>}
          {aiStatus === "complete" && <p className="mt-3 text-[12px] text-success">Suggestions are ready below. Apply only the ones you want.</p>}
        </section>

        <section className="space-y-4" aria-label="Making process steps">
          {steps.map((step, index) => (
            <MakingProcessStep
              canMoveDown={index < steps.length - 1}
              canMoveUp={index > 0}
              canRemove={steps.length > 3}
              image={makingProcessImages[step.id]}
              index={index}
              key={step.id}
              onImageChange={(file) => setMakingProcessImage(step.id, file)}
              onMoveDown={() => moveMakingProcessStep(step.id, 1)}
              onMoveUp={() => moveMakingProcessStep(step.id, -1)}
              onRemove={() => removeMakingProcessStep(step.id)}
              onUpdate={(patch) => updateMakingProcessStep(step.id, patch)}
              onApplySuggestion={(suggestion) => updateMakingProcessStep(step.id, { title: suggestion.title, description: suggestion.description })}
              suggestion={draft.processAiSuggestions[step.id]}
              step={step}
            />
          ))}
        </section>

        <button
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-outline bg-surface font-title text-[14px] font-semibold text-primary transition-colors hover:border-primary hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
          disabled={steps.length >= 5}
          onClick={addMakingProcessStep}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          {steps.length >= 5 ? "Maximum 5 process steps" : "Add another process step"}
        </button>

        <div className="mt-6 hidden items-center gap-4 border-t border-outline-variant pt-6 lg:flex">
          <Link className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border border-outline bg-surface font-title text-[15px] font-semibold text-primary transition-all hover:bg-surface-container-low active:scale-[0.99]" href="/artisan/products/new/pricing">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to pricing
          </Link>
          <Link className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#1f1f1f] font-title text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[#303030] active:scale-[0.99]" href="/artisan/products/new/preview">
            Preview listing
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant bg-surface/95 p-4 backdrop-blur-md lg:hidden">
        <Link className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#1f1f1f] font-title text-[15px] font-semibold text-white shadow-sm transition-all active:scale-[0.99]" href="/artisan/products/new/preview">
          Preview listing
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
