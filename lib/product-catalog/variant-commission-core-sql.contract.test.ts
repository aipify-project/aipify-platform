import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import test from "node:test";
import {
  LEGACY_PRODUCT_COMMISSION_RATES_NEEDING_VARIANT_MAPPING,
  VARIANT_COMMISSION_PERSISTENCE,
  canPersistVariantCommissionRules,
} from "./variant-commission";

const ROOT = join(process.cwd(), "docs/platform/sql-candidates");

const CANDIDATES = [
  "csp_product_variants_billing_v1.sql",
  "csp_variant_commission_rate_versions_v1.sql",
  "NOT_APPLIED_csp_variant_commission_staging_verify_harness_v1.sql",
] as const;

function sha256File(name: (typeof CANDIDATES)[number]): string {
  const body = readFileSync(join(ROOT, name));
  return createHash("sha256").update(body).digest("hex");
}

function readCandidate(name: (typeof CANDIDATES)[number]): string {
  return readFileSync(join(ROOT, name), "utf8");
}

test("persist gate remains fail-closed until owner Staging apply + activation", () => {
  assert.equal(VARIANT_COMMISSION_PERSISTENCE.canPersist, false);
  assert.equal(canPersistVariantCommissionRules(), false);
  assert.equal(VARIANT_COMMISSION_PERSISTENCE.status, "blocked_needs_core_rpc");
});

test("variants billing candidate is Staging-safe and history-preserving", () => {
  const sql = readCandidate("csp_product_variants_billing_v1.sql");
  assert.match(sql, /PREPARED_ONLY/);
  assert.match(sql, /create table if not exists public\.csp_product_variants/);
  assert.match(sql, /create table if not exists public\.csp_product_variant_prices/);
  assert.match(sql, /references public\.csp_sales_products \(product_key\)/);
  assert.match(sql, /vat_label text not null default 'exclusive'/);
  assert.match(sql, /upsert_csp_product_variant_price/);
  assert.match(sql, /get_csp_product_variants_bundle/);
  assert.doesNotMatch(sql, /insert into public\.csp_commission_rate_versions/i);
  assert.doesNotMatch(sql, /update public\.csp_qualified_sales/i);
  assert.doesNotMatch(sql, /500\.00|800\.00/);
  assert.doesNotMatch(sql, /stripe\.|create.?price/i);
});

test("variant commission candidate matches design RPC contract without backfill", () => {
  const sql = readCandidate("csp_variant_commission_rate_versions_v1.sql");
  assert.match(sql, /PREPARED_ONLY/);
  assert.match(sql, /create table if not exists public\.csp_variant_commission_rate_versions/);
  assert.match(sql, /list_csp_variant_commission_rates/);
  assert.match(sql, /upsert_csp_variant_commission_rate/);
  assert.match(sql, /get_effective_csp_variant_commission/);
  assert.match(sql, /net_ex_vat_after_discount/);
  assert.match(sql, /rate_version_conflict_use_new_effective_from/);
  assert.match(sql, /settlement_activated', false/);
  assert.match(sql, /legacy_product_commission_untouched/);
  assert.doesNotMatch(sql, /insert into public\.csp_commission_rate_versions/i);
  assert.doesNotMatch(sql, /update public\.csp_qualified_sales/i);
  assert.doesNotMatch(sql, /update public\.csp_commission_ledger/i);
  // Must not auto-copy legacy product rates onto variants.
  assert.doesNotMatch(sql, /fixed_commission_amount/);
  for (const legacy of LEGACY_PRODUCT_COMMISSION_RATES_NEEDING_VARIANT_MAPPING) {
    assert.equal(legacy.mappingStatus, "requires_explicit_variant_mapping_before_backfill");
  }
});

test("verify harness asserts idempotency, access control, and legacy preservation", () => {
  const sql = readCandidate("NOT_APPLIED_csp_variant_commission_staging_verify_harness_v1.sql");
  assert.match(sql, /NOT_APPLIED/);
  assert.match(sql, /_csp_variant_commission_staging_verify/);
  assert.match(sql, /verify_access_control_failed/);
  assert.match(sql, /verify_idempotency_failed/);
  assert.match(sql, /verify_conflict_not_raised|rate_version_conflict_use_new_effective_from/);
  assert.match(sql, /verify_prior_version_mutated/);
  assert.match(sql, /verify_legacy_history_mutated/);
  assert.match(sql, /AIPIFY_VARIANT_COMMISSION_STAGING_VERIFY_PASS/);
  assert.doesNotMatch(sql, /update public\.csp_qualified_sales/i);
});

test("SHA256 fingerprints are stable for Staging install order reporting", () => {
  const hashes = Object.fromEntries(CANDIDATES.map((name) => [name, sha256File(name)]));
  for (const name of CANDIDATES) {
    assert.equal(hashes[name].length, 64);
    assert.match(hashes[name], /^[a-f0-9]{64}$/);
  }
  // Emit for approval docs / CI logs.
  console.log(
    JSON.stringify(
      {
        installOrder: [
          "csp_product_variants_billing_v1.sql",
          "csp_variant_commission_rate_versions_v1.sql",
          "NOT_APPLIED_csp_variant_commission_staging_verify_harness_v1.sql (post-apply verify only)",
        ],
        sha256: hashes,
      },
      null,
      2,
    ),
  );
});
