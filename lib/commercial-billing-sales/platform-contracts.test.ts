import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  AGENT_CONTRACT_RULES,
  buildCommercialOverview,
  checkVariantPriceCommissionParity,
  COMMERCIAL_BILLING_SALES_MASTER,
  COMMERCIAL_BILLING_SQL_CANDIDATES,
  COMMERCIAL_END_TO_END_FLOW,
  COMMERCIAL_OPEN_OWNER_APPROVALS,
  COMMERCIAL_PAYMENT_GRACE_DAYS,
  INVOICE_DOCUMENT_POLICY,
  isLiveStripeMappingEnabled,
  LIVE_CHECKOUT_ADAPTER_DISABLED,
  LIVE_PRICE_ADAPTER_DISABLED,
  NORDIC_FOUNDER_EXCHANGE_HOOKS,
  percentCommissionIsActivatable,
  PRESERVED_SURFACES,
  SALES_PARTNER_LICENSE_SNAPSHOT_RPC,
} from "./index";
import { fixedRule, price, variant } from "./test-fixtures";

const root = process.cwd();
const dir = join(root, "lib/commercial-billing-sales");
const sha = (rel: string) => createHash("sha256").update(readFileSync(join(root, rel))).digest("hex");

// ------------------------------------------------------------------ H. overview

test("H: overview with no inputs reports everything unavailable — no fictional numbers", () => {
  const o = buildCommercialOverview();
  for (const m of [
    o.licenseLevels,
    o.productMapping,
    o.priceCommissionParity,
    o.paymentStatus.capturedPayments,
    o.commissionStatus.registeredSales,
    o.commissionStatus.earnedSales,
    o.capacity.activeTenantLicenses,
    o.readiness.foundationSqlStagingApplied,
    o.readiness.foundationSqlProductionApplied,
    o.readiness.licenseSnapshotRpcReachable,
  ]) {
    assert.deepEqual(m, { available: false, reason: "not_provided" });
  }
  assert.equal(o.mutationsAvailable, false);
});

test("H: overview readiness flags are fixed — live, payments, payout, percent all off; settlement manual", () => {
  const r = buildCommercialOverview().readiness;
  assert.equal(r.stripeLiveEnabled, false);
  assert.equal(r.checkoutLiveEnabled, false);
  assert.equal(r.realPaymentsEnabled, false);
  assert.equal(r.payoutActivationEnabled, false);
  assert.equal(r.percentCommissionActivatable, false);
  assert.equal(r.settlementManualOnly, true);
  assert.equal(r.snapshotReadSqlStatus, "PREPARED_ONLY");
  assert.equal(r.productCenterAndCommissionEditorPreserved, true);
  assert.deepEqual(buildCommercialOverview().openOwnerApprovals, COMMERCIAL_OPEN_OWNER_APPROVALS);
});

test("H: overview shows only values the caller really supplied; explicit 0 is available", () => {
  const o = buildCommercialOverview({
    counts: { capturedPayments: 0, earnedCommissionSales: 3 },
    stagingFoundationApplied: true,
    productionFoundationApplied: false,
  });
  assert.deepEqual(o.paymentStatus.capturedPayments, { available: true, value: 0 });
  assert.deepEqual(o.commissionStatus.earnedSales, { available: true, value: 3 });
  assert.deepEqual(o.commissionStatus.registeredSales, { available: false, reason: "not_provided" });
  assert.deepEqual(o.readiness.foundationSqlProductionApplied, { available: true, value: false });
});

test("H: price ↔ commission parity per variant/interval — null vs 0 vs percent-blocked vs currency vs too-high", () => {
  const ok = variant({
    monthlyPrice: price("month", 599, { commission: fixedRule(10) }),
    yearlyPrice: price("year", 5990, { commission: fixedRule(0) }),
  });
  assert.deepEqual(checkVariantPriceCommissionParity(ok), [
    { interval: "month", issues: [] },
    { interval: "year", issues: [] },
  ]);
  const bad = variant({
    monthlyPrice: price("month", 599, { commission: null }),
    yearlyPrice: price("year", 5990, { commission: fixedRule(null, { model: "percent", ratePct: 10 }) }),
    oneTimePrice: price("one_time", 100, { commission: fixedRule(200) }),
  });
  assert.deepEqual(checkVariantPriceCommissionParity(bad), [
    { interval: "month", issues: ["commission_not_configured"] },
    { interval: "year", issues: ["commission_percent_blocked"] },
    { interval: "one_time", issues: ["commission_exceeds_price"] },
  ]);
  const cur = variant({ monthlyPrice: price("month", 599, { commission: fixedRule(10, { currency: "SEK" }) }), yearlyPrice: null });
  assert.deepEqual(checkVariantPriceCommissionParity(cur), [{ interval: "month", issues: ["commission_currency_mismatch"] }]);
  const missingPrice = variant({ monthlyPrice: price("month", null, { commission: fixedRule(1) }), yearlyPrice: null });
  assert.deepEqual(checkVariantPriceCommissionParity(missingPrice)[0].issues.includes("price_missing"), true);

  const o = buildCommercialOverview({ variants: [ok, bad] });
  assert.equal(o.priceCommissionParity.available, true);
  if (o.priceCommissionParity.available) {
    assert.equal(o.priceCommissionParity.value.variantsChecked, 2);
    assert.equal(o.priceCommissionParity.value.issueCount, 3);
  }
});

