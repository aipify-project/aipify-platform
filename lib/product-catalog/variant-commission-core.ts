/**
 * Shared Core load/save for product variants + interval commission rules.
 * Used by Opprett/Rediger produkt and Provisjonspriser.
 *
 * Never activates settlement earn path. Never creates Stripe objects.
 * Production env stays fail-closed via variant-commission-core-gate.
 */

import { callCspRpc, type CspRpcClient, type CspRpcResult } from "@/lib/certified-sales-partner/core-rpc";
import {
  normalizeVariantCommissionRule,
  VARIANT_COMMISSION_PERCENT_BASIS,
  type VariantIntervalCommissionRule,
} from "@/lib/product-catalog/variant-commission";
import { resolveVariantCommissionPersistCapability } from "@/lib/product-catalog/variant-commission-core-gate";
import type {
  ProductBillingInterval,
  ProductVariantDefinition,
  ProductVariantPrice,
  ProductVariantQuotaKind,
} from "@/lib/product-catalog/variants";

export const VARIANT_COMMISSION_CORE_RPCS = [
  "get_csp_product_variants_bundle",
  "upsert_csp_product_variant",
  "upsert_csp_product_variant_price",
  "list_csp_variant_commission_rates",
  "upsert_csp_variant_commission_rate",
  "get_effective_csp_variant_commission",
] as const;

export type CoreVariantPriceRow = {
  billing_interval?: string;
  currency?: string;
  amount_minor?: number | null;
  amount_major?: number | null;
  vat_label?: string;
  provider_price_id?: string | null;
  purchasable?: boolean;
  active?: boolean;
};

export type CoreVariantCommissionRuleRow = {
  id?: string;
  billing_interval?: string;
  model?: string;
  amount?: number | null;
  rate_pct?: number | null;
  currency?: string;
  percent_basis?: string | null;
  active?: boolean;
  effective_from?: string;
};

export type CoreVariantRow = {
  variant_key?: string;
  admin_name?: string;
  customer_label?: string;
  sort_order?: number;
  active?: boolean;
  recommended?: boolean;
  quota_value?: number | null;
  quota_unit?: string | null;
  quota_kind?: string;
  annual_renews_quota_monthly?: boolean;
  features?: unknown;
  prices?: CoreVariantPriceRow[];
  commission_rules?: CoreVariantCommissionRuleRow[];
};

export type CoreVariantsBundle = {
  product_key?: string;
  product_id?: string | null;
  variants?: CoreVariantRow[];
  persistence?: string;
  settlement_activated?: boolean;
};

export type VariantCommissionListRow = {
  id: string;
  productId: string;
  productKey: string | null;
  variantKey: string;
  billingInterval: ProductBillingInterval;
  model: "fixed" | "percent";
  amount: number | null;
  ratePct: number | null;
  currency: string;
  percentBasis: string | null;
  active: boolean;
  effectiveFrom: string | null;
  createdAt: string | null;
  vatLabel: "exclusive";
};

function asInterval(raw: string | undefined): ProductBillingInterval | null {
  if (raw === "month" || raw === "year" || raw === "one_time") return raw;
  return null;
}

function asQuotaKind(raw: string | null | undefined): ProductVariantQuotaKind {
  if (
    raw === "lifetime_total" ||
    raw === "monthly_renewing" ||
    raw === "annual_pool" ||
    raw === "unit_count" ||
    raw === "none"
  ) {
    return raw;
  }
  return "none";
}

function featuresFromCore(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((v): v is string => typeof v === "string");
}

function commissionFromCore(
  rows: CoreVariantCommissionRuleRow[] | undefined,
  interval: ProductBillingInterval,
  fallbackCurrency: string,
): VariantIntervalCommissionRule | null {
  const match = (rows ?? []).find((r) => r.billing_interval === interval);
  if (!match) return null;
  return normalizeVariantCommissionRule(
    {
      active: match.active !== false,
      model: match.model === "percent" ? "percent" : "fixed",
      amountMajor: match.amount == null ? null : Number(match.amount),
      ratePct: match.rate_pct == null ? null : Number(match.rate_pct),
      currency: (match.currency || fallbackCurrency).toUpperCase(),
      percentBasis: VARIANT_COMMISSION_PERCENT_BASIS,
    },
    fallbackCurrency,
  );
}

