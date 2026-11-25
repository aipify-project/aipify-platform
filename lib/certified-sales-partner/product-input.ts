/**
 * Platform "product for sale" input validation — pure. Used by the Platform Admin
 * action panel (client pre-check) and `POST /api/platform/sellers/products` (authoritative).
 */
export type CspSalesProductInput = {
  productKey?: unknown;
  title?: unknown;
  currency?: unknown;
  fixedCommissionAmount?: unknown;
  published?: unknown;
};

export type CspSalesProductPayload = {
  productKey: string;
  title: string;
  currency: string;
  fixedCommissionAmount: number;
  published: boolean;
};

export type CspSalesProductResult =
  | { ok: true; payload: CspSalesProductPayload }
  | { ok: false; error: string; field?: string };

const PRODUCT_KEY_RE = /^[a-z0-9][a-z0-9_-]{1,63}$/;

export function validateSalesProductInput(input: CspSalesProductInput): CspSalesProductResult {
  const fail = (field: string, error: string): CspSalesProductResult => ({ ok: false, error, field });

  const productKey = typeof input?.productKey === "string" ? input.productKey.trim().toLowerCase() : "";
  if (!PRODUCT_KEY_RE.test(productKey)) return fail("productKey", "product_key_invalid");

  const title = typeof input?.title === "string" ? input.title.trim() : "";
  if (title.length < 2 || title.length > 160) return fail("title", "title_required");

  const currency = typeof input?.currency === "string" ? input.currency.trim().toUpperCase() : "";
  if (!/^[A-Z]{3}$/.test(currency)) return fail("currency", "currency_must_be_three_letter_code");

  const rawAmount = input?.fixedCommissionAmount;
  const amount =
    typeof rawAmount === "number"
      ? rawAmount
      : typeof rawAmount === "string" && rawAmount.trim() !== ""
        ? Number(rawAmount.replace(",", "."))
        : Number.NaN;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) {
    return fail("fixedCommissionAmount", "fixed_commission_amount_invalid");
  }
  // Money is stored with at most two decimals.
  const rounded = Math.round(amount * 100) / 100;
  if (Math.abs(rounded - amount) > 1e-9) return fail("fixedCommissionAmount", "fixed_commission_amount_invalid");

  if (typeof input?.published !== "boolean") return fail("published", "published_flag_required");

  return {
    ok: true,
    payload: { productKey, title, currency, fixedCommissionAmount: rounded, published: input.published },
  };
}