// ------------------------------------------------------------- safety switches

test("master switches are all off and live adapters are disabled", () => {
  for (const [k, v] of Object.entries(COMMERCIAL_BILLING_SALES_MASTER.switches)) assert.equal(v, false, k);
  assert.equal(COMMERCIAL_BILLING_SALES_MASTER.paymentProof.redirectOrSuccessUrlIsProof, false);
  assert.equal(COMMERCIAL_BILLING_SALES_MASTER.paymentProof.checkoutSessionCompletedIsProof, false);
  assert.equal(COMMERCIAL_BILLING_SALES_MASTER.paymentProof.onlyVerifiedCapturedPaymentActivates, true);
  assert.equal(COMMERCIAL_BILLING_SALES_MASTER.commission.recurringRenewalCommission, false);
  assert.equal(COMMERCIAL_BILLING_SALES_MASTER.commission.legacyRatesAutoIntroduced, false);
  assert.equal(COMMERCIAL_BILLING_SALES_MASTER.freeAipifyPartner.purchaseRequired, false);
  assert.equal(COMMERCIAL_PAYMENT_GRACE_DAYS, 3);
  assert.equal(percentCommissionIsActivatable(), false);
  assert.equal(isLiveStripeMappingEnabled(), false);
  assert.ok(LIVE_PRICE_ADAPTER_DISABLED);
  assert.ok(LIVE_CHECKOUT_ADAPTER_DISABLED);
  assert.equal(INVOICE_DOCUMENT_POLICY.fabricatesDocuments, false);
  assert.equal(INVOICE_DOCUMENT_POLICY.sendsEmail, false);
});

test("agent interop rules keep customer/seller separation and no purchase CTA from this module", () => {
  assert.equal(AGENT_CONTRACT_RULES.agent2.purchaseCtaFromThisModule, false);
  assert.equal(AGENT_CONTRACT_RULES.agent2.commissionVisibleInApp, false);
  assert.equal(AGENT_CONTRACT_RULES.agent2.billingAndRecoveryAlwaysReachable, true);
  assert.equal(AGENT_CONTRACT_RULES.agent3.sellerSideEventsMustNotReachCustomerTenant, true);
  assert.equal(AGENT_CONTRACT_RULES.agent3.deliveryImplementedHere, false);
  assert.equal(COMMERCIAL_END_TO_END_FLOW.length, 10);
  assert.equal(NORDIC_FOUNDER_EXCHANGE_HOOKS.status, "documented_only");
  assert.equal(NORDIC_FOUNDER_EXCHANGE_HOOKS.dataLinked, false);
  assert.equal(NORDIC_FOUNDER_EXCHANGE_HOOKS.productStarted, false);
  assert.ok(PRESERVED_SURFACES.some((s) => s.includes("/app/sales-partner")));
  assert.ok(PRESERVED_SURFACES.some((s) => s.includes("/s/*") && s.includes("/p/*")));
});

// ------------------------------------------------------------------ SQL candidates

test("SQL candidates: bytes match recorded SHAs and sidecars", () => {
  const f = COMMERCIAL_BILLING_SQL_CANDIDATES.foundation;
  const s = COMMERCIAL_BILLING_SQL_CANDIDATES.snapshotRead;
  assert.equal(sha(f.path), f.sha256);
  assert.equal(sha(s.path), s.sha256);
  assert.equal(f.sha256, "2ee4239b4566c04a0c136e9fc3a311ba7c6e7664c392ccd18916d6fb9b2dd30d");
  assert.equal(s.sha256, "57269903f43b080ef3156c41fbf354250a2a20ada66d04e638e8ade9aecb0e0d");
  for (const c of [f, s]) {
    const sidecar = readFileSync(join(root, `${c.path}.sha256`), "utf8");
    assert.ok(sidecar.startsWith(c.sha256), c.path);
  }
  assert.equal(f.productionApplied, false);
  assert.equal(s.applyStatus, "PREPARED_ONLY");
});

