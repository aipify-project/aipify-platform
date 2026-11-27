/**
 * Locale-aware quota unit labels for Product Center catalog surfaces.
 * Internal unit keys stay English (`answers`); UI never shows the raw key.
 */

const ANSWERS_BY_LOCALE: Record<string, string> = {
  en: "answers",
  no: "svar",
  sv: "svar",
  da: "svar",
  pl: "odpowiedzi",
  uk: "відповідей",
  es: "respuestas",
};

/** Resolve a storage unit key (e.g. `answers`) to a customer-facing label. */
export function localizeQuotaUnit(unit: string | null | undefined, locale: string): string | null {
  if (!unit) return null;
  const key = unit.trim().toLowerCase();
  if (key === "answers" || key === "answer") {
    const base = locale.split("-")[0]?.toLowerCase() ?? "en";
    return ANSWERS_BY_LOCALE[base] ?? ANSWERS_BY_LOCALE.en;
  }
  return unit;
}

/** True when the variant has a positive customer price on any billed interval. */
export function variantHasPaidCustomerPrice(variant: {
  monthlyPrice: { amountMajor: number | null } | null;
  yearlyPrice: { amountMajor: number | null } | null;
  oneTimePrice?: { amountMajor: number | null } | null;
}): boolean {
  const amounts = [
    variant.monthlyPrice?.amountMajor,
    variant.yearlyPrice?.amountMajor,
    variant.oneTimePrice?.amountMajor,
  ];
  return amounts.some((amount) => typeof amount === "number" && Number.isFinite(amount) && amount > 0);
}