function priceFromCore(
  rows: CoreVariantPriceRow[] | undefined,
  interval: ProductBillingInterval,
  commission: VariantIntervalCommissionRule | null,
): ProductVariantPrice | null {
  const match = (rows ?? []).find((r) => r.billing_interval === interval);
  if (!match) {
    return commission
      ? {
          currency: commission.currency,
          amountMajor: null,
          amountMinor: null,
          interval,
          vatLabel: "exclusive",
          providerPriceId: null,
          purchasable: false,
          commission,
        }
      : null;
  }
  const currency = (match.currency || commission?.currency || "NOK").toUpperCase();
  const amountMajor =
    match.amount_major != null && Number.isFinite(Number(match.amount_major))
      ? Number(match.amount_major)
      : null;
  const amountMinor =
    match.amount_minor != null && Number.isFinite(Number(match.amount_minor))
      ? Number(match.amount_minor)
      : amountMajor != null
        ? Math.round(amountMajor * 100)
        : null;
  const vat =
    match.vat_label === "inclusive" || match.vat_label === "exclusive"
      ? match.vat_label
      : "exclusive";
  return {
    currency,
    amountMajor,
    amountMinor,
    interval,
    vatLabel: vat,
    providerPriceId: match.provider_price_id ?? null,
    purchasable: false,
    commission,
  };
}

/** Map Core bundle variants into editor ProductVariantDefinition[]. */
export function mapCoreBundleToVariantDefinitions(
  bundle: CoreVariantsBundle | null | undefined,
  productKey: string,
): ProductVariantDefinition[] {
  const rows = bundle?.variants ?? [];
  return rows
    .map((row): ProductVariantDefinition | null => {
      const variantKey = typeof row.variant_key === "string" ? row.variant_key.trim() : "";
      if (!variantKey) return null;
      const rules = row.commission_rules;
      const currencyGuess =
        row.prices?.find((p) => p.currency)?.currency?.toUpperCase() ||
        rules?.find((r) => r.currency)?.currency?.toUpperCase() ||
        "NOK";
      const monthRule = commissionFromCore(rules, "month", currencyGuess);
      const yearRule = commissionFromCore(rules, "year", currencyGuess);
      const oneTimeRule = commissionFromCore(rules, "one_time", currencyGuess);
      return {
        variantKey,
        productKey: productKey || String(bundle?.product_key ?? ""),
        adminName: String(row.admin_name ?? ""),
        customerLabel: String(row.customer_label ?? ""),
        sortOrder: Number.isFinite(Number(row.sort_order)) ? Number(row.sort_order) : 0,
        active: row.active !== false,
        recommended: row.recommended === true,
        quotaValue:
          row.quota_value == null || !Number.isFinite(Number(row.quota_value))
            ? null
            : Number(row.quota_value),
        quotaUnit: row.quota_unit == null ? null : String(row.quota_unit),
        quotaKind: asQuotaKind(row.quota_kind),
        annualRenewsQuotaMonthly: row.annual_renews_quota_monthly === true,
        monthlyPrice: priceFromCore(row.prices, "month", monthRule),
        yearlyPrice: priceFromCore(row.prices, "year", yearRule),
        oneTimePrice: priceFromCore(row.prices, "one_time", oneTimeRule),
        features: featuresFromCore(row.features),
      };
    })
    .filter((v): v is ProductVariantDefinition => v != null)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.variantKey.localeCompare(b.variantKey));
}