test("snapshot read SQL: PREPARED_ONLY, exactly one candidate, security definer, revoke-all and no grants", () => {
  const sqlDir = join(root, "docs/platform/sql-candidates");
  const candidates = readdirSync(sqlDir).filter((f) => /snapshot_read.*\.sql$/.test(f));
  assert.deepEqual(candidates, ["sales_partner_license_snapshot_read_v1.sql"]);
  const sql = readFileSync(join(root, COMMERCIAL_BILLING_SQL_CANDIDATES.snapshotRead.path), "utf8");
  assert.ok(sql.startsWith("-- PREPARED_ONLY"));
  assert.ok(sql.includes(`public.${SALES_PARTNER_LICENSE_SNAPSHOT_RPC}`));
  assert.match(sql, /security definer/i);
  assert.match(sql, /set search_path = public/i);
  assert.match(sql, /revoke all on function[\s\S]*from public/i);
  assert.doesNotMatch(sql, /^\s*grant\s+execute/im);
  assert.doesNotMatch(sql, /aipify\.com/i);
});

// ------------------------------------------------------------------ source scans

const srcFiles = readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && f !== "test-fixtures.ts");

test("source scan: no Stripe SDK, no env reads, no network, no aipify.com in production sources", () => {
  assert.ok(srcFiles.length >= 12);
  for (const f of srcFiles) {
    const src = readFileSync(join(dir, f), "utf8");
    assert.doesNotMatch(src, /from\s+["']stripe["']|require\(["']stripe["']\)/, `${f} stripe sdk`);
    assert.doesNotMatch(src, /process\.env/, `${f} env`);
    assert.doesNotMatch(src, /\bfetch\(|XMLHttpRequest|https?:\/\/api\.stripe/, `${f} network`);
    assert.doesNotMatch(src, /aipify\.com/i, `${f} forbidden domain`);
    assert.doesNotMatch(src, /sk_live_|whsec_[A-Za-z0-9]{10,}|pk_live_/, `${f} secret-like`);
    assert.doesNotMatch(src, /unonight/i, `${f} customer name`);
  }
});

test("source scan: legacy 500/800/0 commission rates are never introduced", () => {
  for (const f of srcFiles) {
    // Documentation comments may name the forbidden legacy rates; executable code must not use them.
    const src = readFileSync(join(dir, f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    assert.doesNotMatch(src, /\b(500|800)\b\s*(\/|,)\s*\b(500|800|0)\b/, `${f} legacy rate tuple`);
    assert.doesNotMatch(src, /legacyRates?\s*[:=]\s*\{/, `${f} legacy rates object`);
  }
});

test("source scan: no purchase / support / analytics panel files in this module", () => {
  const all = readdirSync(dir);
  assert.equal(all.some((f) => f.endsWith(".tsx")), false);
  assert.equal(existsSync(join(root, "app/api/commercial-billing-sales")), false);
});

test("index exports resolve (no dangling re-exports)", async () => {
  const idx = await import("./index");
  for (const [name, value] of Object.entries(idx)) assert.notEqual(value, undefined, name);
  assert.ok(Object.keys(idx).length > 40);
});

// ------------------------------------------------------------------ docs

test("docs: master document exists with Agent 2/3 DTO contracts, flow, SQL SHAs, approvals", () => {
  const p = join(root, "docs/platform/AIPIFY_COMMERCIAL_BILLING_SALES_COMPLETE_MASTER_V1.md");
  assert.ok(existsSync(p) && statSync(p).size > 2000);
  const md = readFileSync(p, "utf8");
  for (const needle of [
    "End-to-end flow",
    "Agent 2",
    "Agent 3",
    "CustomerPaymentHistoryDto",
    "CommercialNotificationDto",
    "dedupeKey",
    "Open questions",
    "Nordic Founder Exchange",
    "PREPARED_ONLY",
    COMMERCIAL_BILLING_SQL_CANDIDATES.foundation.sha256,
    COMMERCIAL_BILLING_SQL_CANDIDATES.snapshotRead.sha256,
    "Open owner approvals",
  ]) {
    assert.ok(md.includes(needle), `docs missing: ${needle}`);
  }
  for (const a of COMMERCIAL_OPEN_OWNER_APPROVALS) assert.ok(md.includes(a), `docs missing approval ${a}`);
  assert.doesNotMatch(md, /aipify\.com/i);
});
