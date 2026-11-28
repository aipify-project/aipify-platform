/**
 * Server-side price / VAT / currency / discount validation — pure.
 * The client NEVER supplies an amount that is trusted; a claimed total is only compared.
 * VAT rate source is an open owner decision: it is injected (null => fail-closed).
 */

import { applyBasisPoints, divRoundHalfUp, normalizeCurrency } from "./money";
import type { PriceVersionMapping } from "./stripe-mapping";

export type ApprovedDiscount = {
  code: string;
  active: boolean;
  kind: "percent" | "fixed";
  /** percent: basis points of the net price (explicit 0 allowed). */
  basisPoints?: number | null;
  /** fixed: integer minor units off the net price (explicit 0 allowed). */
  amountMinor?: number | null;
  /** fixed discounts are currency-bound. */
  currency?: string | null;
  /** empty / undefined = any product. */
  productKeys?: readonly string[];
  validUntil?: string | null;
};

export type ServerPricing = {
  currency: string;
  listAmountMinor: number;
  vatLabel: "inclusive" | "exclusive";
  vatRateBp: number;
  discountCode: string | null;
  discountMinor: number;
  /** Net sale amount ex VAT after discount — the commission basis. */
  netAfterDiscountExVatMinor: number;
  vatMinor: number;
  grossMinor: number;
};

export type PricingFailure =
  | "vat_rate_not_configured"
  | "vat_rate_invalid"
  | "currency_mismatch"
  | "discount_not_found"
  | "discount_inactive"
  | "discount_expired"
  | "discount_product_not_eligible"
  | "discount_currency_mismatch"
  | "discount_value_invalid"
  | "zero_total_requires_explicit_free_grant"
  | "client_price_mismatch";

export function validateServerPricing(input: {
  mapping: PriceVersionMapping;
  /** Currency the buyer requested; must equal the mapping currency exactly. */
  requestedCurrency: string;
  /** null = not configured (fail-closed). 0 = explicit zero-rated. */
  vatRateBp: number | null | undefined;
  discountCode?: string | null;
  approvedDiscounts?: readonly ApprovedDiscount[];
  /** If provided, compared to the server total — never used as a price. */
  clientClaimedGrossMinor?: number | null;
  now: Date;
}): { ok: true; pricing: ServerPricing } | { ok: false; reason: PricingFailure } {
  const { mapping } = input;
  const currency = normalizeCurrency(input.requestedCurrency);
  if (!currency || currency !== mapping.currency) return { ok: false, reason: "currency_mismatch" };

  if (input.vatRateBp == null) return { ok: false, reason: "vat_rate_not_configured" };
  if (!Number.isInteger(input.vatRateBp) || input.vatRateBp < 0 || input.vatRateBp > 10000) {
    return { ok: false, reason: "vat_rate_invalid" };
  }
  const bp = input.vatRateBp;

  const listNet =
    mapping.vatLabel === "exclusive"
      ? mapping.amountMinor
      : divRoundHalfUp(mapping.amountMinor * 10000, 10000 + bp);

  let discountMinor = 0;
  let discountCode: string | null = null;
  const code = typeof input.discountCode === "string" ? input.discountCode.trim() : "";
  if (code) {
    const d = (input.approvedDiscounts ?? []).find((x) => x.code === code);
    if (!d) return { ok: false, reason: "discount_not_found" };
    if (!d.active) return { ok: false, reason: "discount_inactive" };
    if (d.validUntil && new Date(d.validUntil).getTime() <= input.now.getTime()) {
      return { ok: false, reason: "discount_expired" };
    }
    if (d.productKeys && d.productKeys.length > 0 && !d.productKeys.includes(mapping.productKey)) {
      return { ok: false, reason: "discount_product_not_eligible" };
    }
    if (d.kind === "percent") {
      if (d.basisPoints == null || !Number.isInteger(d.basisPoints) || d.basisPoints < 0 || d.basisPoints > 10000) {
        return { ok: false, reason: "discount_value_invalid" };
      }
      discountMinor = applyBasisPoints(listNet, d.basisPoints);
    } else {
      if (d.amountMinor == null || !Number.isInteger(d.amountMinor) || d.amountMinor < 0) {
        return { ok: false, reason: "discount_value_invalid" };
      }
      if (normalizeCurrency(d.currency) !== currency) return { ok: false, reason: "discount_currency_mismatch" };
      discountMinor = Math.min(d.amountMinor, listNet);
    }
    discountCode = code;
  }

  const net = listNet - discountMinor;
  let vat: number;
  let gross: number;
  if (mapping.vatLabel === "inclusive" && discountMinor === 0) {
    gross = mapping.amountMinor; // list price is exactly what the buyer sees
    vat = gross - net;
  } else {
    vat = applyBasisPoints(net, bp);
    gross = net + vat;
  }

  if (gross === 0) return { ok: false, reason: "zero_total_requires_explicit_free_grant" };

  if (input.clientClaimedGrossMinor != null && input.clientClaimedGrossMinor !== gross) {
    return { ok: false, reason: "client_price_mismatch" };
  }

  return {
    ok: true,
    pricing: {
      currency,
      listAmountMinor: mapping.amountMinor,
      vatLabel: mapping.vatLabel,
      vatRateBp: bp,
      discountCode,
      discountMinor,
      netAfterDiscountExVatMinor: net,
      vatMinor: vat,
      grossMinor: gross,
    },
  };
}
