import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { buildPlatformPortalLabels } from "./labels";

const SQL_PATH =
  "docs/platform/sql-candidates/platform_portal_dashboard_payment_status_customer_scope_v1.sql";
const SHA_PATH = `${SQL_PATH}.sha256`;

const sql = readFileSync(SQL_PATH, "utf8");
const recorded = readFileSync(SHA_PATH, "utf8").trim();
const digest = createHash("sha256").update(readFileSync(SQL_PATH)).digest("hex");

assert.equal(digest, recorded, "SQL candidate SHA256 must match sibling .sha256 file");
assert.match(sql, /PREPARED_ONLY/);
assert.match(sql, /create or replace function public\.get_platform_portal_dashboard\(\)/);
assert.match(sql, /v_past_due/);
assert.match(sql, /v_trialing/);

// past_due and trialing must use the same customer org join chain as active_subscriptions.
const pastDueBlock = sql.slice(sql.indexOf("into v_past_due"), sql.indexOf("into v_trialing"));
const trialingBlock = sql.slice(sql.indexOf("into v_trialing"), sql.indexOf("into v_orgs_attention"));
for (const [name, block] of [
  ["past_due", pastDueBlock],
  ["trialing", trialingBlock],
] as const) {
  assert.match(block, /join public\.customers cu on cu\.id = s\.customer_id/, name);
  assert.match(block, /join public\.organizations o on o\.id = cu\.id/, name);
  assert.match(block, /join public\.companies co on co\.id = cu\.company_id/, name);
  assert.match(block, /coalesce\(co\.is_platform, false\) = false/, name);
}
assert.match(pastDueBlock, /s\.status = 'past_due'/);
assert.match(trialingBlock, /s\.status = 'trialing'/);
assert.doesNotMatch(
  pastDueBlock,
  /from public\.subscriptions s\s+where s\.status = 'past_due'/,
  "past_due must not remain unscoped",
);

function loadPlatform(locale: string) {
  return JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"));
}

function tFor(locale: string) {
  const dict = { platform: loadPlatform(locale) };
  return (key: string) => {
    const parts = key.split(".");
    let cur: unknown = dict;
    for (const part of parts) {
      if (!cur || typeof cur !== "object") return key;
      cur = (cur as Record<string, unknown>)[part];
    }
    return typeof cur === "string" ? cur : key;
  };
}

const no = buildPlatformPortalLabels(tFor("no"));
assert.equal(no.dashboard.paymentPastDue, "Forfalte kundeavtaler");
assert.equal(no.dashboard.paymentTrialing, "Prøveperioder");
assert.equal(no.dashboard.paymentActive, "Aktive kundeavtaler");

const before = readFileSync(
  "supabase/migrations/20261933700000_platform_portal_dashboard_customer_org_metrics_scope.sql",
  "utf8",
);
assert.match(
  before,
  /'past_due', \(\s*select count\(\*\)::int\s*from public\.subscriptions s\s*where s\.status = 'past_due'\s*\)/,
  "current LIVE migration still has unscoped past_due (candidate required)",
);

console.log("payment-status-customer-scope-candidate: ok", digest);
