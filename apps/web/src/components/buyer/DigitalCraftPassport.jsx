"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/features/i18n/LanguageContext";

function ImageFallback({ label }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-muted text-tertiary">
      <span className="material-symbols-outlined text-[30px]">image_not_supported</span>
      <span className="px-3 text-center text-[11px]">{label}</span>
    </div>
  );
}

export function DigitalCraftPassport({ artisan, passportUrl, product }) {
  const { language: uiLang, t } = useLanguage();

  return (
    <article className="overflow-hidden border border-border bg-white shadow-sm">
      <header className="border-b border-border bg-surface-muted/30 p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">
              {t("passportTitle", "Digital Craft Passport")}
            </span>
            <h1 className="mt-2 break-words text-2xl font-bold leading-tight tracking-tight text-primary sm:text-3xl">{product.name}</h1>
            <p className="mt-2 break-all text-[13px] text-secondary">Passport ID: {product.id}</p>
          </div>
          <div className="hidden rounded-lg border border-border bg-white p-2 sm:block">
            <QRCodeSVG level="M" marginSize={1} size={104} value={passportUrl} />
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section className="border-b border-border p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="aspect-[4/3] overflow-hidden border border-border bg-surface-muted">
            {product.image ? (
              <img alt={product.name} className="h-full w-full object-cover" src={product.image} />
            ) : (
              <ImageFallback label="Product image unavailable in this browser" />
            )}
          </div>

          <dl className="mt-6 divide-y divide-border border-y border-border text-[13px]">
            <div className="flex items-start justify-between gap-4 py-3">
              <dt className="text-secondary">{uiLang === "hi" ? "शिल्प प्रकार" : "Craft type"}</dt>
              <dd className="max-w-[65%] break-words text-right font-semibold text-primary">{product.craftType || product.category}</dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3">
              <dt className="text-secondary">{uiLang === "hi" ? "सामग्री" : "Materials"}</dt>
              <dd className="max-w-[65%] break-words text-right font-semibold text-primary">{product.material}</dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3">
              <dt className="text-secondary">{uiLang === "hi" ? "क्षेत्र" : "Region"}</dt>
              <dd className="max-w-[65%] break-words text-right font-semibold text-primary">{product.region}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-primary">{uiLang === "hi" ? "शिल्प विवरण" : "Product story"}</h2>
            <p className="mt-2 break-words text-[13px] leading-relaxed text-secondary">{product.description}</p>
          </div>

          {artisan && (
            <div className="mt-6 border border-border bg-surface-muted/30 p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">Made by</span>
              <Link className="mt-1 block text-[15px] font-bold text-primary transition-colors hover:text-terracotta" href={`/artisans/${artisan.id}`}>
                {artisan.name}
              </Link>
              <p className="mt-0.5 break-words text-[12px] text-secondary">{artisan.location} · {artisan.specialization}</p>
            </div>
          )}
        </section>

        <section className="p-5 sm:p-8">
          <div className="mb-6">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">Raw material to finished product</span>
            <h2 className="mt-1 text-xl font-bold text-primary">Making Process</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-secondary">Descriptions shown here are the artisan-entered process notes for this product.</p>
          </div>

          <div className="space-y-5">
            {(product.makingProcess ?? []).map((step, index) => (
              <div className="relative grid grid-cols-[34px_minmax(0,1fr)] gap-3" key={step.id}>
                {index < product.makingProcess.length - 1 && (
                  <div className="absolute bottom-[-20px] left-[16px] top-8 w-px bg-border" />
                )}
                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">{index + 1}</span>
                <div className="overflow-hidden border border-border bg-white">
                  <div className="aspect-[16/9] bg-surface-muted">
                    {step.image ? (
                      <img alt={step.title} className="h-full w-full object-cover" src={step.image} />
                    ) : (
                      <ImageFallback label="Stage photo unavailable" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="break-words text-[15px] font-bold text-primary">{step.title || `Process step ${index + 1}`}</h3>
                    <p className="mt-1 break-words text-[13px] leading-relaxed text-secondary">{step.description || "No process description was added."}</p>
                  </div>
                </div>
              </div>
            ))}
            {!product.makingProcess?.length && (
              <div className="border border-dashed border-border bg-surface-muted/20 px-5 py-10 text-center text-[13px] text-secondary">
                Making Process documentation is not available for this product.
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center rounded-xl border border-border bg-surface-muted/30 p-5 text-center sm:hidden">
            <QRCodeSVG level="M" marginSize={1} size={180} value={passportUrl} />
            <span className="mt-3 text-[11px] text-secondary">Scan to reopen this passport</span>
          </div>
        </section>
      </div>
    </article>
  );
}
