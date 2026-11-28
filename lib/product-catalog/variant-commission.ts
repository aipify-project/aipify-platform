/**
 * Variant × billing-interval seller commission — shared types for Opprett produkt
 * and Provisjonspriser. Core persistence is fail-closed until owner-approved SQL/RPC.
 *
 * Does not change historical product-level rates or qualified sales.
 */

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
 * Persistence gate — UI must not claim successful save of variant commissions
 * until Core RPCs exist and are owner-approved.
 */
export const VARIANT_COMMISSION_PERSISTENCE = {
  status: "blocked_needs_core_rpc" as const,
  canPersist: false as const,
  sqlDependencies: [
    "docs/platform/sql-candidates/csp_product_variants_billing_v1.sql",
    "docs/platform/sql-candidates/csp_variant_commission_rate_versions_v1.sql",
    "docs/platform/sql-candidates/NOT_APPLIED_csp_variant_commission_staging_verify_harness_v1.sql",
  ] as const,
};

export function canPersistVariantCommissionRules(): false {
  return VARIANT_COMMISSION_PERSISTENCE.canPersist;
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