export function mapCoreListToVariantCommissionRows(raw: unknown): VariantCommissionListRow[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const r = item as Record<string, unknown>;
    const interval = asInterval(typeof r.billing_interval === "string" ? r.billing_interval : undefined);
    const id = typeof r.id === "string" ? r.id : "";
    const productId = typeof r.product_id === "string" ? r.product_id : "";
    const variantKey = typeof r.variant_key === "string" ? r.variant_key : "";
    if (!id || !productId || !variantKey || !interval) return [];
    const model = r.model === "percent" ? "percent" : "fixed";
    return [
      {
        id,
        productId,
        productKey: typeof r.product_key === "string" ? r.product_key : null,
        variantKey,
        billingInterval: interval,
        model,
        amount: r.amount == null ? null : Number(r.amount),
        ratePct: r.rate_pct == null ? null : Number(r.rate_pct),
        currency: typeof r.currency === "string" ? r.currency.toUpperCase() : "NOK",
        percentBasis: typeof r.percent_basis === "string" ? r.percent_basis : null,
        active: r.active !== false,
        effectiveFrom: typeof r.effective_from === "string" ? r.effective_from : null,
        createdAt: typeof r.created_at === "string" ? r.created_at : null,
        vatLabel: "exclusive" as const,
      },
    ];
  });
}

export function parseVariantsJsonInput(raw: unknown): {
  ok: true;
  variants: ProductVariantDefinition[];
} | { ok: false; error: string } {
  if (raw == null || raw === "") {
    return { ok: true, variants: [] };
  }
  let parsed: unknown = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { ok: false, error: "invalid_variants_json" };
    }
  }
  if (!Array.isArray(parsed)) {
    return { ok: false, error: "variants_must_be_array" };
  }
  const variants: ProductVariantDefinition[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") {
      return { ok: false, error: "invalid_variant_row" };
    }
    const row = item as ProductVariantDefinition;
    const variantKey = typeof row.variantKey === "string" ? row.variantKey.trim() : "";
    if (!variantKey) {
      return { ok: false, error: "variant_key_required" };
    }
    variants.push(row);
  }
  return { ok: true, variants };
}

function commissionPayloadArgs(rule: VariantIntervalCommissionRule): {
  p_model: string;
  p_amount: number | null;
  p_rate_pct: number | null;
  p_active: boolean;
  p_currency: string;
} {
  const normalized = normalizeVariantCommissionRule(rule, rule.currency);
  if (normalized.model === "fixed") {
    return {
      p_model: "fixed",
      p_amount: normalized.amountMajor ?? 0,
      p_rate_pct: null,
      p_active: normalized.active,
      p_currency: normalized.currency,
    };
  }
  return {
    p_model: "percent",
    p_amount: null,
    p_rate_pct: normalized.ratePct ?? 0,
    p_active: normalized.active,
    p_currency: normalized.currency,
  };
}

function sameCommission(
  current: {
    model?: string;
    amount?: number | null;
    rate_pct?: number | null;
    active?: boolean;
    currency?: string;
  } | null,
  rule: VariantIntervalCommissionRule,
): boolean {
  if (!current) return false;
  const next = commissionPayloadArgs(rule);
  if ((current.model || "") !== next.p_model) return false;
  if (Boolean(current.active) !== next.p_active) return false;
  if ((current.currency || "").toUpperCase() !== next.p_currency) return false;
  if (next.p_model === "fixed") {
    return Number(current.amount ?? NaN) === Number(next.p_amount);
  }
  return Number(current.rate_pct ?? NaN) === Number(next.p_rate_pct);
}

export type PersistVariantsError = {
  ok: false;
  error:
    | "production_fail_closed"
    | "persist_env_disabled"
    | "rpc_missing"
    | "rpc_error"
    | "forbidden"
    | "unauthorized"
    | "product_id_required"
    | "invalid_variants_json"
    | "variants_must_be_array"
    | "invalid_variant_row"
    | "variant_key_required"
    | "csp_backend_not_applied"
    | "partner_not_found"
    | "partner_not_active";
  detail?: string;
};

