import assert from "node:assert/strict";
import {
  PRODUCT_ACTIVATION_FREE_ACCOUNT_RULES,
  appSoftwareLicensedScopeHref,
  parseSoftwareCatalogScope,
  resolvePostRegistrationActivationHref,
  resolveProductActivationNextSteps,
} from "./product-activation-journey";
import { APP_SOFTWARE_STORE_ROUTE } from "./app-customer-journey";

assert.equal(PRODUCT_ACTIVATION_FREE_ACCOUNT_RULES.catalogBrowseRequiresLicense, false);
assert.equal(PRODUCT_ACTIVATION_FREE_ACCOUNT_RULES.checkoutLive, false);
assert.equal(parseSoftwareCatalogScope("licensed"), "licensed");
assert.equal(parseSoftwareCatalogScope("all"), "all");
assert.equal(parseSoftwareCatalogScope(undefined), "all");
assert.equal(appSoftwareLicensedScopeHref(), `${APP_SOFTWARE_STORE_ROUTE}?scope=licensed`);

const activeWeb = resolveProductActivationNextSteps({
  productKey: "kompis_web",
  accessState: "active",
  openHref: "/app/website-kompis",
});
assert.ok(activeWeb.some((s) => s.id === "open_product"));
assert.ok(activeWeb.some((s) => s.id === "web_connection"));
assert.ok(activeWeb.some((s) => s.id === "support"));
assert.ok(!activeWeb.some((s) => s.href.includes("checkout")));

const inactive = resolveProductActivationNextSteps({
  productKey: "kompis_web",
  accessState: "not_purchased",
  openHref: "/app/website-kompis",
});
assert.ok(inactive.some((s) => s.id === "subscription"));
assert.ok(!inactive.some((s) => s.id === "open_product"));

assert.equal(
  resolvePostRegistrationActivationHref({ hasAnyEntitlement: false }),
  APP_SOFTWARE_STORE_ROUTE,
);
assert.equal(
  resolvePostRegistrationActivationHref({
    hasAnyEntitlement: true,
    preferredProductKey: "kompis_bedrift",
  }),
  "/app/kompis-bedrift",
);

console.log("product-activation-journey.test.ts: ok");
