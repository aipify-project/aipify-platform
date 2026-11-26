import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "../..");
const SQL_REL = "docs/platform/sql-candidates/csp_public_attribution_capture_v6.sql";
const SQL_SHA = "454bf3a3c065b577e5a10d88016b8240c0130b8cfb058644eb55a326b24079c5";

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

const sql = read(SQL_REL);
assert.equal(createHash("sha256").update(sql).digest("hex"), SQL_SHA);
assert.match(sql, /PREPARED_ONLY/);
assert.match(sql, /csp_capture_public_attribution_click/);
assert.match(sql, /csp_attribute_customer_registration/);
assert.match(sql, /link_inactive/);
assert.match(sql, /partner_not_active/);
assert.match(sql, /certification_required/);
assert.match(sql, /self_referral/);
assert.match(sql, /csp_attribution_click_dedupe/);
assert.match(sql, /billing_interval|billingInterval/);
assert.match(sql, /revoke all on table public\.csp_attribution_click_dedupe from public, anon, authenticated/);
assert.match(sql, /grant execute on function public\.csp_capture_public_attribution_click\(jsonb\) to anon/);

const route = read("app/p/[partnerSlug]/[productSlug]/route.ts");
assert.match(route, /CSP_CAPTURE_RPC|csp_capture_public_attribution_click/);
assert.match(route, /decideCspPublicCapture/);
assert.match(route, /CSP_ATTRIBUTION_COOKIE/);

const payment = read("app/api/certified-sales-partner/payment-events/route.ts");
assert.match(payment, /csp_apply_paid_period_event/);
assert.match(payment, /p_payload/);
assert.match(payment, /AIPIFY_CSP_PAYMENT_EVENT_SECRET/);
assert.match(payment, /createServiceRoleClient/);
assert.doesNotMatch(payment, /p_qualified_sale_id/);

const attr = read("app/api/certified-sales-partner/attribute-registration/route.ts");
assert.match(attr, /csp_attribute_customer_registration|CSP_ATTRIBUTE_REGISTRATION_RPC/);
assert.match(attr, /self_referral|isSelfReferral/);
assert.doesNotMatch(attr, /body\.partnerId|partner_id\s*:\s*body/);

const webhook = read("app/api/webhooks/stripe/route.ts");
assert.match(webhook, /authorizeStripeWebhook/);
assert.doesNotMatch(webhook, /if\s*\(\s*webhookSecret\s*&&\s*signature\s*\)/);

console.log("capture-v6-sql-contract.test.ts: ok", SQL_SHA);
