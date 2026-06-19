/**
 * Shared currency and number formatting utilities.
 * Uses Intl.NumberFormat for locale-consistent output.
 */

/**
 * Formats a number as ARS currency string.
 * Handles 0, negatives, and numbers with >2 decimal places (rounds to 2 dp).
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formats large numbers in compact form for chart axis labels.
 * e.g. 1200 → "$1.2K", 3500000 → "$3.5M"
 */
export const formatCompactCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

/**
 * Formats a number as a percentage string.
 * e.g. formatPercent(42) → "42%", formatPercent(42.5, 1) → "42.5%"
 */
export const formatPercent = (value: number, decimals = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formats a plain number with locale-aware thousands separator.
 */
export const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};
