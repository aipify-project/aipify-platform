import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveAppCommerceCheckoutGate, isStripeSecretTestMode } from "./checkout-policy";
import { createAppCommerceCheckout } from "./create-commerce-checkout";
import { buildCommerceInvoiceReadModel } from "./invoices-read";
import { buildAppCommerceCatalog, findPublishedOffer } from "./published-catalog";
import { getCommerceSubscriptionChangePolicy } from "./subscription-change-policy";
import {
  buildPaymentWebhookPayload,
  resolveAipifyCustomerIdFromStripeObject,
} from "./webhook-customer";

const publishedBilling = {
  catalog_products: [
    {
      id: "website_kompis",
      product_key: "website_kompis",
      category: "kompis",
      name: "Kompis Web",
      published: true,
      publication_status: "published",
      purchasable: true,
      monthly: {
        offer_id: "offer_wk_month_nok",
        price_status: "published",
        amount: 2490,
        currency: "NOK",
        interval: "month",
        market: "NO",
        stripe_price_id: "price_test_month",
        trial_days: 0,
      },
      annual: {
        offer_id: "offer_wk_year_nok",
        price_status: "published",
        amount: 24900,
        currency: "NOK",
        interval: "year",
        market: "NO",
        stripe_price_id: "price_test_year",
        trial_days: 0,
      },
    },
  ],
};

const productionGate = resolveAppCommerceCheckoutGate({
  VERCEL_ENV: "production",
  AIPIFY_APP_COMMERCE_TEST_CHECKOUT: "1",
});
assert.equal(productionGate.checkoutEnabled, false);
assert.equal(productionGate.productionCheckoutClosed, true);

const testGate = resolveAppCommerceCheckoutGate({
  VERCEL_ENV: "preview",
  NODE_ENV: "development",
  AIPIFY_APP_COMMERCE_TEST_CHECKOUT: "1",
});
assert.equal(testGate.checkoutEnabled, true);

assert.equal(isStripeSecretTestMode("sk_test_123"), true);
assert.equal(isStripeSecretTestMode("sk_live_123"), false);

const closedCatalog = buildAppCommerceCatalog({
  billing: publishedBilling,
  env: { VERCEL_ENV: "production" },
});
assert.equal(closedCatalog.checkoutEnabled, false);
assert.equal(closedCatalog.products[0]?.prices.length, 2);
assert.ok(findPublishedOffer(closedCatalog, "offer_wk_month_nok"));

const openCatalog = buildAppCommerceCatalog({
  billing: publishedBilling,
  env: { VERCEL_ENV: "preview", AIPIFY_APP_COMMERCE_TEST_CHECKOUT: "1" },
});
assert.equal(openCatalog.checkoutEnabled, true);

async function main() {
  const closedCheckout = await createAppCommerceCheckout({
    catalog: openCatalog,
    offerId: "offer_wk_month_nok",
    customerId: "00000000-0000-4000-8000-000000000001",
    organizationId: "00000000-0000-4000-8000-000000000099",
    successUrl: "https://example.com/ok",
    cancelUrl: "https://example.com/cancel",
    env: { VERCEL_ENV: "production", AIPIFY_APP_COMMERCE_TEST_CHECKOUT: "1", STRIPE_SECRET_KEY: "sk_test_x" },
  });
  assert.equal(closedCheckout.ok, false);
  if (!closedCheckout.ok) assert.equal(closedCheckout.error, "checkout_closed");

  const blockedExternal = await createAppCommerceCheckout({
    catalog: openCatalog,
    offerId: "offer_wk_month_nok",
    customerId: "00000000-0000-4000-8000-000000000001",
    organizationId: "00000000-0000-4000-8000-000000000099",
    successUrl: "https://example.com/ok",
    cancelUrl: "https://example.com/cancel",
    env: { VERCEL_ENV: "preview", AIPIFY_APP_COMMERCE_TEST_CHECKOUT: "1" },
  });
  assert.equal(blockedExternal.ok, true);
  if (blockedExternal.ok) {
    assert.equal(blockedExternal.demoMode, true);
    assert.equal(blockedExternal.reason, "stripe_test_credentials_missing");
  }

  const activeBlock = await createAppCommerceCheckout({
    catalog: openCatalog,
    offerId: "offer_wk_month_nok",
    customerId: "00000000-0000-4000-8000-000000000001",
    organizationId: "00000000-0000-4000-8000-000000000099",
    successUrl: "https://example.com/ok",
    cancelUrl: "https://example.com/cancel",
    hasActivePaidSubscription: true,
    env: { VERCEL_ENV: "preview", AIPIFY_APP_COMMERCE_TEST_CHECKOUT: "1", STRIPE_SECRET_KEY: "sk_test_x" },
  });
  assert.equal(activeBlock.ok, false);
  if (!activeBlock.ok) assert.equal(activeBlock.error, "active_subscription_exists");

  assert.equal(
    resolveAipifyCustomerIdFromStripeObject({
      customer: "cus_123",
      metadata: { customer_id: "00000000-0000-4000-8000-000000000001" },
    }),
    "00000000-0000-4000-8000-000000000001"
  );
  assert.equal(
    resolveAipifyCustomerIdFromStripeObject({
      customer: "cus_123",
      metadata: { customer_id: "cus_123" },
    }),
    null
  );

  const payload = buildPaymentWebhookPayload({
    id: "sub_1",
    metadata: { plan_key: "website_kompis" },
  });
  assert.equal(payload.plan_key, "website_kompis");

  assert.equal(getCommerceSubscriptionChangePolicy().allowed, false);

  const invoices = buildCommerceInvoiceReadModel({});
  assert.equal(invoices.available, false);
  assert.equal(invoices.blocker, "no_authoritative_invoice_source");

  const sqlPath = join(process.cwd(), "docs/platform/sql-candidates/app_commerce_published_catalog_v1.sql");
  const sql = readFileSync(sqlPath, "utf8");
  const sha = createHash("sha256").update(sql).digest("hex");
  assert.match(sql, /get_app_commerce_published_catalog/);
  assert.match(sql, /PREPARED_ONLY/);
  assert.match(sql, /revoke all on function public.get_app_commerce_published_catalog/);
  assert.equal(sha.length, 64);

  const checkoutRoute = readFileSync(join(process.cwd(), "app/api/app-commerce/checkout/route.ts"), "utf8");
  assert.match(checkoutRoute, /offerId/);
  assert.doesNotMatch(checkoutRoute, /STRIPE_PRICE_ID_/);
  assert.doesNotMatch(checkoutRoute, /priceId/);

  const stripeRoute = readFileSync(join(process.cwd(), "app/api/webhooks/stripe/route.ts"), "utf8");
  assert.match(stripeRoute, /resolveAipifyCustomerIdFromStripeObject/);
  assert.match(stripeRoute, /createServiceRoleClient/);

  console.log("app-commerce-v1.test.ts: ok", { sqlSha256: sha });
}

void main();
