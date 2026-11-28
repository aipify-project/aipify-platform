/**
 * C. Product Center → Stripe price mapping contract.
 *
 * - Authoritative key: productKey + variantKey + interval + currency.
 * - Integer minor units. Explicit 0 (free access) is NOT null (not configured).
 * - No fallback prices: monthly never stands in for yearly, currency never guessed.
 * - Price versions are immutable: a changed amount yields a NEW priceVersionId; old rows are untouched.
 * - NO live Stripe creates / mutations / secrets. Live adapter is disabled; test adapter is in-memory.
 */

import { createHash } from "node:crypto";
import type { ProductVariantDefinition, ProductVariantPrice } from "@/lib/product-catalog/variants";
import { CSP_STRIPE_LIVE_WIRING_ENABLED } from "@/lib/certified-sales-partner/stripe-adapter";
import { majorToMinorExact, normalizeCurrency, parseMinorAmount } from "./money";

export type BillingInterval = "month" | "year" | "one_time";

export type VatLabel = "inclusive" | "exclusive";

export type PriceVersionMapping = {
  priceVersionId: string;
  productKey: string;
  variantKey: string;
  interval: BillingInterval;
  currency: string;
  amountMinor: number;
  vatLabel: VatLabel;
  /** Provider (Stripe) price id. null until a mapping adapter bound one. */
  providerPriceId: string | null;
  status: "active" | "archived";
  supersedesPriceVersionId: string | null;
};

export type MappingBlockReason =
  | "variant_inactive"
  | "amount_missing"
  | "amount_negative"
  | "amount_not_exact_minor"
  | "major_minor_mismatch"
  | "currency_invalid"
  | "vat_label_unknown";

export type PriceMappingPlanEntry =
  | {
      kind: "paid";
      priceVersionId: string;
      productKey: string;
      variantKey: string;
      interval: BillingInterval;
      currency: string;
      amountMinor: number;
      vatLabel: VatLabel;
      action: "reuse_existing" | "create_provider_price_required";
      providerPriceId: string | null;
      supersedesPriceVersionId: string | null;
    }
  | {
      kind: "free_access";
      productKey: string;
      variantKey: string;
      interval: BillingInterval;
      currency: string;
      /** Explicit zero. No provider price is created for free access. */
      amountMinor: 0;
      vatLabel: VatLabel | null;
      action: "explicit_free_access_no_provider_price";
    }
  | {
      kind: "blocked";
      productKey: string;
      variantKey: string;
      interval: BillingInterval;
      reason: MappingBlockReason;
    };

export type PriceMappingPlan = {
  entries: PriceMappingPlanEntry[];
  paidCount: number;
  freeAccessCount: number;
  blockedCount: number;
  /** Always false in this contract: plan only, no provider writes. */
  providerWritesPerformed: false;
};

/** Deterministic, content-addressed id: any change of any priced field => a new version. */
export function computePriceVersionId(input: {
  productKey: string;
  variantKey: string;
  interval: BillingInterval;
  currency: string;
  amountMinor: number;
  vatLabel: VatLabel;
}): string {
  const canonical = [
    input.productKey,
    input.variantKey,
    input.interval,
    input.currency.toUpperCase(),
    String(input.amountMinor),
    input.vatLabel,
  ].join("|");
  return `pv_${createHash("sha256").update(canonical).digest("hex").slice(0, 20)}`;
}

function resolveMinor(price: ProductVariantPrice, currency: string):
  | { ok: true; amountMinor: number }
  | { ok: false; reason: MappingBlockReason } {
  const hasMinor = price.amountMinor != null;
  const hasMajor = price.amountMajor != null;
  if (!hasMinor && !hasMajor) return { ok: false, reason: "amount_missing" };

  let fromMinor: number | null = null;
  if (hasMinor) {
    const p = parseMinorAmount(price.amountMinor);
    if (!p.ok) {
      return {
        ok: false,
        reason: p.reason === "negative" ? "amount_negative" : p.reason === "missing" ? "amount_missing" : "amount_not_exact_minor",
      };
    }
    fromMinor = p.value;
  }
  let fromMajor: number | null = null;
  if (hasMajor) {
    const p = majorToMinorExact(price.amountMajor, currency);
    if (!p.ok) {
      return {
        ok: false,
        reason: p.reason === "negative" ? "amount_negative" : p.reason === "missing" ? "amount_missing" : "amount_not_exact_minor",
      };
    }
    fromMajor = p.value;
  }
  if (fromMinor != null && fromMajor != null && fromMinor !== fromMajor) {
    return { ok: false, reason: "major_minor_mismatch" };
  }
  return { ok: true, amountMinor: (fromMinor ?? fromMajor) as number };
}

