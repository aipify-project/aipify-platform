import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isCspStripeTestBridgeEnabled } from "./stripe-test-bridge";

const root = process.cwd();
const webhookRoute = readFileSync(join(root, "app/api/webhooks/stripe/route.ts"), "utf8");
const webhookHelper = readFileSync(join(root, "lib/certified-sales-partner/stripe-test-webhook.ts"), "utf8");

assert.match(webhookRoute, /authorizeStripeWebhook/);
assert.match(webhookRoute, /maybeApplyCspPaidPeriodFromAuthorizedStripeTest/);
assert.match(webhookHelper, /isCspStripeTestBridgeEnabled/);
assert.match(webhookHelper, /csp_apply_paid_period_event/);
assert.match(webhookHelper, /p_payload/);
assert.match(webhookHelper, /csp_customer_org_id/);
assert.doesNotMatch(webhookHelper, /metaString\(meta,\s*\[[^\]]*partner_id/);
assert.equal(isCspStripeTestBridgeEnabled(), false);

console.log("stripe-test-webhook.test.ts: ok");
