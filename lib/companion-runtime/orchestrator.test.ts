import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import { isProductConceptQuery, isAppNavigationQuery } from "./product-concept";
import {
  createEmptyCompanionTenantContext,
  resolveCompanionIntegrationContext,
} from "./companion-tenant-context";

assert.equal(isProductConceptQuery("Hva er selflove?"), true);
assert.equal(isProductConceptQuery("Explain Self Love in Aipify."), true);
assert.equal(isProductConceptQuery("Hva betyr skrivebeskyttet integrasjon?"), true);
assert.equal(isProductConceptQuery("hvor finner jeg api-nøkkelen"), false);
assert.equal(isAppNavigationQuery("hvor finner jeg api-nøkkelen"), true);

const tenantContext = createEmptyCompanionTenantContext({
  primaryVerifiedProvider: "demo-booking",
  connectedProviders: ["demo-booking"],
});

assert.equal(resolveCompanionIntegrationContext(null, tenantContext), "demo-booking");
assert.equal(resolveCompanionIntegrationContext("demo-booking", tenantContext), "demo-booking");
assert.equal(resolveCompanionIntegrationContext("shopify", tenantContext), "demo-booking");

const emptyTenant = createEmptyCompanionTenantContext();
assert.equal(resolveCompanionIntegrationContext(PILOT_INTEGRATION_PROVIDER_KEY, emptyTenant), null);

console.log("companion-runtime tests passed");