const INTERVAL_PRICE_FIELD: ReadonlyArray<[BillingInterval, "monthlyPrice" | "yearlyPrice" | "oneTimePrice"]> = [
  ["month", "monthlyPrice"],
  ["year", "yearlyPrice"],
  ["one_time", "oneTimePrice"],
];

/**
 * Plan the provider mapping for Core variants. Pure: reads Core-shaped variants and existing
 * mappings, returns what WOULD be needed. Never calls a provider.
 */
export function planProductCenterStripeMapping(input: {
  variants: readonly ProductVariantDefinition[];
  existingMappings?: readonly PriceVersionMapping[];
}): PriceMappingPlan {
  const existing = input.existingMappings ?? [];
  const entries: PriceMappingPlanEntry[] = [];

  for (const variant of input.variants) {
    for (const [interval, field] of INTERVAL_PRICE_FIELD) {
      const price = variant[field];
      if (!price) continue; // interval not offered — nothing to map, no fallback from another interval
      if (!variant.active) {
        entries.push({ kind: "blocked", productKey: variant.productKey, variantKey: variant.variantKey, interval, reason: "variant_inactive" });
        continue;
      }
      const currency = normalizeCurrency(price.currency);
      if (!currency) {
        entries.push({ kind: "blocked", productKey: variant.productKey, variantKey: variant.variantKey, interval, reason: "currency_invalid" });
        continue;
      }
      const minor = resolveMinor(price, currency);
      if (!minor.ok) {
        entries.push({ kind: "blocked", productKey: variant.productKey, variantKey: variant.variantKey, interval, reason: minor.reason });
        continue;
      }
      if (minor.amountMinor === 0) {
        entries.push({
          kind: "free_access",
          productKey: variant.productKey,
          variantKey: variant.variantKey,
          interval,
          currency,
          amountMinor: 0,
          vatLabel: price.vatLabel === "unknown" ? null : price.vatLabel,
          action: "explicit_free_access_no_provider_price",
        });
        continue;
      }
      if (price.vatLabel === "unknown") {
        entries.push({ kind: "blocked", productKey: variant.productKey, variantKey: variant.variantKey, interval, reason: "vat_label_unknown" });
        continue;
      }
      const priceVersionId = computePriceVersionId({
        productKey: variant.productKey,
        variantKey: variant.variantKey,
        interval,
        currency,
        amountMinor: minor.amountMinor,
        vatLabel: price.vatLabel,
      });
      const same = existing.find((m) => m.priceVersionId === priceVersionId && m.status === "active");
      const prior = existing.find(
        (m) =>
          m.productKey === variant.productKey &&
          m.variantKey === variant.variantKey &&
          m.interval === interval &&
          m.currency === currency &&
          m.status === "active" &&
          m.priceVersionId !== priceVersionId,
      );
      entries.push({
        kind: "paid",
        priceVersionId,
        productKey: variant.productKey,
        variantKey: variant.variantKey,
        interval,
        currency,
        amountMinor: minor.amountMinor,
        vatLabel: price.vatLabel,
        action: same?.providerPriceId ? "reuse_existing" : "create_provider_price_required",
        providerPriceId: same?.providerPriceId ?? null,
        supersedesPriceVersionId: same ? null : prior?.priceVersionId ?? null,
      });
    }
  }

  return {
    entries,
    paidCount: entries.filter((e) => e.kind === "paid").length,
    freeAccessCount: entries.filter((e) => e.kind === "free_access").length,
    blockedCount: entries.filter((e) => e.kind === "blocked").length,
    providerWritesPerformed: false,
  };
}

