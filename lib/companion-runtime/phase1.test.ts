import assert from "node:assert/strict";
import {
  CUSTOMER_ACTIVE_LOCALE_ORDER,
  isCustomerActiveLocale,
} from "@/lib/i18n/customer-active-locale-registry";
import { listRegisteredIntegrationProviders } from "@/lib/integration-intelligence/manifest-registry";
import {
  deriveEnabledPortalFeatures,
  parseInstalledPackKeys,
  parseLicenseSubscriptionPackKeys,
  createEmptyCompanionTenantContext,
  resolveCompanionIntegrationContext,
} from "./companion-tenant-context";
import {
  ORG_KNOWLEDGE_MIN_RANK,
  parseOrganizationKnowledgeRow,
} from "./organization-knowledge";
import { isRegisteredLiveProvider } from "./provider-live-tools-shared";

assert.equal(
  parseOrganizationKnowledgeRow({
    id: "1",
    title: "Refund policy",
    slug: "refund-policy",
    content: "Published refund guidance.",
    rank: 0.42,
    status: "published",
    source_type: "article",
    published_at: "2026-01-15T10:00:00.000Z",
    language: "no",
  })?.body,
  "Published refund guidance.",
);

assert.equal(
  parseOrganizationKnowledgeRow({
    id: "2",
    title: "Legacy body field",
    slug: "legacy-body",
    body: "Should still parse when body is present.",
    score: 0.9,
    status: "published",
  })?.score,
  0.9,
);

assert.equal(
  parseOrganizationKnowledgeRow({
    id: "3",
    title: "Weak FAQ",
    slug: "weak-faq",
    content: "Low relevance",
    rank: 0.05,
    status: "published",
    source_type: "faq",
  }),
  null,
  "weak rank below threshold must not be used",
);

assert.equal(
  parseOrganizationKnowledgeRow({
    id: "4",
    title: "Draft",
    slug: "draft",
    content: "Draft content",
    rank: 0.9,
    status: "draft",
  }),
  null,
  "non-published rows must be rejected",
);

assert.ok(ORG_KNOWLEDGE_MIN_RANK > 0.05);

const tenantA = createEmptyCompanionTenantContext({
  connectedProviders: ["shopify"],
  primaryVerifiedProvider: "shopify",
});
const tenantB = createEmptyCompanionTenantContext({
  connectedProviders: ["unonight"],
  primaryVerifiedProvider: "unonight",
});

assert.equal(resolveCompanionIntegrationContext(null, tenantA), "shopify");
assert.equal(resolveCompanionIntegrationContext("unonight", tenantA), "shopify");
assert.equal(resolveCompanionIntegrationContext("shopify", tenantA), "shopify");
assert.equal(resolveCompanionIntegrationContext("unonight", tenantB), "unonight");

const emptyTenant = createEmptyCompanionTenantContext();
assert.equal(emptyTenant.primaryVerifiedProvider, null);
assert.equal(resolveCompanionIntegrationContext(null, emptyTenant), null);
assert.equal(resolveCompanionIntegrationContext("unonight", emptyTenant), null);

assert.deepEqual(parseInstalledPackKeys({
  installed_packs: [
    { pack_key: "inventory_pack", license_status: "active" },
    { pack_key: "finance_pack", license_status: "expired" },
  ],
}), ["inventory_pack"]);

assert.deepEqual(parseLicenseSubscriptionPackKeys({
  business_packs: [{ pack_key: "analytics_pack", license_status: "trial" }],
  domain_pack_installations: [{ pack_key: "supplier_pack", license_status: "active" }],
}), ["analytics_pack", "supplier_pack"]);

assert.ok(deriveEnabledPortalFeatures("business").includes("business_packs"));
assert.ok(!deriveEnabledPortalFeatures("starter").includes("business_packs"));

for (const locale of ["no", "en", "sv", "da", "es", "pl", "uk"]) {
  assert.ok(isCustomerActiveLocale(locale), `active locale registry must include ${locale}`);
}
assert.equal(CUSTOMER_ACTIVE_LOCALE_ORDER.length, 7);

assert.equal(isRegisteredLiveProvider(null), false);
assert.equal(isRegisteredLiveProvider("unknown-provider"), false);
assert.equal(isRegisteredLiveProvider("unonight"), true);
assert.ok(listRegisteredIntegrationProviders().includes("unonight"));

console.log("companion-runtime phase 1 tests passed");