export type PersistVariantsSuccess = {
  ok: true;
  productKey: string;
  productId: string | null;
  variantsSaved: number;
  pricesSaved: number;
  commissionsSaved: number;
  commissionsUnchanged: number;
  settlementActivated: false;
};

export type PersistVariantsResult = PersistVariantsSuccess | PersistVariantsError;

function mapRpcError(
  result: Extract<CspRpcResult, { ready: false }>,
): PersistVariantsError {
  return {
    ok: false,
    error: result.error,
    detail: result.detail,
  };
}

type PersistEnvOptions = {
  /** Override for tests; defaults to NEXT_PUBLIC_SUPABASE_URL. */
  supabaseUrl?: string | null;
};

/** Probe whether required RPCs exist (Staging only). */
export async function probeVariantCommissionCoreRpcs(
  supabase: CspRpcClient,
  options?: PersistEnvOptions,
): Promise<{ ready: true } | PersistVariantsError> {
  const capability = resolveVariantCommissionPersistCapability(options?.supabaseUrl);
  if (capability.productionBound) {
    return { ok: false, error: "production_fail_closed" };
  }
  if (!capability.canAttemptPersist) {
    return { ok: false, error: "persist_env_disabled" };
  }
  const probe = await callCspRpc(supabase, "list_csp_variant_commission_rates", {
    p_product_id: null,
  });
  if (!probe.ready) {
    return mapRpcError(probe);
  }
  return { ready: true };
}

export async function loadProductVariantsBundle(
  supabase: CspRpcClient,
  productKey: string,
  options?: PersistEnvOptions,
): Promise<
  | { ok: true; bundle: CoreVariantsBundle; variants: ProductVariantDefinition[]; persistEnabled: boolean }
  | PersistVariantsError
> {
  const capability = resolveVariantCommissionPersistCapability(options?.supabaseUrl);
  if (capability.productionBound) {
    return { ok: false, error: "production_fail_closed" };
  }
  if (!capability.canAttemptPersist) {
    return { ok: false, error: "persist_env_disabled" };
  }
  const result = await callCspRpc<CoreVariantsBundle>(supabase, "get_csp_product_variants_bundle", {
    p_product_key: productKey,
  });
  if (!result.ready) {
    return mapRpcError(result);
  }
  const bundle = (result.data ?? {}) as CoreVariantsBundle;
  return {
    ok: true,
    bundle,
    variants: mapCoreBundleToVariantDefinitions(bundle, productKey),
    persistEnabled: true,
  };
}

export async function listVariantCommissionRatesFromCore(
  supabase: CspRpcClient,
  productId: string | null = null,
  options?: PersistEnvOptions,
): Promise<
  | { ok: true; rows: VariantCommissionListRow[]; persistEnabled: boolean }
  | PersistVariantsError
> {
  const capability = resolveVariantCommissionPersistCapability(options?.supabaseUrl);
  if (capability.productionBound) {
    return { ok: false, error: "production_fail_closed" };
  }
  if (!capability.canAttemptPersist) {
    return { ok: false, error: "persist_env_disabled" };
  }
  const result = await callCspRpc(supabase, "list_csp_variant_commission_rates", {
    p_product_id: productId,
  });
  if (!result.ready) {
    return mapRpcError(result);
  }
  return {
    ok: true,
    rows: mapCoreListToVariantCommissionRows(result.data),
    persistEnabled: true,
  };
}

