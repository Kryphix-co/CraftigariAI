"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/features/i18n/LanguageContext";
import { LanguageSelector } from "@/features/i18n/LanguageSelector";
import {
  calculateSmartPricingClient,
  PRODUCT_SIZE_LABELS,
  useProductDraft,
} from "@/features/product/ProductDraftContext";
import { apiPost } from "@/lib/api";

export default function SmartPricingPage() {
  const { language: uiLang, t } = useLanguage();
  const { draft, photos, updateDraft } = useProductDraft();

  // Initial pricing from draft or sensible defaults
  const initialPricing = useMemo(() => {
    return {
      materialCost: draft.pricing?.materialCost ?? 300,
      labourCost: draft.pricing?.labourCost ?? 200,
      packagingCost: draft.pricing?.packagingCost ?? 50,
      otherExpenses: draft.pricing?.otherExpenses ?? 50,
      profitPercentage: draft.pricing?.profitPercentage ?? 25,
      selectedTier: draft.pricing?.selectedTier ?? "recommended",
      finalPrice: draft.pricing?.finalPrice ?? 750,
    };
  }, [draft.pricing]);

  const [costs, setCosts] = useState({
    materialCost: initialPricing.materialCost,
    labourCost: initialPricing.labourCost,
    packagingCost: initialPricing.packagingCost,
    otherExpenses: initialPricing.otherExpenses,
    profitPercentage: initialPricing.profitPercentage,
  });

  const [selectedTier, setSelectedTier] = useState(initialPricing.selectedTier);
  const [customPriceInput, setCustomPriceInput] = useState(
    initialPricing.selectedTier === "custom" ? String(initialPricing.finalPrice) : "",
  );
  const [isEditingCosts, setIsEditingCosts] = useState(false);

  // Compute live calculations using client pricing engine
  const calculation = useMemo(() => {
    let customPrice = null;
    if (selectedTier === "custom" && customPriceInput !== "") {
      customPrice = Math.max(0, Math.round(Number(customPriceInput) || 0));
    }

    const res = calculateSmartPricingClient({
      materialCost: costs.materialCost,
      labourCost: costs.labourCost,
      packagingCost: costs.packagingCost,
      otherExpenses: costs.otherExpenses,
      profitPercentage: costs.profitPercentage,
      finalPrice: customPrice,
    });

    let activeFinalPrice = res.suggestedPrice;
    if (selectedTier === "minimum") {
      activeFinalPrice = res.tiers.minimum;
    } else if (selectedTier === "premium") {
      activeFinalPrice = res.tiers.premium;
    } else if (selectedTier === "custom" && customPrice !== null) {
      activeFinalPrice = customPrice;
    }

    const isBelowCost = res.totalCost > 0 && activeFinalPrice < res.totalCost;
    const belowCostDifference = isBelowCost ? res.totalCost - activeFinalPrice : 0;

    return {
      ...res,
      activeFinalPrice,
      isBelowCost,
      belowCostDifference,
    };
  }, [costs, selectedTier, customPriceInput]);

  // Sync draft state whenever calculation changes
  const syncToDraft = useCallback(
    (calc, tier) => {
      updateDraft({
        selectedPrice: calc.activeFinalPrice,
        pricing: {
          materialCost: calc.materialCost,
          labourCost: calc.labourCost,
          packagingCost: calc.packagingCost,
          otherExpenses: calc.otherExpenses,
          profitPercentage: calc.profitPercentage,
          totalCost: calc.totalCost,
          suggestedPrice: calc.suggestedPrice,
          finalPrice: calc.activeFinalPrice,
          selectedTier: tier,
        },
      });
    },
    [updateDraft],
  );

  useEffect(() => {
    syncToDraft(calculation, selectedTier);
  }, [calculation, selectedTier, syncToDraft]);

  // Asynchronous server verification (non-blocking)
  useEffect(() => {
    let isCancelled = false;
    const verifyServerPricing = async () => {
      try {
        await apiPost("/api/products/calculate-pricing", {
          materialCost: costs.materialCost,
          labourCost: costs.labourCost,
          packagingCost: costs.packagingCost,
          otherExpenses: costs.otherExpenses,
          profitPercentage: costs.profitPercentage,
          selectedPrice: calculation.activeFinalPrice,
        });
      } catch {
        // Safe silent fallback: client calculation is authoritative for wizard draft
      }
    };
    const timer = setTimeout(() => {
      if (!isCancelled) verifyServerPricing();
    }, 400);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [costs, calculation.activeFinalPrice]);

  const handleCostChange = (field, rawValue) => {
    const parsed = Math.max(0, Math.round(Number(rawValue) || 0));
    setCosts((prev) => ({ ...prev, [field]: parsed }));
  };

  const handleProfitChange = (rawValue) => {
    const parsed = Math.max(0, Math.min(1000, Number(rawValue) || 0));
    setCosts((prev) => ({ ...prev, profitPercentage: parsed }));
  };

  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    if (tier !== "custom") {
      setCustomPriceInput("");
    }
  };

  const productImage =
    photos[0]?.url ??
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop";
  const productTitle = draft.summary.title || (uiLang === "hi" ? "नया उत्पाद" : "New Craft");

  return (
    <div className="bg-surface-container-low text-on-surface font-body antialiased min-h-full flex flex-col justify-between selection:bg-outline selection:text-primary pb-20 lg:pb-0">
      <div className="w-full min-h-[calc(100vh-56px)] flex flex-col bg-surface-container-lowest lg:bg-transparent shadow-sm lg:shadow-none">
        {/* Top App Bar */}
        <header className="w-full sticky top-0 left-0 right-0 z-40 bg-surface/95 lg:bg-transparent backdrop-blur-md px-4 lg:px-12 h-14 flex items-center justify-between border-b border-outline-variant shrink-0">
          <div className="flex items-center space-x-3">
            <Link
              href="/artisan/products/new/missing-info"
              aria-label={t("back", "वापस जाएं")}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <span className="font-title text-[15px] text-on-surface tracking-tight font-semibold lg:hidden">
              कदम 4 / 5: स्मार्ट मूल्य निर्धारण
            </span>
            <span className="font-headline text-[20px] text-primary tracking-tight font-bold hidden lg:block">
              {t("brandGreeting", "Craftigari नमस्ते")}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <Link href="/artisan/dashboard" className="text-secondary hover:text-primary transition-colors">
              {t("navHome", "Home")}
            </Link>
            <Link href="/products" className="text-secondary hover:text-primary transition-colors">
              {t("navCrafts", "Crafts")}
            </Link>
            <Link
              href="/artisan/products/new"
              className="flex items-center gap-1.5 text-accent-terracotta bg-accent-terracotta-soft px-3 py-1.5 rounded-full hover:bg-tertiary-fixed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                mic
              </span>
              {t("navAdd", "Add")}
            </Link>
            <Link href="/products" className="text-secondary hover:text-primary transition-colors">
              {t("navMarket", "Market")}
            </Link>
            <Link href="/artisan/profile" className="text-secondary hover:text-primary transition-colors">
              {t("navProfile", "Profile")}
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <LanguageSelector compact />
            <button
              aria-label="ध्वनि निर्देश सुनें"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-on-surface active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant lg:text-on-surface">volume_up</span>
            </button>
          </div>
        </header>

        {/* 5-Step Progress Indicator - Mobile Only */}
        <div className="w-full px-4 lg:px-12 pt-3 pb-2 lg:hidden">
          <div aria-hidden="true" className="grid grid-cols-5 gap-1.5 h-1 w-full">
            <div className="h-full bg-primary rounded-full"></div>
            <div className="h-full bg-primary rounded-full"></div>
            <div className="h-full bg-primary rounded-full"></div>
            <div className="h-full bg-primary rounded-full"></div>
            <div className="h-full bg-[#E8EAED] rounded-full"></div>
          </div>
        </div>

        {/* Main Viewport */}
        <main className="flex-1 w-full px-4 lg:px-12 pt-space-12 pb-space-24 lg:pb-12 flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 lg:min-h-[calc(100vh-56px)] lg:content-center overflow-y-auto">
          {/* Left Column: Product Context & Editable Cost Breakdown */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Product Context Banner */}
            <section className="p-space-8 bg-surface-container-low rounded-xl border border-outline-variant flex items-center gap-space-12">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden flex-shrink-0 border border-outline-variant">
                <img className="w-full h-full object-cover" alt={productTitle} src={productImage} />
              </div>
              <div className="flex flex-col flex-grow min-w-0">
                <div className="flex items-center gap-space-4">
                  <span className="font-title text-[14px] leading-snug font-semibold text-primary truncate">
                    {productTitle}
                  </span>
                  <span className="inline-flex items-center px-space-4 py-1 rounded text-[10px] font-label font-semibold bg-surface-container text-secondary">
                    उत्पाद मसौदा
                  </span>
                </div>
                <span className="font-body text-[12px] text-secondary mt-0.5">
                  आकार: {PRODUCT_SIZE_LABELS[draft.size]}
                </span>
              </div>
            </section>

            {/* Primary Heading */}
            <section className="space-y-1">
              <h1 className="font-headline text-[22px] leading-7 font-bold text-primary tracking-tight">
                सही कीमत तय करें
              </h1>
              <p className="font-body text-[14px] text-secondary">
                आपकी सामग्री, कारीगरी और मुनाफे के आधार पर वास्तविक गणना
              </p>
            </section>

            {/* Editable Cost Summary Breakdown */}
            <section className="bg-surface-container-lowest lg:bg-surface rounded-xl border border-outline-variant p-space-16 space-y-space-12 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between pb-space-8 border-b border-outline-variant">
                <span className="font-title text-[13px] font-semibold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">receipt_long</span>
                  उत्पादन लागत विवरण (Cost Breakdown)
                </span>
                <button
                  className="font-label text-[12px] font-semibold text-[#a8421e] hover:underline flex items-center gap-0.5 cursor-pointer"
                  onClick={() => setIsEditingCosts(!isEditingCosts)}
                  type="button"
                >
                  {isEditingCosts ? "पूर्ण करें" : "लागत बदलें"}
                  <span className="material-symbols-outlined text-[14px]">
                    {isEditingCosts ? "check" : "edit"}
                  </span>
                </button>
              </div>

              {/* Cost Inputs / Display */}
              <div className="space-y-3 text-body text-[13px]">
                {/* 1. Raw Materials */}
                <div className="flex justify-between items-center text-on-surface-variant gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-primary">सामग्री लागत (Raw Materials)</span>
                    <span className="text-[11px] text-secondary font-normal">मिट्टी, रंग, प्राकृतिक सामग्री</span>
                  </div>
                  {isEditingCosts ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] font-semibold text-secondary">₹</span>
                      <input
                        type="number"
                        min="0"
                        className="w-20 px-2 py-1 text-right text-[13px] font-semibold border border-outline rounded bg-surface text-primary outline-none focus:border-primary"
                        value={costs.materialCost}
                        onChange={(e) => handleCostChange("materialCost", e.target.value)}
                      />
                    </div>
                  ) : (
                    <span className="font-body-medium font-semibold text-primary">
                      ₹{costs.materialCost.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* 2. Labour Cost */}
                <div className="flex justify-between items-center text-on-surface-variant gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-primary">कारीगरी / मेहनत (Labour Cost)</span>
                    <span className="text-[11px] text-secondary font-normal">हस्तकला, समय और श्रम</span>
                  </div>
                  {isEditingCosts ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] font-semibold text-secondary">₹</span>
                      <input
                        type="number"
                        min="0"
                        className="w-20 px-2 py-1 text-right text-[13px] font-semibold border border-outline rounded bg-surface text-primary outline-none focus:border-primary"
                        value={costs.labourCost}
                        onChange={(e) => handleCostChange("labourCost", e.target.value)}
                      />
                    </div>
                  ) : (
                    <span className="font-body-medium font-semibold text-primary">
                      ₹{costs.labourCost.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* 3. Packaging */}
                <div className="flex justify-between items-center text-on-surface-variant gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-primary">सुरक्षित पैकेजिंग (Packaging)</span>
                    <span className="text-[11px] text-secondary font-normal">सुरक्षा बॉक्स, बबल रैप</span>
                  </div>
                  {isEditingCosts ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] font-semibold text-secondary">₹</span>
                      <input
                        type="number"
                        min="0"
                        className="w-20 px-2 py-1 text-right text-[13px] font-semibold border border-outline rounded bg-surface text-primary outline-none focus:border-primary"
                        value={costs.packagingCost}
                        onChange={(e) => handleCostChange("packagingCost", e.target.value)}
                      />
                    </div>
                  ) : (
                    <span className="font-body-medium font-semibold text-primary">
                      ₹{costs.packagingCost.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* 4. Other Expenses */}
                <div className="flex justify-between items-center text-on-surface-variant gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-primary">परिवहन व अन्य खर्च (Other Expenses)</span>
                    <span className="text-[11px] text-secondary font-normal">ईंधन, स्थानीय भाड़ा</span>
                  </div>
                  {isEditingCosts ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] font-semibold text-secondary">₹</span>
                      <input
                        type="number"
                        min="0"
                        className="w-20 px-2 py-1 text-right text-[13px] font-semibold border border-outline rounded bg-surface text-primary outline-none focus:border-primary"
                        value={costs.otherExpenses}
                        onChange={(e) => handleCostChange("otherExpenses", e.target.value)}
                      />
                    </div>
                  ) : (
                    <span className="font-body-medium font-semibold text-primary">
                      ₹{costs.otherExpenses.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* 5. Profit Markup % */}
                <div className="flex justify-between items-center text-on-surface-variant gap-2 pt-2 border-t border-outline-variant/60">
                  <div className="flex flex-col">
                    <span className="font-medium text-primary">अपेक्षित लाभ (Profit Markup %)</span>
                    <span className="text-[11px] text-secondary font-normal">लागत पर लाभ प्रतिशत</span>
                  </div>
                  {isEditingCosts ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="500"
                        className="w-16 px-2 py-1 text-right text-[13px] font-semibold border border-outline rounded bg-surface text-primary outline-none focus:border-primary"
                        value={costs.profitPercentage}
                        onChange={(e) => handleProfitChange(e.target.value)}
                      />
                      <span className="text-[13px] font-semibold text-secondary">%</span>
                    </div>
                  ) : (
                    <span className="font-body-medium font-semibold text-[#a8421e]">
                      +{costs.profitPercentage}% (+₹{calculation.expectedProfit.toLocaleString("en-IN")})
                    </span>
                  )}
                </div>
              </div>

              {/* Total Base Cost Bar */}
              <div className="pt-space-8 border-t border-outline-variant flex justify-between items-center bg-surface-container-low -mx-space-16 -mb-space-16 p-space-12 rounded-b-xl">
                <div className="flex flex-col">
                  <span className="font-body-medium text-[13px] font-semibold text-primary">
                    कुल न्यूनतम लागत (Total Cost):
                  </span>
                  <span className="text-[11px] text-secondary">बिना घाटे के न्यूनतम आधार</span>
                </div>
                <span className="font-headline text-[17px] font-bold text-primary">
                  ₹{calculation.totalCost.toLocaleString("en-IN")}
                </span>
              </div>
            </section>
          </div>

          {/* Right Column: Price Tiers & Custom Price Input */}
          <div className="flex flex-col gap-6 mt-space-24 lg:mt-0 lg:col-span-7">
            {/* Below-Cost Warning Banner */}
            {calculation.isBelowCost && (
              <section className="p-4 rounded-xl border border-red-300 bg-red-50 text-red-900 flex items-start gap-3 shadow-xs">
                <span className="material-symbols-outlined text-[24px] text-red-600 flex-shrink-0 mt-0.5">
                  warning
                </span>
                <div className="flex flex-col">
                  <span className="font-title text-[14px] font-bold text-red-900">
                    चेतावनी: चुनी गई कीमत आपकी लागत से कम है
                  </span>
                  <p className="font-body text-[13px] text-red-800 mt-0.5 leading-relaxed">
                    आपकी चुनी गई कीमत (₹{calculation.activeFinalPrice.toLocaleString("en-IN")}) आपकी घोषित उत्पादन लागत (₹
                    {calculation.totalCost.toLocaleString("en-IN")}) से ₹
                    {calculation.belowCostDifference.toLocaleString("en-IN")} कम है। घाटे से बचने के लिए न्यूनतम सुरक्षित
                    कीमत चुनें।
                  </p>
                </div>
              </section>
            )}

            {/* Price Level Selection */}
            <section aria-label="मूल्य निर्धारण स्तर" className="space-y-space-12" role="radiogroup">
              <label className="font-label-small text-[11px] font-semibold text-secondary block">
                मूल्य विकल्प चुनें (Select Selling Price)
              </label>

              {/* Option 1: Breakeven / Minimum Floor */}
              <div
                className={`group relative rounded-xl border p-space-16 bg-surface cursor-pointer transition-all ${
                  selectedTier === "minimum"
                    ? "border-2 border-primary shadow-sm"
                    : "border-outline-variant hover:border-outline"
                }`}
                onClick={() => handleSelectTier("minimum")}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-space-2 pr-space-8">
                    <span className="font-title text-[15px] font-semibold text-primary block">
                      न्यूनतम सुरक्षित कीमत (Minimum Safe Price)
                    </span>
                    <p className="font-body text-[13px] leading-relaxed text-secondary mt-0.5">
                      लागत सुरक्षित, कोई घाटा नहीं (Breakeven cost)
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-headline text-[18px] font-bold text-primary block leading-none">
                      ₹{calculation.tiers.minimum.toLocaleString("en-IN")}
                    </span>
                    <span className="font-label text-[11px] text-secondary font-medium">लागत आधार</span>
                  </div>
                </div>
                <div className="mt-space-12 flex items-center justify-between pt-space-8 border-t border-outline-variant">
                  <span className="text-[11px] text-secondary">न्यूनतम उत्पादन लागत फ्लोर</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      selectedTier === "minimum" ? "border-2 border-primary" : "border border-outline"
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        selectedTier === "minimum" ? "bg-primary" : "bg-transparent"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Option 2: RECOMMENDED (Calculated with Artisan Markup) */}
              <div
                className={`relative rounded-xl border-2 p-space-16 bg-surface shadow-sm cursor-pointer ${
                  selectedTier === "recommended"
                    ? "border-[#a8421e] ring-1 ring-[#a8421e]/10"
                    : "border-outline-variant hover:border-outline"
                }`}
                onClick={() => handleSelectTier("recommended")}
              >
                <div className="absolute -top-3 left-4 bg-[#a8421e] text-white px-space-8 py-0.5 rounded-full font-label text-[11px] font-bold tracking-tight shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  सुझाई गई कीमत (Recommended)
                </div>
                <div className="flex items-start justify-between pt-space-4">
                  <div className="space-y-space-2 pr-space-8">
                    <div className="flex items-center gap-1.5">
                      <span className="font-title text-[16px] font-bold text-primary block">
                        उचित मूल्य (+{costs.profitPercentage}% लाभ)
                      </span>
                    </div>
                    <p className="font-body text-[13px] leading-relaxed text-on-surface-variant font-medium mt-0.5">
                      लागत + {costs.profitPercentage}% अपेक्षित लाभ (मेहनत का पूरा मूल्य)
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-display text-[22px] font-bold text-primary block leading-none">
                      ₹{calculation.suggestedPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="font-label text-[12px] text-[#a8421e] font-semibold mt-1 inline-block">
                      +₹{calculation.expectedProfit.toLocaleString("en-IN")} लाभ मार्जिन
                    </span>
                  </div>
                </div>
                <div className="mt-space-12 flex items-center justify-between pt-space-8 border-t border-outline-variant">
                  <span className="text-[12px] font-semibold text-primary">
                    {selectedTier === "recommended" ? "आपने यह मूल्य चुना है" : "सुझाव चुनें"}
                  </span>
                  {selectedTier === "recommended" ? (
                    <div className="w-5 h-5 rounded-full bg-[#a8421e] text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check
                      </span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-outline flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-transparent"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Option 3: Premium Tier */}
              <div
                className={`group relative rounded-xl border p-space-16 bg-surface cursor-pointer transition-all ${
                  selectedTier === "premium"
                    ? "border-2 border-primary shadow-sm"
                    : "border-outline-variant hover:border-outline"
                }`}
                onClick={() => handleSelectTier("premium")}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-space-2 pr-space-8">
                    <span className="font-title text-[15px] font-semibold text-primary block">
                      प्रीमियम कीमत (Premium / Exhibition)
                    </span>
                    <p className="font-body text-[13px] leading-relaxed text-secondary mt-0.5">
                      विशेष प्रदर्शनी व कला दीर्घा हेतु मूल्य
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-headline text-[18px] font-bold text-primary block leading-none">
                      ₹{calculation.tiers.premium.toLocaleString("en-IN")}
                    </span>
                    <span className="font-label text-[11px] text-secondary font-medium">
                      +₹{Math.round(calculation.expectedProfit * 1.5).toLocaleString("en-IN")} मार्जिन
                    </span>
                  </div>
                </div>
                <div className="mt-space-12 flex items-center justify-between pt-space-8 border-t border-outline-variant">
                  <span className="text-[11px] text-secondary">गैलरी और कला प्रदर्शनी के लिए</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      selectedTier === "premium" ? "border-2 border-primary" : "border border-outline"
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        selectedTier === "premium" ? "bg-primary" : "bg-transparent"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Option 4: Custom Price Input (Artisan In Full Control) */}
              <div
                className={`group relative rounded-xl border p-space-16 bg-surface cursor-pointer transition-all ${
                  selectedTier === "custom"
                    ? "border-2 border-primary shadow-sm"
                    : "border-outline-variant hover:border-outline"
                }`}
                onClick={() => handleSelectTier("custom")}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="font-title text-[15px] font-semibold text-primary block">
                      अपना विक्रय मूल्य खुद तय करें (Custom Price)
                    </span>
                    <p className="font-body text-[12px] text-secondary">
                      आप अपनी पसंद की कोई भी अंतिम कीमत दर्ज कर सकते हैं
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[16px] font-bold text-primary">₹</span>
                    <input
                      type="number"
                      min="0"
                      placeholder={String(calculation.suggestedPrice)}
                      value={customPriceInput}
                      onFocus={() => handleSelectTier("custom")}
                      onChange={(e) => {
                        handleSelectTier("custom");
                        setCustomPriceInput(e.target.value);
                      }}
                      className="w-28 px-3 py-1.5 text-right font-display text-[17px] font-bold border border-outline rounded-lg bg-surface text-primary outline-none focus:border-primary shadow-xs"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Explanation Note */}
            <section className="bg-surface-container-low rounded-xl border border-outline p-space-12 flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] text-secondary flex-shrink-0 mt-0.5">info</span>
              <p className="font-body text-[12px] leading-relaxed text-on-surface-variant">
                यह सहायक आपके द्वारा दी गई लागत और लाभ प्रतिशत पर आधारित सुझाव देता है। Craftigari इसे प्रमाणित बाजार
                मूल्य के रूप में प्रस्तुत नहीं करता। अंतिम मूल्य सदैव आपके पूर्ण नियंत्रण में है।
              </p>
            </section>

            {/* Bottom Action Cluster */}
            <section className="pt-space-8 space-y-space-12 lg:mt-auto">
              <Link
                href="/artisan/products/new/making-process"
                className="w-full h-[52px] bg-[#1f1f1f] hover:bg-[#303030] active:scale-[0.98] transition-all text-white font-title text-[15px] font-medium rounded-xl flex items-center justify-center gap-space-8 shadow-sm"
              >
                <span>आगे बढ़ें (₹{calculation.activeFinalPrice.toLocaleString("en-IN")})</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <p className="text-center font-body text-[12px] text-secondary">
                प्रकाशन से पहले पूर्वावलोकन में आप पुनः कीमत जांच सकते हैं
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
