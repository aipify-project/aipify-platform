import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  appKompisDeliveryReasonLabel,
  createAppKompisDeliveryIdempotencyKey,
  deliveryStatusVariant,
  mapAppKompisDeliveryRpcError,
  parseDeliverAppKompisInput,
  parsePlatformPortalAppKompisDeliveryResult,
  parsePlatformPortalAppKompisDeliveryStatus,
  parsePlatformPortalAppKompisReconcileResult,
} from "./app-kompis-delivery";
import { assertDeliveryLocaleParity, discoverPlatformLocales } from "./app-kompis-delivery-locales";

const customerId = "32d748eb-9a66-4174-a416-18a813610d3e";

// --- parseDeliverAppKompisInput ---------------------------------------------

assert.equal(
  parseDeliverAppKompisInput(customerId, {
    internalReason: "Platform delivery",
    confirmation: true,
    idempotencyKey: "akd-key-123456",
  }).ok,
  true,
);
assert.equal(parseDeliverAppKompisInput("not-a-uuid", {}).ok, false);
assert.equal(
  parseDeliverAppKompisInput(customerId, {
    internalReason: "no",
    confirmation: true,
    idempotencyKey: "akd-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseDeliverAppKompisInput(customerId, {
    internalReason: "Contains sk-secretvaluehere",
    confirmation: true,
    idempotencyKey: "akd-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseDeliverAppKompisInput(customerId, {
    internalReason: "Platform delivery",
    confirmation: false,
    idempotencyKey: "akd-key-123456",
  }).ok,
  false,
);
assert.equal(
  parseDeliverAppKompisInput(customerId, {
    internalReason: "Platform delivery",
    confirmation: true,
    idempotencyKey: "wpk-key-123456", // wrong prefix
  }).ok,
  false,
);
assert.equal(
  parseDeliverAppKompisInput(customerId, {
    internalReason: "Platform delivery",
    confirmation: true,
    idempotencyKey: "akd-key-123456",
  }).ok,
  true,
);
// missing body entirely
assert.equal(parseDeliverAppKompisInput(customerId, null).ok, false);
assert.equal(parseDeliverAppKompisInput(customerId, undefined).ok, false);

// --- idempotency key ---------------------------------------------------------

assert.match(createAppKompisDeliveryIdempotencyKey(), /^akd-/);
assert.notEqual(
  createAppKompisDeliveryIdempotencyKey(),
  createAppKompisDeliveryIdempotencyKey(),
);

// --- parsePlatformPortalAppKompisDeliveryStatus ------------------------------

const status = parsePlatformPortalAppKompisDeliveryStatus({
  customer_id: customerId,
  delivery_status: "ready",
  eligible: true,
  active: false,
  blocked: false,
  reasons: [
    { code: "parent_license_active", satisfied: true },
    { code: "domain_verified", satisfied: false },
  ],
  agreement: { eligible: true, status: "active", duration: "lifetime" },
  parent_license: {
    id: "3c9597de-9bea-4100-8099-b101cadd837e",
    status: "active",
    product_code: "app_subscription",
    provisioning_status: "active",
    eligible: true,
  },
  app_panel: {
    organization_id: "9a2a6eab-e47d-4473-9fd5-baee226d4db7",
    status: "active",
    eligible: true,
  },
  child_entitlement: {
    id: "571a7cb7-3cc5-4efe-bcd4-1073190b5e31",
    module_key: "website_kompis",
    status: "enabled",
    licensed: true,
    enabled: true,
    delivery_model: "canonical_v1",
    eligible: true,
  },
  domain: {
    id: "5eb7133a-a9b1-461b-a78f-49a9e29f14eb",
    hostname: "example.com",
    status: "active",
    verified: false,
    eligible: false,
  },
  installation: {
    id: "180c9d31-3340-4633-b210-3b64edf1e1be",
    install_id: "180c9d31-3340-4633-b210-3b64edf1e1be",
    status: "active",
    token_present: true,
    revoked: false,
    active: true,
    eligible: true,
  },
  auto_install: { config_enabled: true, synced: true, last_synced_at: "2026-07-01T00:00:00Z" },
  acknowledgement: {
    ok: true,
    enabled: true,
    licensed: true,
    status_enabled: true,
    token_present: true,
    not_revoked: true,
    status_active: true,
    checked_at: "2026-07-01T00:00:00Z",
  },
  existing_delivery: { id: null, status: null, delivered_at: null },
  last_checked_at: "2026-07-01T00:00:00Z",
  last_attempt_at: null,
});
assert.ok(status);
assert.equal(status.deliveryStatus, "ready");
assert.equal(status.eligible, true);
assert.equal(status.parentLicense.productCode, "app_subscription");
assert.equal(status.childEntitlement.deliveryModel, "canonical_v1");
assert.equal(status.domain.hostname, "example.com");
assert.equal(status.installation.tokenPresent, true);
assert.equal(status.acknowledgement.ok, true);
assert.equal(status.reasons.length, 2);
assert.equal(status.reasons[0]?.satisfied, true);
assert.equal(status.reasons[1]?.satisfied, false);

