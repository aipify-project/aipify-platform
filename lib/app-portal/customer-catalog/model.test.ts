import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getAppPortalActiveNavId } from "@/lib/app-portal/nav-config";
import type { KompisProductAccessRead } from "@/lib/commercial-packages/portfolio-presentation";
import {
  buildCustomerCatalog,
  catalogHasBothIntervals,
  selectCatalogProducts,
} from "./model";

const access: KompisProductAccessRead = {
  webKind: "known_plan",
  webPlan: "free",
  bedrift: "not_licensed",
};

const catalog = buildCustomerCatalog({
  billing: {
    current_package: { package_name: "Aipify Starter", package_key: "starter" },
    upgrade_options: [{ package_key: "professional", package_name: "Professional", monthly_price: 3990 }],
    catalog_products: [
      {
        id: "aipify_voice",
        category: "voice",
        category_label: "Aipify Voice",
        name: "Voice to Invoice",
        published: true,
        availability: "coming_later",
        price_status: "planned",
        amount: 99,
        currency: "NOK",
        interval: "month",
      },
      {
        id: "storage_plus",
        category: "kompis",
        name: "Knowledge Storage+",
        published: true,
        price_status: "published",
        monthly: { price_status: "published", amount: 99, currency: "NOK" },
        annual: { price_status: "published", amount: 990, currency: "NOK" },
        checkout_enabled: true,
        stripe_price_id: "price_test",
        features: ["5 000 extra entries", "storage_plus_key"],
      },
    ],
  },
  access,
  billingUnavailable: false,
});

assert.equal(catalog.products.find((product) => product.id === "website_kompis")?.state, "active");
assert.equal(catalog.products.find((product) => product.id === "website_kompis")?.prices.length, 0);
assert.equal(catalog.products.find((product) => product.id === "kompis_bedrift")?.openHref, null);
assert.equal(catalog.products.some((product) => product.id === "professional"), false);
assert.equal(catalog.products.some((product) => product.title === "Voice to Invoice"), true);
const voice = catalog.products.find((product) => product.id === "aipify_voice");
assert.equal(voice?.state, "coming_later");
assert.equal(voice?.prices.length, 0);
assert.equal(voice?.checkoutEnabled, false);
const storage = catalog.products.find((product) => product.id === "storage_plus");
assert.equal(storage?.prices.length, 2);
assert.equal(storage?.checkoutEnabled, false);
assert.deepEqual(storage?.features, ["5 000 extra entries"]);
assert.equal(catalog.categories.some((category) => category.id === "voice"), true);
assert.equal(catalogHasBothIntervals(selectCatalogProducts(catalog, "kompis")), true);
assert.equal(selectCatalogProducts(catalog, "missing").length, catalog.products.length);

const purchasable = buildCustomerCatalog({
  billing: {
    catalog_products: [
      {
        id: "storage_plus",
        category: "kompis",
        name: "Knowledge Storage+",
        published: true,
        price_status: "published",
        monthly: {
          offer_id: "offer_storage_month",
          price_status: "published",
          amount: 99,
          currency: "NOK",
        },
      },
    ],
  },
  access: { webKind: "no_module", webPlan: null, bedrift: "not_licensed" },
  billingUnavailable: false,
  commerceCheckoutEnabled: true,
});
assert.equal(purchasable.products.find((product) => product.id === "storage_plus")?.checkoutEnabled, true);
assert.equal(
  purchasable.products.find((product) => product.id === "storage_plus")?.prices[0]?.offerId,
  "offer_storage_month"
);

const unknown = buildCustomerCatalog({
  billing: null,
  access: { webKind: "unavailable", webPlan: null, bedrift: "unknown" },
  billingUnavailable: true,
});
assert.equal(unknown.billingUnavailable, true);
assert.equal(unknown.products.every((product) => product.prices.length === 0), true);
assert.equal(unknown.categories.some((category) => category.id === "voice"), false);
assert.equal(unknown.products.find((product) => product.id === "website_kompis")?.openHref, null);

assert.equal(getAppPortalActiveNavId("/app/explore"), "softwareStore");

const page = readFileSync(join(process.cwd(), "app/app/explore/page.tsx"), "utf8");
const view = readFileSync(join(process.cwd(), "components/app/catalog/CustomerProductCatalog.tsx"), "utf8");
const modelSource = readFileSync(join(process.cwd(), "lib/app-portal/customer-catalog/model.ts"), "utf8");
assert.doesNotMatch(page + view, /PUBLIC_PLAN_PRICES|create-checkout-session|trialDays|14-day|599/);
assert.match(page, /getCustomerBillingCenter/);
assert.match(modelSource, /checkoutEnabled: false/);
assert.match(view, /pricingHeading/);
assert.match(view, /perMonth/);
assert.match(view, /perYear/);
assert.match(view, /purchaseClosed/);
assert.doesNotMatch(view, /AppWorkspaceHero/);

const installPanel = readFileSync(
  join(process.cwd(), "components/app/platform-install/PlatformInstallDashboardPanel.tsx"),
  "utf8",
);
assert.doesNotMatch(installPanel, /create-checkout-session/);
