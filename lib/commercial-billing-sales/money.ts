/**
 * Integer minor-unit money helpers — pure.
 * Rules: explicit 0 is a valid amount; null / undefined / NaN means "not configured".
 * No fallback prices. No floating point amounts leave this module.
 */

export type MinorParseResult =
  | { ok: true; value: number }
  | { ok: false; reason: "missing" | "not_integer" | "negative" };

const ZERO_DECIMAL_CURRENCIES = new Set(["JPY", "KRW", "ISK", "VND", "CLP", "UGX", "XAF", "XOF"]);
const THREE_DECIMAL_CURRENCIES = new Set(["BHD", "JOD", "KWD", "OMR", "TND"]);

export function normalizeCurrency(raw: string | null | undefined): string | null {
  if (typeof raw !== "string") return null;
  const code = raw.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : null;
}

export function currencyExponent(currency: string): number {
  const code = currency.trim().toUpperCase();
  if (ZERO_DECIMAL_CURRENCIES.has(code)) return 0;
  if (THREE_DECIMAL_CURRENCIES.has(code)) return 3;
  return 2;
}

/** null / undefined / NaN → missing. 0 → ok(0). */
export function parseMinorAmount(raw: number | null | undefined): MinorParseResult {
  if (raw == null || typeof raw !== "number" || Number.isNaN(raw)) return { ok: false, reason: "missing" };
  if (!Number.isFinite(raw) || !Number.isInteger(raw)) return { ok: false, reason: "not_integer" };
  if (raw < 0) return { ok: false, reason: "negative" };
  return { ok: true, value: raw };
}

/**
 * Convert major units to exact minor units. Rejects values that are not exactly
 * representable (e.g. 599.999 in a two-decimal currency) — never silently rounds a price.
 */
export function majorToMinorExact(
  major: number | null | undefined,
  currency: string,
): MinorParseResult {
  if (major == null || typeof major !== "number" || Number.isNaN(major)) {
    return { ok: false, reason: "missing" };
  }
  if (!Number.isFinite(major)) return { ok: false, reason: "not_integer" };
  if (major < 0) return { ok: false, reason: "negative" };
  const exp = currencyExponent(currency);
  const scaled = major * 10 ** exp;
  const rounded = Math.round(scaled);
  if (Math.abs(scaled - rounded) > 1e-6) return { ok: false, reason: "not_integer" };
  return { ok: true, value: rounded };
}

/** Round-half-up integer division for non-negative integers. */
export function divRoundHalfUp(numerator: number, denominator: number): number {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator <= 0) {
    throw new RangeError("divRoundHalfUp requires integer numerator and positive integer denominator");
  }
  return Math.floor((numerator * 2 + denominator) / (denominator * 2));
}

/** basis points of an integer minor amount, rounded half up. 10000 bp = 100%. */
export function applyBasisPoints(amountMinor: number, basisPoints: number): number {
  if (!Number.isInteger(amountMinor) || amountMinor < 0) throw new RangeError("invalid amountMinor");
  if (!Number.isInteger(basisPoints) || basisPoints < 0) throw new RangeError("invalid basisPoints");
  return divRoundHalfUp(amountMinor * basisPoints, 10000);
}
