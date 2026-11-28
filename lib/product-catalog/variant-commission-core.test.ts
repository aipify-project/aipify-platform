import assert from "node:assert/strict";
import test from "node:test";
import {
  mapCoreBundleToVariantDefinitions,
  mapCoreListToVariantCommissionRows,
  parseVariantsJsonInput,
  persistProductVariantsToCore,
  VARIANT_COMMISSION_CORE_RPCS,
} from "./variant-commission-core";
import {
  canPersistVariantCommissionRules,
  VARIANT_COMMISSION_PERSISTENCE,
} from "./variant-commission";
import {
  AIPIFY_CORE_PRODUCTION_PROJECT_REF,
  AIPIFY_CORE_STAGING_PROJECT_REF,
  resolveVariantCommissionPersistCapability,
} from "./variant-commission-core-gate";
import { emptyVariantCommissionRule, normalizeVariantCommissionRule } from "./variant-commission";
import type { ProductVariantDefinition } from "./variants";
import { variantsForProduct } from "./merge";

const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

test("Production Core persist attempts are enabled when activation flag is true", () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = `https://${AIPIFY_CORE_PRODUCTION_PROJECT_REF}.supabase.co`;
  assert.equal(canPersistVariantCommissionRules(), true);
  assert.equal(VARIANT_COMMISSION_PERSISTENCE.canPersist, true);
  assert.equal(VARIANT_COMMISSION_PERSISTENCE.status, "production_core_enabled");
  assert.equal(resolveVariantCommissionPersistCapability().reason, "production_core_bound");
});

test("Staging Core env enables persist attempts", () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = `https://${AIPIFY_CORE_STAGING_PROJECT_REF}.supabase.co`;
  assert.equal(canPersistVariantCommissionRules(), true);
  assert.equal(VARIANT_COMMISSION_PERSISTENCE.canPersist, true);
  assert.equal(VARIANT_COMMISSION_PERSISTENCE.status, "staging_core_enabled");
});

test("persistProductVariantsToCore on Production proceeds past gate when activation is true", async () => {
  const result = await persistProductVariantsToCore(
    {
      rpc: async (name: string) => {
        if (name === "get_csp_product_variants_bundle") {
          return {
            data: { product_key: "demo_product", product_id: "11111111-1111-1111-1111-111111111111", variants: [] },
            error: null,
          };
        }
        return { data: { ok: true }, error: null };
      },
    },
    { productKey: "demo_product", variants: [] },
    { supabaseUrl: `https://${AIPIFY_CORE_PRODUCTION_PROJECT_REF}.supabase.co` },
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.settlementActivated, false);
    assert.equal(result.variantsSaved, 0);
  }
});

test("mapCoreBundleToVariantDefinitions maps prices and commission rules", () => {
  const variants = mapCoreBundleToVariantDefinitions(
    {
      product_key: "demo_product",
      product_id: "11111111-1111-1111-1111-111111111111",
      variants: [
        {
          variant_key: "demo_free",
          admin_name: "free",
          customer_label: "Free",
          sort_order: 0,
          active: true,
          recommended: false,
          quota_value: 0,
          quota_unit: "answers",
          quota_kind: "monthly_renewing",
          annual_renews_quota_monthly: false,
          features: [],
          prices: [
            {
              billing_interval: "month",
              currency: "NOK",
              amount_major: 0,
              amount_minor: 0,
              vat_label: "exclusive",
              purchasable: false,
            },
          ],
          commission_rules: [
            {
              billing_interval: "month",
              model: "fixed",
              amount: 0,
              rate_pct: null,
              currency: "NOK",
              active: true,
            },
            {
              billing_interval: "year",
              model: "percent",
              amount: null,
              rate_pct: 10,
              currency: "NOK",
              active: true,
              percent_basis: "net_ex_vat_after_discount",
            },
          ],
        },
      ],
    },
    "demo_product",
  );
  assert.equal(variants.length, 1);
  assert.equal(variants[0]?.monthlyPrice?.amountMajor, 0);
  assert.equal(variants[0]?.monthlyPrice?.commission?.amountMajor, 0);
  assert.equal(variants[0]?.yearlyPrice?.commission?.model, "percent");
  assert.equal(variants[0]?.yearlyPrice?.commission?.ratePct, 10);
});

test("parseVariantsJsonInput rejects invalid payload and accepts free 0 commission", () => {
  assert.equal(parseVariantsJsonInput("{").ok, false);
  const ok = parseVariantsJsonInput([
    {
      variantKey: "demo_std",
      productKey: "demo_product",
      adminName: "standard",
      customerLabel: "Standard",
      sortOrder: 1,
      active: true,
      recommended: false,
      quotaValue: 100,
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
      yearlyPrice: null,
      oneTimePrice: null,
      features: [],
    } satisfies ProductVariantDefinition,
  ]);
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.variants[0]?.monthlyPrice?.commission?.amountMajor, 0);
  }
});

test("mapCoreListToVariantCommissionRows keeps settlement fields out of earn path", () => {
  const rows = mapCoreListToVariantCommissionRows([
    {
      id: "r1",
      product_id: "p1",
      product_key: "demo_product",
      variant_key: "demo_std",
      billing_interval: "month",
      model: "fixed",
      amount: 100,
      rate_pct: null,
      currency: "NOK",
      active: true,
      effective_from: "2026-11-28T00:00:00Z",
      created_at: "2026-11-28T00:00:00Z",
    },
  ]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.amount, 100);
  assert.equal(rows[0]?.vatLabel, "exclusive");
});

test("APP planned catalog variants remain available (regression)", () => {
  const web = variantsForProduct("kompis_web");
  assert.ok(web.length >= 1);
  // Bedrift may have zero planned variants — still must not throw.
  assert.ok(Array.isArray(variantsForProduct("kompis_bedrift")));
  assert.ok(VARIANT_COMMISSION_CORE_RPCS.includes("upsert_csp_variant_commission_rate"));
  assert.equal(emptyVariantCommissionRule("NOK").amountMajor, 0);
});

test("required Core RPC names are documented", () => {
  assert.deepEqual([...VARIANT_COMMISSION_CORE_RPCS].sort(), [
    "get_csp_product_variants_bundle",
    "get_effective_csp_variant_commission",
    "list_csp_variant_commission_rates",
    "upsert_csp_product_variant",
    "upsert_csp_product_variant_price",
    "upsert_csp_variant_commission_rate",
  ]);
});

test("restore NEXT_PUBLIC_SUPABASE_URL after gate tests", () => {
  if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
});