// malformed payload
assert.equal(parsePlatformPortalAppKompisDeliveryStatus(null), null);
assert.equal(parsePlatformPortalAppKompisDeliveryStatus({}), null);
assert.equal(parsePlatformPortalAppKompisDeliveryStatus({ customer_id: "not-a-uuid" }), null);

// missing arrays / nested objects normalize to safe defaults
const minimalStatus = parsePlatformPortalAppKompisDeliveryStatus({
  customer_id: customerId,
  eligible: false,
  active: false,
  reasons: null,
});
assert.ok(minimalStatus);
assert.deepEqual(minimalStatus.reasons, []);
assert.equal(minimalStatus.deliveryStatus, "not_started");
assert.equal(minimalStatus.parentLicense.id, null);
assert.equal(minimalStatus.domain.hostname, null);
assert.equal(minimalStatus.installation.tokenPresent, false);
assert.equal(minimalStatus.acknowledgement.ok, false);
assert.equal(minimalStatus.lastCheckedAt, null);

// unknown status falls back to derived status
const unknownStatus = parsePlatformPortalAppKompisDeliveryStatus({
  customer_id: customerId,
  delivery_status: "totally_unknown_value",
  eligible: true,
  active: true,
  reasons: [],
});
assert.equal(unknownStatus?.deliveryStatus, "active");

// --- parsePlatformPortalAppKompisDeliveryResult ------------------------------

const deliverResult = parsePlatformPortalAppKompisDeliveryResult({
  customer_id: customerId,
  created: true,
  idempotent_replay: false,
  delivery_status: "active",
  delivery: { id: "d1", status: "active", delivered_at: "2026-07-01T00:00:00Z" },
  parent_license: { id: "l1", status: "active", provisioning_status: "active" },
  app_panel: { organization_id: "o1", status: "active" },
  child_entitlement: { id: "c1", status: "enabled", licensed: true, enabled: true },
  domain: { id: "dm1", hostname: "example.com" },
  installation: { id: "i1", install_id: "i1" },
  auto_install: { config_enabled: true },
  acknowledgement: {
    ok: true,
    enabled: true,
    licensed: true,
    status_enabled: true,
    token_present: true,
    not_revoked: true,
    status_active: true,
    checked_at: null,
  },
});
assert.ok(deliverResult);
assert.equal(deliverResult.created, true);
assert.equal(deliverResult.deliveryStatus, "active");
assert.equal(deliverResult.domain.hostname, "example.com");
assert.equal(deliverResult.acknowledgement.ok, true);

assert.equal(parsePlatformPortalAppKompisDeliveryResult(null), null);
assert.equal(parsePlatformPortalAppKompisDeliveryResult({ customer_id: "bad" }), null);

// --- parsePlatformPortalAppKompisReconcileResult -----------------------------

const reconcileResult = parsePlatformPortalAppKompisReconcileResult({
  customer_id: customerId,
  created: false,
  idempotent_replay: true,
  delivery_status: "active",
  reconciled: true,
  changes: ["auto_install_enabled", "", 42, "acknowledgement_reverified"],
  delivery: { id: "d1", status: "active", delivered_at: null },
});
assert.ok(reconcileResult);
assert.equal(reconcileResult.reconciled, true);
assert.deepEqual(reconcileResult.changes, [
  "auto_install_enabled",
  "acknowledgement_reverified",
]);

assert.equal(parsePlatformPortalAppKompisReconcileResult(undefined), null);
assert.deepEqual(
  parsePlatformPortalAppKompisReconcileResult({
    customer_id: customerId,
    changes: null,
  })?.changes,
  [],
);

// --- mapAppKompisDeliveryRpcError --------------------------------------------

