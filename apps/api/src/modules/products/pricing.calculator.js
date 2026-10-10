/**
 * Craftigari Smart Pricing & Fair Deal Shield Calculation Engine
 *
 * Rules:
 * - Total Cost = Raw Materials + Labour + Packaging + Additional Expenses
 * - Suggested Selling Price = Total Cost + Expected Profit Markup (markup % on total cost)
 * - Minimum Safe Price = Total Cost (Breakeven)
 * - Artisan always controls the final selling price
 * - Real INR integer rounding to avoid floating-point issues
 */

export function sanitizeMoney(value, defaultValue = 0) {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) {
    return defaultValue;
  }
  return Math.round(num);
}

export function sanitizePercentage(value, defaultValue = 25) {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return defaultValue;
  }
  if (num < 0) {
    return 0;
  }
  return Math.min(1000, Math.round(num * 10) / 10);
}

/**
 * Calculates total cost, profit markup, suggested price, and cost tiers.
 */
export function calculateSmartPricing(input = {}) {
  const materialCost = sanitizeMoney(input.materialCost ?? input.materials, 0);
  const labourCost = sanitizeMoney(input.labourCost ?? input.labour, 0);
  const packagingCost = sanitizeMoney(input.packagingCost ?? input.packaging, 0);
  const otherExpenses = sanitizeMoney(
    input.otherExpenses ?? input.additionalExpenses,
    0,
  );
  const profitPercentage = sanitizePercentage(
    input.profitPercentage ?? input.profitMarkup,
    25,
  );

  const totalCost = materialCost + labourCost + packagingCost + otherExpenses;
  const expectedProfit = Math.round(totalCost * (profitPercentage / 100));
  const suggestedPrice = totalCost + expectedProfit;

  // Selected price defaults to suggestedPrice if not explicitly provided
  let selectedPrice = suggestedPrice;
  if (input.selectedPrice !== undefined && input.selectedPrice !== null) {
    selectedPrice = sanitizeMoney(input.selectedPrice, suggestedPrice);
  } else if (input.finalPrice !== undefined && input.finalPrice !== null) {
    selectedPrice = sanitizeMoney(input.finalPrice, suggestedPrice);
  }

  const isBelowCost = totalCost > 0 && selectedPrice < totalCost;
  const belowCostDifference = isBelowCost ? totalCost - selectedPrice : 0;

  let warning = null;
  if (isBelowCost) {
    warning = `Warning: Your selected selling price of ₹${selectedPrice.toLocaleString("en-IN")} is ₹${belowCostDifference.toLocaleString("en-IN")} below your declared production cost of ₹${totalCost.toLocaleString("en-IN")}.`;
  }

  const tiers = {
    minimum: totalCost,
    recommended: suggestedPrice,
    premium: totalCost + Math.round(expectedProfit * 1.5),
  };

  return {
    materialCost,
    labourCost,
    packagingCost,
    otherExpenses,
    totalCost,
    profitPercentage,
    expectedProfit,
    suggestedPrice,
    minimumSafePrice: totalCost,
    selectedPrice,
    finalPrice: selectedPrice,
    isBelowCost,
    belowCostDifference,
    warning,
    tiers,
  };
}

/**
 * Evaluates buyer offer against artisan's declared production costs.
 * Used by Fair Deal Shield.
 */
export function evaluateFairDeal({
  totalCost: inputTotalCost,
  offerPrice: inputOfferPrice,
  productPrice: inputProductPrice,
  suggestedPrice: inputSuggestedPrice,
} = {}) {
  const totalCost = sanitizeMoney(inputTotalCost, 0);
  const offerPrice = sanitizeMoney(inputOfferPrice, 0);
  const productPrice = sanitizeMoney(inputProductPrice, offerPrice);
  const suggestedPrice = sanitizeMoney(inputSuggestedPrice, productPrice);

  const hasDeclaredCost = totalCost > 0;
  const difference = offerPrice - totalCost;
  const isBelowCost = hasDeclaredCost && offerPrice < totalCost;
  const belowCostAmount = isBelowCost ? totalCost - offerPrice : 0;
  const profitAmount = hasDeclaredCost && offerPrice > totalCost ? offerPrice - totalCost : 0;

  let status = "profitable";
  let warning = null;

  if (!hasDeclaredCost) {
    status = "unrecorded_cost";
    warning = "No declared production costs found for this product. You can review and adjust your offer manually.";
  } else if (isBelowCost) {
    status = "below_cost";
    warning = `Warning: This offer is ₹${belowCostAmount.toLocaleString("en-IN")} below your declared production cost.`;
  } else if (offerPrice === totalCost) {
    status = "at_cost";
    warning = "This offer covers only your declared production costs with zero profit.";
  } else {
    status = "profitable";
    warning = `Estimated profit: ₹${profitAmount.toLocaleString("en-IN")} before any unaccounted fees.`;
  }

  const profitMarginPercentage =
    hasDeclaredCost && totalCost > 0
      ? Math.round(((offerPrice - totalCost) / totalCost) * 1000) / 10
      : 0;

  return {
    totalCost,
    offerPrice,
    productPrice,
    suggestedPrice,
    difference,
    isBelowCost,
    belowCostAmount,
    profitAmount,
    profitMarginPercentage,
    hasDeclaredCost,
    status,
    warning,
    minimumSafePrice: totalCost,
  };
}
