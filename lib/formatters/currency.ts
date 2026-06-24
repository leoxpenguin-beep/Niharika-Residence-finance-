// ─── INR Currency Formatter ──────────────────────────────────────────────────

const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formats a number as Indian Rupees.
 * @example formatINR(125000) → "₹1,25,000"
 */
export function formatINR(amount: number): string {
  return INR_FORMATTER.format(amount);
}

/**
 * Formats a number as Indian Rupees with compact suffix for large values.
 * @example formatINRCompact(1250000) → "₹12.5L"
 * @example formatINRCompact(10000000) → "₹1Cr"
 */
export function formatINRCompact(amount: number): string {
  if (amount >= 10_000_000) {
    return `₹${(amount / 10_000_000).toFixed(2).replace(/\.?0+$/, "")}Cr`;
  }
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(2).replace(/\.?0+$/, "")}L`;
  }
  if (amount >= 1_000) {
    return `₹${(amount / 1_000).toFixed(1).replace(/\.?0+$/, "")}K`;
  }
  return formatINR(amount);
}

/**
 * Returns "Price to be confirmed" if amount is 0 or undefined,
 * otherwise returns the formatted INR string.
 * Used on client pages where a price may not be set yet.
 */
export function formatClientPrice(amount: number | undefined | null): string {
  if (!amount || amount === 0) return "Price to be confirmed";
  return formatINR(amount);
}

/**
 * Returns true if the price is a real value (non-zero, non-null).
 */
export function hasPriceValue(amount: number | undefined | null): boolean {
  return typeof amount === "number" && amount > 0;
}

/**
 * Rounds a client-facing price to the nearest clean interval:
 * - Below ₹10,000  → nearest ₹500
 * - ₹10k–₹1L      → nearest ₹1,000
 * - Above ₹1L      → nearest ₹5,000
 */
export function roundClientPrice(amount: number): number {
  if (amount <= 0) return 0;
  if (amount < 10_000) return Math.round(amount / 500) * 500;
  if (amount < 1_00_000) return Math.round(amount / 1_000) * 1_000;
  return Math.round(amount / 5_000) * 5_000;
}
