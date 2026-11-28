/**
 * Variant × billing-interval seller commission — shared types for Opprett produkt
 * and Provisjonspriser. Staging Core may persist; Production stays fail-closed.
 *
 * Does not change historical product-level rates or qualified sales.
 */

import { resolveVariantCommissionPersistCapability } from "@/lib/product-catalog/variant-commission-core-gate";

/** Mirrors ProductBillingInterval — kept local to avoid circular import with variants.ts. */
export type VariantCommissionBillingInterval = "month" | "year" | "one_time";

export const VARIANT_COMMISSION_PERCENT_BASIS = "net_ex_vat_after_discount" as const;

export type VariantCommissionModel = "fixed" | "percent";

/** Draft / display rule for one (variant, interval). Amounts are exclusive of VAT. */
export type VariantIntervalCommissionRule = {
  active: boolean;
  model: VariantCommissionModel;
  /** Fixed NOK (major units), ex VAT. Use 0 for free variants. */
  amountMajor: number | null;
  /** Percent of net sales amount ex VAT (0–100). */
  ratePct: number | null;
  currency: string;
  percentBasis: typeof VARIANT_COMMISSION_PERCENT_BASIS;
};

export type VariantCommissionByInterval = {
  month: VariantIntervalCommissionRule | null;
  year: VariantIntervalCommissionRule | null;
  one_time: VariantIntervalCommissionRule | null;
};

/**
 * Persistence gate — Staging Core env may attempt Core RPCs.
 * Production and unbound envs stay fail-closed (never claim save success).
 */
export const VARIANT_COMMISSION_PERSISTENCE = {
  get status(): "staging_core_enabled" | "production_fail_closed" | "blocked_needs_core_rpc" {
    const cap = resolveVariantCommissionPersistCapability();
    if (cap.stagingBound) return "staging_core_enabled";
    if (cap.productionBound) return "production_fail_closed";
    return "blocked_needs_core_rpc";
  },
  get canPersist(): boolean {
    return resolveVariantCommissionPersistCapability().canAttemptPersist;
  },
  sqlDependencies: [
    "docs/platform/sql-candidates/csp_product_variants_billing_v1.sql",
    "docs/platform/sql-candidates/csp_variant_commission_rate_versions_v1.sql",
    "docs/platform/sql-candidates/NOT_APPLIED_csp_variant_commission_staging_verify_harness_v1.sql",
  ] as const,
};

/** True only when Staging Core is bound. Production always false. */
export function canPersistVariantCommissionRules(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
): boolean {
  return resolveVariantCommissionPersistCapability(url).canAttemptPersist;
}

export function emptyVariantCommissionRule(
  currency = "NOK",
): VariantIntervalCommissionRule {
  return {
    active: true,
    model: "fixed",
    amountMajor: 0,
    ratePct: null,
    currency,
    percentBasis: VARIANT_COMMISSION_PERCENT_BASIS,
  };
}

export function normalizeVariantCommissionRule(
  input: Partial<VariantIntervalCommissionRule> | null | undefined,
  currency = "NOK",
): VariantIntervalCommissionRule {
  const base = emptyVariantCommissionRule(currency);
  if (!input) return base;
  const model: VariantCommissionModel = input.model === "percent" ? "percent" : "fixed";
  if (model === "fixed") {
    const amount =
      input.amountMajor != null && Number.isFinite(input.amountMajor)
        ? Math.max(0, Number(input.amountMajor))
        : 0;
    return {
      ...base,
      active: input.active !== false,
      model: "fixed",
      amountMajor: amount,
      ratePct: null,
      currency: (input.currency || currency).toUpperCase(),
    };
  }
  const rate =
    input.ratePct != null && Number.isFinite(input.ratePct)
      ? Math.min(100, Math.max(0, Number(input.ratePct)))
      : 0;
  return {
    ...base,
    active: input.active !== false,
    model: "percent",
    amountMajor: null,
    ratePct: rate,
    currency: (input.currency || currency).toUpperCase(),
    percentBasis: VARIANT_COMMISSION_PERCENT_BASIS,
  };
}

/**
 * Preview commission in major units, exclusive of VAT.
 * Percent uses the interval price (also ex VAT). Never used for settlement.
 */
export function previewVariantCommissionExVat(input: {
  rule: VariantIntervalCommissionRule | null | undefined;
  priceAmountMajor: number | null | undefined;
}): {
  amountMajor: number | null;
  currency: string | null;
  model: VariantCommissionModel | null;
  inactive: boolean;
} {
  const rule = input.rule;
  if (!rule) {
    return { amountMajor: null, currency: null, model: null, inactive: true };
  }
  if (!rule.active) {
    return {
      amountMajor: 0,
      currency: rule.currency,
      model: rule.model,
      inactive: true,
    };
  }
  if (rule.model === "fixed") {
    const amount = rule.amountMajor != null && Number.isFinite(rule.amountMajor) ? rule.amountMajor : 0;
    return {
      amountMajor: amount,
      currency: rule.currency,
      model: "fixed",
      inactive: false,
    };
  }
  const price =
    input.priceAmountMajor != null && Number.isFinite(input.priceAmountMajor)
      ? Number(input.priceAmountMajor)
      : null;
  const rate = rule.ratePct != null && Number.isFinite(rule.ratePct) ? Number(rule.ratePct) : null;
  if (price == null || rate == null) {
    return {
      amountMajor: null,
      currency: rule.currency,
      model: "percent",
      inactive: false,
    };
  }
  // Display preview only — half-up to 2 decimals in major units.
  const raw = (price * rate) / 100;
  const amountMajor = Math.round(raw * 100) / 100;
  return {
    amountMajor,
    currency: rule.currency,
    model: "percent",
    inactive: false,
  };
}

export function commissionIntervals(): VariantCommissionBillingInterval[] {
  return ["month", "year", "one_time"];
}

/** Document-only: existing product-level rates that need explicit variant mapping before backfill. */
export type LegacyProductCommissionMappingNeed = {
  productKey: string;
  fixedCommissionAmount: number;
  currency: string;
  mappingStatus: "requires_explicit_variant_mapping_before_backfill";
};

export const LEGACY_PRODUCT_COMMISSION_RATES_NEEDING_VARIANT_MAPPING: readonly LegacyProductCommissionMappingNeed[] =
  [
    {
      productKey: "kompis_web",
      fixedCommissionAmount: 500,
      currency: "NOK",
      mappingStatus: "requires_explicit_variant_mapping_before_backfill",
    },
    {
      productKey: "kompis_bedrift",
      fixedCommissionAmount: 800,
      currency: "NOK",
      mappingStatus: "requires_explicit_variant_mapping_before_backfill",
    },
    {
      productKey: "aipify_voice",
      fixedCommissionAmount: 0,
      currency: "NOK",
      mappingStatus: "requires_explicit_variant_mapping_before_backfill",
    },
  ];
