import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST,
  bedriftReasonLabel,
  createKompisBedriftActivationIdempotencyKey,
  isKompisBedriftActivateOwnerAuthorized,
  kompisBedriftStatusVariant,
  mapKompisBedriftActivationRpcError,
  parseActivateKompisBedriftInput,
  parsePlatformPortalKompisBedriftStatus,
} from "./kompis-bedrift-activation";

const customerId = "32d748eb-9a66-4174-a416-18a813610d3e";
const unonightCustomerId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

assert.equal(KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST.size, 0);
assert.equal(isKompisBedriftActivateOwnerAuthorized(customerId), false);
assert.equal(isKompisBedriftActivateOwnerAuthorized(unonightCustomerId), false);

assert.equal(
  parseActivateKompisBedriftInput(customerId, {
    internalReason: "Platform status panel",
    confirmation: true,
    idempotencyKey: "bpk-key-123456",
  }).ok,
  true,
);
assert.equal(
  parseActivateKompisBedriftInput(customerId, {
    internalReason: "no",
    confirmation: true,
    idempotencyKey: "bpk-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseActivateKompisBedriftInput(customerId, {
    internalReason: "Contains sk-secretvaluehere",
    confirmation: true,
    idempotencyKey: "bpk-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseActivateKompisBedriftInput(customerId, {
    internalReason: "Platform status panel",
    confirmation: false,
    idempotencyKey: "bpk-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseActivateKompisBedriftInput(customerId, {
    internalReason: "Platform status panel",
    confirmation: true,
    idempotencyKey: "bad-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseActivateKompisBedriftInput("not-a-uuid", {
    internalReason: "Platform status panel",
    confirmation: true,
    idempotencyKey: "bpk-key-123456",
  }).ok,
  false,
);
assert.match(createKompisBedriftActivationIdempotencyKey(), /^bpk-/);

const status = parsePlatformPortalKompisBedriftStatus({
  customer_id: customerId,
  eligible: true,
  active: false,
  reasons: [
    { code: "agreement_active", satisfied: true },
    { code: "subscription_active", satisfied: false },
  ],
  subscription: {
    id: "3c9597de-9bea-4100-8099-b101cadd837e",
    status: "active",
    plan_key: "app_subscription",
  },
  existing_activation: { id: null, status: null, licensed: false, enabled: false, activated_at: null },
  notes: {
    no_membership_default: true,
    no_employee_knowledge_alias: true,
    grants_only_via_platform_activate: true,
  },
});
assert.ok(status);
assert.equal(status.moduleKey, "kompis_bedrift");
assert.equal(status.eligible, true);
assert.equal(status.active, false);
assert.equal(status.displayStatus, "eligible");
assert.equal(status.subscription?.planKey, "app_subscription");
assert.equal(status.reasons.length, 2);
assert.equal(status.activateAuthorized, false);
assert.equal(status.notes.noMembershipDefault, true);
assert.equal(status.notes.noEmployeeKnowledgeAlias, true);
assert.equal(status.notes.grantsOnlyViaPlatformActivate, true);

const camel = parsePlatformPortalKompisBedriftStatus({
  customerId,
  active: true,
  eligible: true,
  reasons: ["agreement_active"],
  subscription: { id: null, status: "trialing", planKey: "pro" },
  existingActivation: {
    id: "571a7cb7-3cc5-4efe-bcd4-1073190b5e31",
    status: "enabled",
    licensed: true,
    enabled: true,
    activatedAt: "2026-10-01T00:00:00Z",
  },
  notes: {
    noMembershipDefault: true,
    noEmployeeKnowledgeAlias: true,
    grantsOnlyViaPlatformActivate: true,
  },
  activateAuthorized: true,
});
assert.ok(camel);
assert.equal(camel.displayStatus, "active");
assert.equal(camel.activateAuthorized, false);
assert.equal(camel.existingActivation?.licensed, true);
assert.equal(camel.reasons[0]?.code, "agreement_active");

assert.equal(parsePlatformPortalKompisBedriftStatus({ reasons: null }), null);
assert.equal(
  parsePlatformPortalKompisBedriftStatus({
    customer_id: customerId,
    eligible: false,
    active: false,
    reasons: null,
  })?.reasons.length,
  0,
);