/** A mapping record is immutable once created: same id must carry the same priced fields. */
export function assertPriceVersionImmutable(
  existing: PriceVersionMapping,
  candidate: Pick<PriceVersionMapping, "priceVersionId" | "amountMinor" | "currency" | "vatLabel" | "interval" | "productKey" | "variantKey">,
): { ok: true } | { ok: false; reason: "price_version_mutation_forbidden" } {
  if (existing.priceVersionId !== candidate.priceVersionId) return { ok: true };
  const same =
    existing.amountMinor === candidate.amountMinor &&
    existing.currency === candidate.currency &&
    existing.vatLabel === candidate.vatLabel &&
    existing.interval === candidate.interval &&
    existing.productKey === candidate.productKey &&
    existing.variantKey === candidate.variantKey;
  return same ? { ok: true } : { ok: false, reason: "price_version_mutation_forbidden" };
}

// ---------------------------------------------------------------------------
// Runtime lookup index — no fallback prices.
// ---------------------------------------------------------------------------

export type PriceMappingIndex = {
  byProviderPriceId: ReadonlyMap<string, PriceVersionMapping>;
  byPriceVersionId: ReadonlyMap<string, PriceVersionMapping>;
  records: readonly PriceVersionMapping[];
};

export function buildPriceMappingIndex(records: readonly PriceVersionMapping[]): PriceMappingIndex {
  const byProvider = new Map<string, PriceVersionMapping>();
  const byVersion = new Map<string, PriceVersionMapping>();
  for (const r of records) {
    byVersion.set(r.priceVersionId, r);
    if (r.providerPriceId) byProvider.set(r.providerPriceId, r);
  }
  return { byProviderPriceId: byProvider, byPriceVersionId: byVersion, records };
}

export type ResolvePriceResult =
  | { ok: true; mapping: PriceVersionMapping }
  | { ok: false; reason: "mapping_missing" | "mapping_ambiguous" | "provider_price_not_bound" | "currency_invalid" };

/** Exact (product, variant, interval, currency) active match. Never falls back. */
export function resolveMappedPrice(
  index: PriceMappingIndex,
  key: { productKey: string; variantKey: string; interval: BillingInterval; currency: string },
): ResolvePriceResult {
  const currency = normalizeCurrency(key.currency);
  if (!currency) return { ok: false, reason: "currency_invalid" };
  const hits = index.records.filter(
    (r) =>
      r.status === "active" &&
      r.productKey === key.productKey &&
      r.variantKey === key.variantKey &&
      r.interval === key.interval &&
      r.currency === currency,
  );
  if (hits.length === 0) return { ok: false, reason: "mapping_missing" };
  if (hits.length > 1) return { ok: false, reason: "mapping_ambiguous" };
  if (!hits[0].providerPriceId) return { ok: false, reason: "provider_price_not_bound" };
  return { ok: true, mapping: hits[0] };
}

// ---------------------------------------------------------------------------
// Adapters — live is disabled; test adapter is offline and in-memory.
// ---------------------------------------------------------------------------

export type EnsureProviderPriceResult =
  | { ok: true; providerPriceId: string; fixture: boolean }
  | { ok: false; reason: "live_stripe_disabled" | "plan_not_paid" };

export type ProviderPriceAdapter = {
  readonly isLive: boolean;
  ensurePrice(entry: PriceMappingPlanEntry): Promise<EnsureProviderPriceResult>;
};

export const LIVE_PRICE_ADAPTER_DISABLED: ProviderPriceAdapter = {
  isLive: false,
  async ensurePrice() {
    return { ok: false, reason: "live_stripe_disabled" };
  },
};

/** Offline fixture adapter — ids are clearly fake (`price_fixture_*`) and idempotent per version. */
export function createTestPriceAdapter(): ProviderPriceAdapter & { created: ReadonlyMap<string, string> } {
  const created = new Map<string, string>();
  return {
    isLive: false,
    created,
    async ensurePrice(entry) {
      if (entry.kind !== "paid") return { ok: false, reason: "plan_not_paid" };
      const existing = created.get(entry.priceVersionId);
      if (existing) return { ok: true, providerPriceId: existing, fixture: true };
      const id = `price_fixture_${entry.priceVersionId}`;
      created.set(entry.priceVersionId, id);
      return { ok: true, providerPriceId: id, fixture: true };
    },
  };
}

export function isLiveStripeMappingEnabled(): false {
  // Both switches must be separately owner-approved; this contract never enables either.
  return CSP_STRIPE_LIVE_WIRING_ENABLED as false;
}