assert.deepEqual(mapAppKompisDeliveryRpcError("PARENT_LICENSE_REQUIRED"), {
  status: 422,
  code: "parent_license_required",
});
assert.deepEqual(mapAppKompisDeliveryRpcError("DELIVERY_NOT_FOUND"), {
  status: 404,
  code: "delivery_not_found",
});
assert.deepEqual(mapAppKompisDeliveryRpcError("access denied: platform admin required"), {
  status: 403,
  code: "forbidden",
});
assert.deepEqual(mapAppKompisDeliveryRpcError("something unexpected"), {
  status: 500,
  code: "unknown",
});
assert.deepEqual(mapAppKompisDeliveryRpcError(null), { status: 500, code: "unknown" });

// --- deliveryStatusVariant ----------------------------------------------------

assert.equal(deliveryStatusVariant("active"), "success");
assert.equal(deliveryStatusVariant("ready"), "warning");
assert.equal(deliveryStatusVariant("awaiting_confirmation"), "warning");
assert.equal(deliveryStatusVariant("attention"), "warning");
assert.equal(deliveryStatusVariant("checking_requirements"), "info");
assert.equal(deliveryStatusVariant("provisioning_app"), "info");
assert.equal(deliveryStatusVariant("provisioning_companion"), "info");
assert.equal(deliveryStatusVariant("installing"), "info");
assert.equal(deliveryStatusVariant("failed"), "danger");
assert.equal(deliveryStatusVariant("suspended"), "danger");
assert.equal(deliveryStatusVariant("revoked"), "danger");
assert.equal(deliveryStatusVariant("not_started"), "muted");
assert.equal(deliveryStatusVariant(null), "muted");
assert.equal(deliveryStatusVariant("nonsense"), "muted");

// --- appKompisDeliveryReasonLabel ---------------------------------------------

assert.match(
  appKompisDeliveryReasonLabel("parent_license_active", { parent_license_activeOk: "ok" }, true),
  /ok/,
);
assert.match(
  appKompisDeliveryReasonLabel(
    "parent_license_active",
    { parent_license_activeMissing: "missing" },
    false,
  ),
  /missing/,
);
assert.equal(
  appKompisDeliveryReasonLabel("unknown_code", { notEligible: "fallback" }, true),
  "fallback",
);

// --- discoverPlatformLocales / assertDeliveryLocaleParity ---------------------

const locales = discoverPlatformLocales();
assert.ok(locales.includes("en"));
assert.ok(locales.includes("no"));
assert.ok(locales.includes("da"));
assert.ok(locales.includes("sv"));
assert.ok(locales.includes("pl"));
assert.ok(locales.includes("uk"));

const parityIssues = assertDeliveryLocaleParity((localeFilePath) =>
  readFileSync(localeFilePath, "utf8"),
);
assert.deepEqual(parityIssues, []);

// --- locale content checks ----------------------------------------------------

for (const locale of ["en", "no", "da", "sv", "pl", "uk"]) {
  const dict = JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"));
  const section = dict.customers.appKompisDelivery;
  assert.ok(section, `${locale}: missing customers.appKompisDelivery`);
  assert.ok(section.sectionTitle, `${locale}: missing sectionTitle`);
  assert.ok(section.deliver, `${locale}: missing deliver`);
  assert.ok(section.reconcile, `${locale}: missing reconcile`);
  assert.ok(section.verify, `${locale}: missing verify`);
  assert.ok(section.statuses?.active, `${locale}: missing statuses.active`);
  assert.ok(
    section.statuses?.awaitingConfirmation,
    `${locale}: missing statuses.awaitingConfirmation`,
  );
  assert.ok(
    section.reasons?.parentLicenseActiveOk,
    `${locale}: missing reasons.parentLicenseActiveOk`,
  );
  assert.ok(section.modalSteps?.installing, `${locale}: missing modalSteps.installing`);
}

assert.equal(
  JSON.parse(readFileSync("locales/no/platform.json", "utf8")).customers.appKompisDelivery
    .startDelivery,
  "Start leveransen",
);
assert.doesNotMatch(
  JSON.parse(readFileSync("locales/no/platform.json", "utf8")).customers.appKompisDelivery
    .notEligible,
  /not ready/i,
);

// --- no Unonight / customer-specific strings in the application layer --------