async function persistOnePrice(
  supabase: CspRpcClient,
  productKey: string,
  variantKey: string,
  price: ProductVariantPrice | null | undefined,
): Promise<CspRpcResult> {
  if (!price || price.amountMajor == null || !Number.isFinite(price.amountMajor)) {
    return { ready: true, data: { skipped: true } };
  }
  const amountMajor = Number(price.amountMajor);
  const amountMinor =
    price.amountMinor != null && Number.isFinite(price.amountMinor)
      ? Math.round(Number(price.amountMinor))
      : Math.round(amountMajor * 100);
  return callCspRpc(supabase, "upsert_csp_product_variant_price", {
    p_product_key: productKey,
    p_variant_key: variantKey,
    p_billing_interval: price.interval,
    p_currency: (price.currency || "NOK").toUpperCase(),
    p_amount_minor: amountMinor,
    p_amount_major: amountMajor,
    p_vat_label: "exclusive",
    p_provider: null,
    p_provider_product_id: null,
    p_provider_price_id: null,
    p_purchasable: false,
    p_active: true,
  });
}

async function persistOneCommission(
  supabase: CspRpcClient,
  productId: string,
  variantKey: string,
  interval: ProductBillingInterval,
  rule: VariantIntervalCommissionRule | null | undefined,
): Promise<{ saved: boolean; unchanged: boolean; error?: PersistVariantsError }> {
  if (!rule) {
    return { saved: false, unchanged: false };
  }
  // get_effective returns found:false when no version exists yet — that is a valid
  // answer, not "backend missing". Avoid callCspRpc's found:false → not_applied map.
  let current: {
    model?: string;
    amount?: number | null;
    rate_pct?: number | null;
    active?: boolean;
    currency?: string;
  } | null = null;
  try {
    const { data, error } = await supabase.rpc("get_effective_csp_variant_commission", {
      p_product_id: productId,
      p_variant_key: variantKey,
      p_billing_interval: interval,
      p_at: null,
    });
    if (error) {
      const message = error.message ?? "";
      if (error.code === "PGRST202" || message.toLowerCase().includes("does not exist")) {
        return { saved: false, unchanged: false, error: { ok: false, error: "rpc_missing", detail: message } };
      }
      if (message.toLowerCase().includes("forbidden")) {
        return { saved: false, unchanged: false, error: { ok: false, error: "forbidden", detail: message } };
      }
      return { saved: false, unchanged: false, error: { ok: false, error: "rpc_error", detail: message } };
    }
    const payload = (data ?? {}) as {
      found?: boolean;
      model?: string;
      amount?: number | null;
      rate_pct?: number | null;
      active?: boolean;
      currency?: string;
      error?: string;
    };
    if (payload.error === "forbidden") {
      return { saved: false, unchanged: false, error: { ok: false, error: "forbidden" } };
    }
    current = payload.found ? payload : null;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { saved: false, unchanged: false, error: { ok: false, error: "rpc_error", detail: message } };
  }
  if (sameCommission(current, rule)) {
    return { saved: false, unchanged: true };
  }
  const args = commissionPayloadArgs(rule);
  const upsert = await callCspRpc(supabase, "upsert_csp_variant_commission_rate", {
    p_product_id: productId,
    p_variant_key: variantKey,
    p_billing_interval: interval,
    p_model: args.p_model,
    p_currency: args.p_currency,
    p_amount: args.p_amount,
    p_rate_pct: args.p_rate_pct,
    p_active: args.p_active,
    p_effective_from: new Date().toISOString(),
    p_supersedes_id: null,
    p_notes: null,
  });
  if (!upsert.ready) {
    return { saved: false, unchanged: false, error: mapRpcError(upsert) };
  }
  return { saved: true, unchanged: false };
}

/**
 * Persist variants, prices, and commission versions to Core.
 * Fail-closed on Production / unbound env / missing RPCs.
 */
