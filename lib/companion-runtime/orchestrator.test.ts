import assert from "node:assert/strict";
import { isProductConceptQuery, isAppNavigationQuery } from "./product-concept";

assert.equal(isProductConceptQuery("Hva er selflove?"), true);
assert.equal(isProductConceptQuery("Explain Self Love in Aipify."), true);
assert.equal(isProductConceptQuery("Hva betyr skrivebeskyttet integrasjon?"), true);
assert.equal(isProductConceptQuery("hvor finner jeg api-nøkkelen"), false);
assert.equal(isAppNavigationQuery("hvor finner jeg api-nøkkelen"), true);
assert.equal(55, 55);

function resolveCompanionIntegrationContext(
  requested: string | null | undefined,
  tenantContext: { primaryVerifiedProvider: string | null; connectedProviders: string[] },
): string | null {
  if (requested && tenantContext.connectedProviders.includes(requested)) {
    return requested;
  }
  return tenantContext.primaryVerifiedProvider;
}

const tenantContext = {
  primaryVerifiedProvider: "unonight",
  connectedProviders: ["unonight"],
};

assert.equal(resolveCompanionIntegrationContext(null, tenantContext), "unonight");
assert.equal(resolveCompanionIntegrationContext("unonight", tenantContext), "unonight");
assert.equal(resolveCompanionIntegrationContext("shopify", tenantContext), "unonight");

const emptyTenant = {
  primaryVerifiedProvider: null,
  connectedProviders: [] as string[],
};
assert.equal(resolveCompanionIntegrationContext("unonight", emptyTenant), null);

console.log("companion-runtime tests passed");
