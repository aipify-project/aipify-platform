/**
 * Staging-gated persist flow with mocked Core RPCs (no live DB write).
 */
import assert from "node:assert/strict";
import test from "node:test";
import { persistProductVariantsToCore } from "./variant-commission-core";
import { AIPIFY_CORE_STAGING_PROJECT_REF } from "./variant-commission-core-gate";
import { normalizeVariantCommissionRule } from "./variant-commission";
import type { ProductVariantDefinition } from "./variants";

const STAGING_URL = `https://${AIPIFY_CORE_STAGING_PROJECT_REF}.supabase.co`;

test("Staging persist flow: create variant, prices, commission versions; skip unchanged", async () => {
  const productId = "22222222-2222-2222-2222-222222222222";
  const calls: string[] = [];
  let commissionVersions = 0;
  const effectiveByInterval: Record<
    string,
    {
      found: boolean;
      model?: string;
      amount?: number | null;
      rate_pct?: number | null;
      active?: boolean;
      currency?: string;
    }
  > = {};

  const variant: ProductVariantDefinition = {
    variantKey: "e2e_free",
    productKey: "e2e_product",
    adminName: "free",
    customerLabel: "Free",
    sortOrder: 0,
    active: true,
    recommended: false,
    quotaValue: 0,
    quotaUnit: "answers",
    quotaKind: "monthly_renewing",
    annualRenewsQuotaMonthly: false,
    monthlyPrice: {
      currency: "NOK",
      amountMajor: 0,
      amountMinor: 0,
      interval: "month",
      vatLabel: "exclusive",
      providerPriceId: null,
      purchasable: false,
      commission: normalizeVariantCommissionRule({ model: "fixed", amountMajor: 0 }),
    },
    yearlyPrice: {
      currency: "NOK",
      amountMajor: 0,
      amountMinor: 0,
      interval: "year",
      vatLabel: "exclusive",
      providerPriceId: null,
      purchasable: false,
      commission: normalizeVariantCommissionRule({ model: "percent", ratePct: 12.5 }),
    },
    oneTimePrice: null,
    features: [],
  };

  const client = {
    rpc: async (name: string, args?: Record<string, unknown>) => {
      calls.push(name);
      if (name === "get_csp_product_variants_bundle") {
        return { data: { product_key: "e2e_product", product_id: productId, variants: [] }, error: null };
      }
      if (name === "upsert_csp_product_variant") {
        assert.equal(args?.p_variant_key, "e2e_free");
        return { data: { ok: true, persisted: true }, error: null };
      }
      if (name === "upsert_csp_product_variant_price") {
        assert.equal(args?.p_purchasable, false);
        assert.equal(args?.p_vat_label, "exclusive");
        return { data: { ok: true, stripe_created: false }, error: null };
      }
      if (name === "get_effective_csp_variant_commission") {
        const interval = String(args?.p_billing_interval ?? "");
        const effective = effectiveByInterval[interval] ?? { found: false };
        return { data: { ...effective, settlement_activated: false }, error: null };
      }
      if (name === "upsert_csp_variant_commission_rate") {
        commissionVersions += 1;
        const interval = String(args?.p_billing_interval ?? "");
        effectiveByInterval[interval] = {
          found: true,
          model: String(args?.p_model),
          amount: args?.p_amount == null ? null : Number(args.p_amount),
          rate_pct: args?.p_rate_pct == null ? null : Number(args.p_rate_pct),
          active: args?.p_active !== false,
          currency: String(args?.p_currency ?? "NOK"),
        };
        assert.ok(typeof args?.p_effective_from === "string");
        return { data: { ok: true, id: `v${commissionVersions}` }, error: null };
      }
      return { data: null, error: { message: `unexpected ${name}` } };
    },
  };

  const first = await persistProductVariantsToCore(
    client,
    { productKey: "e2e_product", variants: [variant] },
    { supabaseUrl: STAGING_URL },
  );
  assert.equal(first.ok, true);
  if (first.ok) {
    assert.equal(first.variantsSaved, 1);
    assert.equal(first.pricesSaved, 2);
    assert.equal(first.commissionsSaved, 2);
    assert.equal(first.settlementActivated, false);
  }
  assert.equal(commissionVersions, 2);

  const second = await persistProductVariantsToCore(
    client,
    { productKey: "e2e_product", variants: [variant] },
    { supabaseUrl: STAGING_URL },
  );
  assert.equal(second.ok, true);
  if (second.ok) {
    // Same rules → no new versions (versioning on change only).
    assert.equal(second.commissionsSaved, 0);
    assert.equal(second.commissionsUnchanged, 2);
  }
  assert.equal(commissionVersions, 2);

  const edited = {
    ...variant,
    monthlyPrice: {
      ...variant.monthlyPrice!,
      commission: normalizeVariantCommissionRule({ model: "fixed", amountMajor: 25 }),
    },
  };
  const third = await persistProductVariantsToCore(
    client,
    { productKey: "e2e_product", variants: [edited] },
    { supabaseUrl: STAGING_URL },
  );
  assert.equal(third.ok, true);
  if (third.ok) {
    assert.equal(third.commissionsSaved, 1);
    assert.equal(third.commissionsUnchanged, 1);
  }
  assert.equal(commissionVersions, 3);
  assert.ok(calls.includes("upsert_csp_variant_commission_rate"));
});

test("missing RPC returns clear failure (never false success)", async () => {
  const result = await persistProductVariantsToCore(
    {
      rpc: async () => ({
        data: null,
        error: { code: "PGRST202", message: "Could not find the function" },
      }),
    },
    {
      productKey: "e2e_product",
      variants: [
        {
          variantKey: "x",
          productKey: "e2e_product",
          adminName: "x",
          customerLabel: "x",
          sortOrder: 0,
          active: true,
          recommended: false,
          quotaValue: null,
          quotaUnit: null,
          quotaKind: "none",
          annualRenewsQuotaMonthly: false,
          monthlyPrice: null,
          yearlyPrice: null,
          oneTimePrice: null,
          features: [],
        },
      ],
    },
    { supabaseUrl: STAGING_URL },
  );
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error, "rpc_missing");
});
