import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createWebsiteKompisActivationIdempotencyKey,
  mapWebsiteKompisActivationRpcError,
  parseActivateWebsiteKompisInput,
  parsePlatformPortalWebsiteKompisActivationResult,
  parsePlatformPortalWebsiteKompisStatus,
  reasonLabel,
  websiteKompisStatusVariant,
} from "./website-kompis-activation";

const customerId = "32d748eb-9a66-4174-a416-18a813610d3e";

assert.equal(
  parseActivateWebsiteKompisInput(customerId, {
    internalReason: "Platform activation",
    confirmation: true,
    idempotencyKey: "wpk-key-123456",
  }).ok,
  true,
);
assert.equal(
  parseActivateWebsiteKompisInput(customerId, {
    internalReason: "no",
    confirmation: true,
    idempotencyKey: "wpk-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseActivateWebsiteKompisInput(customerId, {
    internalReason: "Contains sk-secretvaluehere",
    confirmation: true,
    idempotencyKey: "wpk-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseActivateWebsiteKompisInput(customerId, {
    internalReason: "Platform activation",
    confirmation: false,
    idempotencyKey: "wpk-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseActivateWebsiteKompisInput(customerId, {
    internalReason: "Platform activation",
    confirmation: true,
    idempotencyKey: "bad-key-123456",
  }).ok,
  false,
);
assert.match(createWebsiteKompisActivationIdempotencyKey(), /^wpk-/);

const status = parsePlatformPortalWebsiteKompisStatus({
  customer_id: customerId,
  eligible: true,
  active: false,
  activation_status: "ready_for_activation",
  reasons: [
    { code: "agreement_active", satisfied: true },
    { code: "license_active", satisfied: true },
  ],
  agreement: { eligible: true, status: "active", duration: "lifetime" },
  license: {
    eligible: true,
    id: "3c9597de-9bea-4100-8099-b101cadd837e",
    status: "active",
    product_code: "app_subscription",
    provisioning_status: "ready_for_activation",
  },
  domain: {
    eligible: true,
    id: "5eb7133a-a9b1-461b-a78f-49a9e29f14eb",
    hostname: "unonight.com",
    status: "active",
    verified: true,
  },
  installation: {
    eligible: true,
    id: "180c9d31-3340-4633-b210-3b64edf1e1be",
    install_id: "180c9d31-3340-4633-b210-3b64edf1e1be",
    status: "active",
  },
  approval: { required: false, satisfied: true },
  existing_activation: { id: null, status: null, activated_at: null },
});
assert.ok(status);
assert.equal(status.eligible, true);
assert.equal(status.domain.hostname, "unonight.com");
assert.equal(status.reasons.length, 2);
assert.equal(status.reasons[0]?.satisfied, true);
assert.equal(parsePlatformPortalWebsiteKompisStatus({ reasons: null })?.reasons.length, undefined);
assert.equal(
  parsePlatformPortalWebsiteKompisStatus({
    customer_id: customerId,
    eligible: false,
    active: false,
    reasons: null,
  })?.reasons.length,
  0,
);

const result = parsePlatformPortalWebsiteKompisActivationResult({
  customer_id: customerId,
  created: false,
  idempotent_replay: true,
  activation: {
    id: "571a7cb7-3cc5-4efe-bcd4-1073190b5e31",
    module_code: "website_kompis",
    status: "enabled",
    activated_at: null,
  },
  entitlement: {
    id: "571a7cb7-3cc5-4efe-bcd4-1073190b5e31",
    status: "enabled",
    created: false,
  },
  license: {
    id: "3c9597de-9bea-4100-8099-b101cadd837e",
    status: "active",
    provisioning_status: "active",
  },
  domain: { id: "5eb7133a-a9b1-461b-a78f-49a9e29f14eb", hostname: "unonight.com" },
  installation: {
    id: "180c9d31-3340-4633-b210-3b64edf1e1be",
    install_id: "180c9d31-3340-4633-b210-3b64edf1e1be",
  },
});
assert.ok(result);
assert.equal(result.idempotentReplay, true);
assert.equal(result.domain.hostname, "unonight.com");

assert.deepEqual(mapWebsiteKompisActivationRpcError("LICENSE_REQUIRED"), {
  status: 422,
  code: "license_required",
});
assert.equal(websiteKompisStatusVariant("active"), "success");
assert.equal(websiteKompisStatusVariant("ready_for_activation"), "warning");
assert.match(
  reasonLabel("agreement_active", { agreement_activeOk: "ok" }, true),
  /ok/,
);

const migration = readFileSync(
  "supabase/migrations/20261934600000_platform_portal_website_kompis_activation.sql",
  "utf8",
);
assert.match(migration, /tenant_modules/);
assert.match(migration, /tenant_public_companion_install_config/);
assert.match(migration, /_wpkf_merge_install_config/);
assert.match(migration, /_ppsf258_require_platform_access/);
assert.match(migration, /_platform_portal_derive_license_provisioning_status/);
assert.match(migration, /activation_not_conflicting/);
assert.doesNotMatch(migration, /create table/i);
assert.doesNotMatch(migration, /activate_website_kompis_for_domain/);
assert.doesNotMatch(migration, /organization_module_activations/);

const route = readFileSync(
  "app/api/platform-portal/customers/[id]/website-kompis/route.ts",
  "utf8",
);
assert.match(route, /get_platform_portal_customer_website_kompis_status/);
assert.match(route, /activate_platform_portal_customer_website_kompis/);
assert.match(route, /no-store/);

for (const locale of ["en", "no", "da", "sv", "pl", "uk"]) {
  const wk = JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"))
    .customers.websiteKompis;
  assert.ok(wk.sectionActivatedServices);
  assert.ok(wk.reasons.agreementActiveOk);
  assert.ok(wk.readyForActivation);
}
assert.equal(
  JSON.parse(readFileSync("locales/no/platform.json", "utf8")).customers
    .websiteKompis.success,
  "Website Kompis er aktivert",
);
assert.doesNotMatch(
  JSON.parse(readFileSync("locales/no/platform.json", "utf8")).customers
    .websiteKompis.notEligible,
  /not ready for activation/i,
);

const panel = readFileSync(
  "components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx",
  "utf8",
);
assert.match(panel, /website-kompis/);
assert.match(panel, /PlatformPortalWebsiteKompisActivationPanel/);
assert.match(panel, /sectionActivatedServices/);
assert.doesNotMatch(panel, /module_key/);
assert.doesNotMatch(panel, /organization_module_activations/);

const modal = readFileSync(
  "components/platform/platform-portal/PlatformPortalWebsiteKompisActivationPanel.tsx",
  "utf8",
);
assert.match(modal, /summaryNoDns/);
assert.match(modal, /confirmRequired/);
assert.match(modal, /idempotencyKey/);
assert.doesNotMatch(modal, /createClient/);

const frozenRuntime = [
  "lib/marketing/website-kompis-licensed-availability.ts",
  "lib/marketing/website-kompis-embed.ts",
];
for (const file of frozenRuntime) {
  assert.ok(readFileSync(file, "utf8").includes("website_kompis") || readFileSync(file, "utf8").includes("WEBSITE_KOMPIS"));
}

console.log("website-kompis-activation: all tests passed");