assert.deepEqual(mapKompisBedriftActivationRpcError("NOT_ELIGIBLE"), {
  status: 422,
  code: "not_eligible",
});
assert.deepEqual(mapKompisBedriftActivationRpcError("ALREADY_ACTIVE"), {
  status: 409,
  code: "already_active",
});
assert.deepEqual(mapKompisBedriftActivationRpcError("ACCESS DENIED: PLATFORM ADMIN"), {
  status: 403,
  code: "forbidden",
});
assert.equal(kompisBedriftStatusVariant("active"), "success");
assert.equal(kompisBedriftStatusVariant("eligible"), "warning");
assert.equal(kompisBedriftStatusVariant("inactive"), "muted");
assert.match(
  bedriftReasonLabel("agreement_active", { agreement_activeOk: "ok" }, true),
  /ok/,
);

const migration = readFileSync(
  "supabase/migrations/20261939000000_kompis_bedrift_product_entitlement_register_v1.sql",
  "utf8",
);
assert.match(migration, /get_platform_portal_customer_kompis_bedrift_status/);
assert.match(migration, /activate_platform_portal_customer_kompis_bedrift/);
assert.match(migration, /module_key = 'kompis_bedrift'/);
assert.match(migration, /_ppsf258_require_platform_access/);
assert.doesNotMatch(migration, /module_key = 'website_kompis'/);
assert.doesNotMatch(migration, /activate_platform_portal_customer_website_kompis/);

const route = readFileSync(
  "app/api/platform-portal/customers/[id]/kompis-bedrift/route.ts",
  "utf8",
);
assert.match(route, /get_platform_portal_customer_kompis_bedrift_status/);
assert.match(route, /activate_platform_portal_customer_kompis_bedrift/);
assert.match(route, /isKompisBedriftActivateOwnerAuthorized/);
assert.match(route, /owner_activation_authorization_required/);
assert.match(route, /no-store/);
assert.doesNotMatch(route, /KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST\.add/);

const allowlistSource = readFileSync(
  "lib/platform-portal/kompis-bedrift-activation.ts",
  "utf8",
);
assert.match(
  allowlistSource,
  /KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST[\s\S]*new Set\(\)/,
);

for (const locale of ["en", "no", "da", "sv", "pl", "uk", "es"]) {
  const kb = JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"))
    .customers.kompisBedrift;
  assert.ok(kb.sectionTitle, locale);
  assert.ok(kb.activateLockedBody, locale);
  assert.ok(kb.activateUnavailable, locale);
  assert.ok(kb.reasons.agreementActiveOk, locale);
  assert.ok(kb.productWebsiteKompis, locale);
  assert.ok(kb.productKompisBedrift, locale);
  assert.ok(kb.productEmployeeKnowledgeNote, locale);
}
assert.match(
  JSON.parse(readFileSync("locales/no/platform.json", "utf8")).customers
    .kompisBedrift.activateUnavailable,
  /eier|autorisasjon|godkjenn/i,
);

const panel = readFileSync(
  "components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx",
  "utf8",
);
assert.match(panel, /PlatformPortalKompisBedriftStatusPanel/);
assert.match(panel, /kompisBedriftLabels/);

const statusPanel = readFileSync(
  "components/platform/platform-portal/PlatformPortalKompisBedriftStatusPanel.tsx",
  "utf8",
);
assert.match(statusPanel, /activateLockedTitle/);
assert.match(statusPanel, /disabled/);
assert.match(statusPanel, /resolvePlatformStatusLabel/);
assert.doesNotMatch(statusPanel, /method:\s*["']POST["']/);
assert.doesNotMatch(statusPanel, /createClient/);

const page = readFileSync("app/platform/customers/[id]/page.tsx", "utf8");
assert.match(page, /buildPlatformPortalKompisBedriftLabels/);
assert.match(page, /kompisBedriftLabels/);

// Frozen Website Kompis public chain — 46/46 must remain untouched by this job
const manifest = JSON.parse(
  readFileSync(
    "docs/integrations/website-kompis-public-chain-frozen-manifest.json",
    "utf8",
  ),
) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };
assert.equal(manifest.protectedRuntimeFiles.length, 46);
for (const entry of manifest.protectedRuntimeFiles) {
  const actual = createHash("sha256")
    .update(readFileSync(entry.path))
    .digest("hex");
  assert.equal(actual, entry.sha256, `frozen hash mismatch: ${entry.path}`);
}

console.log("kompis-bedrift-activation: all tests passed");
