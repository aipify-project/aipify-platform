import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { authorizeStripeWebhook } from "./stripe-client";

const payload = JSON.stringify({
  type: "invoice.payment_succeeded",
  data: { object: { metadata: { customer_id: "00000000-0000-4000-8000-000000000001" } } },
});
const secret = "whsec_test_only";

function sign(body: string, key: string): string {
  const timestamp = "1700000000";
  const digest = createHmac("sha256", key).update(`${timestamp}.${body}`, "utf8").digest("hex");
  return `t=${timestamp},v1=${digest}`;
}

assert.deepEqual(authorizeStripeWebhook({ payload, signature: null, secret: undefined }), {
  ok: false,
  status: 401,
  error: "Webhook signature required",
});
assert.deepEqual(authorizeStripeWebhook({ payload, signature: sign(payload, secret), secret: undefined }), {
  ok: false,
  status: 401,
  error: "Webhook signature required",
});
assert.deepEqual(authorizeStripeWebhook({ payload, signature: null, secret }), {
  ok: false,
  status: 401,
  error: "Webhook signature required",
});
assert.deepEqual(authorizeStripeWebhook({ payload, signature: "t=1,v1=abcd", secret }), {
  ok: false,
  status: 400,
  error: "Invalid signature",
});
assert.deepEqual(authorizeStripeWebhook({ payload, signature: sign(payload, "other-secret"), secret }), {
  ok: false,
  status: 400,
  error: "Invalid signature",
});
assert.deepEqual(authorizeStripeWebhook({ payload, signature: sign(payload, secret), secret }), { ok: true });

const route = readFileSync(join(process.cwd(), "app/api/webhooks/stripe/route.ts"), "utf8");
const gateAt = route.indexOf("authorizeStripeWebhook");
const serviceAt = route.indexOf("createServiceRoleClient");
const mutationAt = route.indexOf("handle_payment_webhook_event");
assert.ok(gateAt > 0 && serviceAt > gateAt && mutationAt > serviceAt);
assert.match(route, /createServiceRoleClient/);
assert.doesNotMatch(route, /from \"@\/lib\/supabase\/server\"/);
assert.doesNotMatch(route, /if\s*\(\s*webhookSecret\s*&&\s*signature\s*\)/);
assert.doesNotMatch(route, /create-checkout-session|STRIPE_SECRET_KEY|STRIPE_PRICE_ID/);

console.log("stripe-webhook-gate.test.ts: ok");