const sourceFile = readFileSync("lib/platform-portal/app-kompis-delivery.ts", "utf8");
assert.doesNotMatch(sourceFile, /unonight/i);
assert.doesNotMatch(sourceFile, /sk-[a-z0-9]{10,}/i);

const localesHelperFile = readFileSync(
  "lib/platform-portal/app-kompis-delivery-locales.ts",
  "utf8",
);
assert.doesNotMatch(localesHelperFile, /unonight/i);
assert.doesNotMatch(localesHelperFile, /node:fs/);

for (const locale of ["en", "no", "da", "sv", "pl", "uk"]) {
  const raw = readFileSync(`locales/${locale}/platform.json`, "utf8");
  const dict = JSON.parse(raw);
  const section = JSON.stringify(dict.customers.appKompisDelivery);
  assert.doesNotMatch(section, /unonight/i, `${locale}: appKompisDelivery must not mention Unonight`);
}

// --- API route presence and wiring -------------------------------------------

const deliveryRoute = readFileSync(
  "app/api/platform-portal/customers/[id]/app-kompis-delivery/route.ts",
  "utf8",
);
assert.match(deliveryRoute, /get_platform_portal_app_kompis_delivery_status/);
assert.match(deliveryRoute, /deliver_platform_customer_app_and_website_kompis/);
assert.match(deliveryRoute, /no-store/);
assert.match(deliveryRoute, /awaiting_confirmation/);

const reconcileRoute = readFileSync(
  "app/api/platform-portal/customers/[id]/app-kompis-delivery/reconcile/route.ts",
  "utf8",
);
assert.match(reconcileRoute, /reconcile_platform_customer_app_and_website_kompis/);
assert.match(reconcileRoute, /no-store/);

// --- UI wiring ------------------------------------------------------------------

const panel = readFileSync(
  "components/platform/platform-portal/PlatformPortalAppKompisDeliveryPanel.tsx",
  "utf8",
);
assert.match(panel, /sectionTitle/);
assert.match(panel, /confirmRequired/);
assert.match(panel, /createAppKompisDeliveryIdempotencyKey/);
assert.doesNotMatch(panel, /createClient/);
assert.doesNotMatch(panel, /unonight/i);

const detailPanel = readFileSync(
  "components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx",
  "utf8",
);
assert.match(detailPanel, /PlatformPortalAppKompisDeliveryPanel/);
assert.match(detailPanel, /appKompisDeliveryLabels/);
// Website Kompis activation panel must remain wired — this feature never removes it.
assert.match(detailPanel, /PlatformPortalWebsiteKompisActivationPanel/);

const detailPage = readFileSync("app/platform/customers/[id]/page.tsx", "utf8");
assert.match(detailPage, /buildPlatformPortalAppKompisDeliveryLabels/);
assert.match(detailPage, /appKompisDeliveryLabels/);

// --- regression: APP Website Kompis gate still reads tenant_modules ------------

const availabilityFile = readFileSync(
  "lib/marketing/website-kompis-licensed-availability.ts",
  "utf8",
);
assert.match(availabilityFile, /WEBSITE_KOMPIS_CAPABILITY_KEY = "website_kompis"/);
assert.doesNotMatch(availabilityFile, /unonight/i);

// --- migration assertions (parent agent adds the migration file separately) ---

let migration: string | null = null;
try {
  migration = readFileSync(
    "supabase/migrations/20261935000000_platform_app_kompis_canonical_delivery.sql",
    "utf8",
  );
} catch {
  migration = null;
}

if (migration) {
  assert.match(migration, /get_platform_portal_app_kompis_delivery_status/);
  assert.match(migration, /deliver_platform_customer_app_and_website_kompis/);
  assert.match(migration, /reconcile_platform_customer_app_and_website_kompis/);
  assert.match(migration, /tenant_modules/);
  assert.match(migration, /tenant_public_companion_install_config/);
  assert.match(migration, /aipify_billing_license_links/);
  assert.match(migration, /_ppsf258_require_platform_access/);
  assert.match(migration, /record_platform_admin_audit_event/);
  assert.match(migration, /search_path = public/);
  assert.match(migration, /from public, anon/);
  assert.match(migration, /to authenticated/);
  assert.doesNotMatch(migration, /unonight/i);
  console.log("app-kompis-delivery: migration assertions passed");
} else {
  console.log(
    "app-kompis-delivery: migration file not present yet — skipping migration content assertions (application layer only)",
  );
}

console.log("app-kompis-delivery: all tests passed");
