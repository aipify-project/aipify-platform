import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SQL_REL = "docs/platform/sql-candidates/payment_webhook_rpc_hardening_v1.sql";

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

const sql = read(SQL_REL);
const sha = createHash("sha256").update(sql).digest("hex");
assert.match(sql, /PREPARED_ONLY/);
assert.match(sql, /handle_payment_webhook_event\(text, text, jsonb, uuid\)/);
assert.match(sql, /register_trial_payment_method\(text\)/);
assert.match(sql, /revoke all on function public\.handle_payment_webhook_event/);
assert.match(sql, /from public, anon, authenticated, service_role/);
assert.match(
  sql,
  /grant execute on function public\.handle_payment_webhook_event\(text, text, jsonb, uuid\)\s+to service_role/,
);
assert.match(
  sql,
  /grant execute on function public\.register_trial_payment_method\(text\)\s+to authenticated, service_role/,
);
assert.doesNotMatch(sql, /grant execute on function public\.handle_payment_webhook_event\([^\)]*\)\s+to authenticated/);
assert.doesNotMatch(sql, /grant execute on function public\.handle_payment_webhook_event\([^\)]*\)\s+to anon/);
assert.doesNotMatch(sql, /update public\.subscriptions|csp_apply_paid_period|STRIPE_SECRET/);

const stripeRoute = read("app/api/webhooks/stripe/route.ts");
assert.match(stripeRoute, /authorizeStripeWebhook/);
assert.match(stripeRoute, /createServiceRoleClient/);
assert.doesNotMatch(stripeRoute, /from \"@\/lib\/supabase\/server\"/);
assert.ok(stripeRoute.indexOf("authorizeStripeWebhook") < stripeRoute.indexOf("handle_payment_webhook_event"));
assert.ok(stripeRoute.indexOf("createServiceRoleClient") < stripeRoute.indexOf("handle_payment_webhook_event"));

const paymentRoute = read("app/api/webhooks/payment/route.ts");
assert.match(paymentRoute, /AIPIFY_PAYMENT_WEBHOOK_SECRET/);
assert.match(paymentRoute, /createServiceRoleClient/);
assert.match(paymentRoute, /x-aipify-payment-webhook-secret/);
assert.doesNotMatch(paymentRoute, /from \"@\/lib\/supabase\/server\"/);
assert.doesNotMatch(paymentRoute, /createClient\(/);

console.log(`payment-rpc-hardening-v1.test.ts: ok sha=${sha}`);