export async function persistProductVariantsToCore(
  supabase: CspRpcClient,
  input: {
    productKey: string;
    variants: ProductVariantDefinition[];
  },
  options?: PersistEnvOptions,
): Promise<PersistVariantsResult> {
  const capability = resolveVariantCommissionPersistCapability(options?.supabaseUrl);
  if (capability.productionBound) {
    return { ok: false, error: "production_fail_closed" };
  }
  if (!capability.canAttemptPersist) {
    return { ok: false, error: "persist_env_disabled" };
  }

  const productKey = input.productKey.trim();
  if (!productKey) {
    return { ok: false, error: "variant_key_required", detail: "product_key_required" };
  }

  let productId: string | null = null;
  const existing = await callCspRpc<CoreVariantsBundle>(supabase, "get_csp_product_variants_bundle", {
    p_product_key: productKey,
  });
  if (!existing.ready) {
    return mapRpcError(existing);
  }
  productId =
    typeof existing.data?.product_id === "string" && existing.data.product_id
      ? existing.data.product_id
      : null;

  let variantsSaved = 0;
  let pricesSaved = 0;
  let commissionsSaved = 0;
  let commissionsUnchanged = 0;

  for (const variant of input.variants) {
    const variantKey = String(variant.variantKey ?? "").trim();
    if (!variantKey) {
      return { ok: false, error: "variant_key_required" };
    }
    const upsertVariant = await callCspRpc(supabase, "upsert_csp_product_variant", {
      p_product_key: productKey,
      p_variant_key: variantKey,
      p_admin_name: String(variant.adminName ?? "").trim() || variantKey,
      p_customer_label: String(variant.customerLabel ?? "").trim() || variantKey,
      p_sort_order: Number.isFinite(Number(variant.sortOrder)) ? Number(variant.sortOrder) : 0,
      p_active: variant.active !== false,
      p_recommended: variant.recommended === true,
      p_quota_value: variant.quotaValue,
      p_quota_unit: variant.quotaUnit,
      p_quota_kind: variant.quotaKind || "none",
      p_annual_renews_quota_monthly: variant.annualRenewsQuotaMonthly === true,
      p_features: Array.isArray(variant.features) ? variant.features : [],
    });
    if (!upsertVariant.ready) {
      return mapRpcError(upsertVariant);
    }
    variantsSaved += 1;

    for (const price of [variant.monthlyPrice, variant.yearlyPrice, variant.oneTimePrice]) {
      const priceResult = await persistOnePrice(supabase, productKey, variantKey, price);
      if (!priceResult.ready) {
        return mapRpcError(priceResult);
      }
      if (!(priceResult.data as { skipped?: boolean } | null)?.skipped) {
        pricesSaved += 1;
      }
    }
  }

  if (!productId) {
    const refreshed = await callCspRpc<CoreVariantsBundle>(supabase, "get_csp_product_variants_bundle", {
      p_product_key: productKey,
    });
    if (!refreshed.ready) {
      return mapRpcError(refreshed);
    }
    productId =
      typeof refreshed.data?.product_id === "string" && refreshed.data.product_id
        ? refreshed.data.product_id
        : null;
  }

  if (!productId) {
    // Variants/prices may have saved; commission requires product_id from csp_sales_products.
    return { ok: false, error: "product_id_required", detail: "sales_product_missing_for_commission" };
  }

  for (const variant of input.variants) {
    const variantKey = String(variant.variantKey ?? "").trim();
    const intervals: Array<{
      interval: ProductBillingInterval;
      rule: VariantIntervalCommissionRule | null | undefined;
    }> = [
      { interval: "month", rule: variant.monthlyPrice?.commission },
      { interval: "year", rule: variant.yearlyPrice?.commission },
      { interval: "one_time", rule: variant.oneTimePrice?.commission },
    ];
    for (const { interval, rule } of intervals) {
      if (!rule) continue;
      const commissionResult = await persistOneCommission(
        supabase,
        productId,
        variantKey,
        interval,
        rule,
      );
      if (commissionResult.error) {
        return commissionResult.error;
      }
      if (commissionResult.saved) commissionsSaved += 1;
      if (commissionResult.unchanged) commissionsUnchanged += 1;
    }
  }

  return {
    ok: true,
    productKey,
    productId,
    variantsSaved,
    pricesSaved,
    commissionsSaved,
    commissionsUnchanged,
    settlementActivated: false,
  };
}
