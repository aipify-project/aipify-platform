/**
 * Job 62 — Platform → APP access control plane contract tests.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY,
  ACCESS_CAPABILITY_CATALOG,
  authorizeProductContext,
  buildPlatformCustomerControlPlaneSummary,
  evaluateActivationGate,
  isReservedHiddenCapability,
  isModuleUsableInSnapshot,
  resolveAccessControlPlaneSnapshot,
} from "@/lib/core/access-control-plane";
import {
  applyTenantModuleLookup,
  isKompisBedriftProductPath,
} from "@/lib/core/access-control-plane/tenant-module-lookup";
import { resolveAppMenuCapabilityBundle } from "@/lib/core/app-menu-capability";
import type { PlatformPortalCustomerDetail } from "@/lib/platform-portal/types";

const ROOT = process.cwd();

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function baseSnapshotInput(
  overrides: Partial<Parameters<typeof resolveAccessControlPlaneSnapshot>[0]> = {}
) {
  return {
    organizationId: "org-1",
    customerId: "cust-1",
    userId: "user-1",
    role: "organization_owner",
    membershipValid: true,
    subscriptionStatus: "active" as const,
    licenseServiceStatus: "active" as const,
    activeModuleKeys: new Set<string>(["website_kompis"]),
    correlationId: "acp_test",
    generatedAt: "2026-10-12T00:00:00.000Z",
    ...overrides,
  };
}

// Activation gate — all checks required
{
  const open = evaluateActivationGate({
    paymentOrContractValid: true,
    subscriptionValid: true,
    licenseValid: true,
    moduleAssignmentValid: true,
    tenantProductValid: true,
    runtimeCapabilityReady: true,
  });
  assert.equal(open.open, true);
  const closed = evaluateActivationGate({
    paymentOrContractValid: true,
    subscriptionValid: true,
    licenseValid: true,
    moduleAssignmentValid: false,
    tenantProductValid: true,
    runtimeCapabilityReady: true,
  });
  assert.equal(closed.open, false);
  assert.equal(closed.reasonCode, "module_inactive");
}

// Both products
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({
      activeModuleKeys: new Set(["website_kompis", "kompis_bedrift"]),
    })
  );
  assert.deepEqual(snap.authorizedProductIds.sort(), ["kompisBedrift", "kompisWeb"].sort());
  const design = snap.modules.find((m) => m.capabilityKey === KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY);
  assert.ok(design);
  assert.equal(design.visible, false);
  assert.equal(design.usable, false);
  assert.equal(design.reasonCode, "reserved_capability_hidden");
  assert.equal(isReservedHiddenCapability(KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY), true);
  assert.ok(ACCESS_CAPABILITY_CATALOG.some((e) => e.capabilityKey === KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY));
}

// Membership and Kompis Web do not grant Bedrift
{
  const membershipOnly = resolveAccessControlPlaneSnapshot(baseSnapshotInput());
  assert.deepEqual(membershipOnly.authorizedProductIds, ["kompisWeb"]);
  assert.equal(
    membershipOnly.products.find((p) => p.productId === "kompisBedrift")?.reasonCode,
    "module_status_unknown"
  );
  assert.equal(isModuleUsableInSnapshot(membershipOnly, "kompis_bedrift"), false);

  const inactive = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({
      activeModuleKeys: new Set(["website_kompis", "__kompis_bedrift_denied__"]),
    })
  );
  assert.deepEqual(inactive.authorizedProductIds, ["kompisWeb"]);
  assert.equal(
    inactive.products.find((p) => p.productId === "kompisBedrift")?.reasonCode,
    "product_not_entitled"
  );

  const ambiguous = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({
      activeModuleKeys: new Set(["website_kompis", "kompis_bedrift", "__kompis_bedrift_denied__"]),
      bedriftModuleEnabled: true,
    })
  );
  assert.equal(ambiguous.authorizedProductIds.includes("kompisBedrift"), false);
  assert.equal(isModuleUsableInSnapshot(ambiguous, "kompis_bedrift"), false);
}
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({ bedriftModuleEnabled: false })
  );
  assert.deepEqual(snap.authorizedProductIds, ["kompisWeb"]);
}

// Bedrift-only when the Core module key is explicit
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({ activeModuleKeys: new Set(["kompis_bedrift"]) })
  );
  assert.deepEqual(snap.authorizedProductIds, ["kompisBedrift"]);
  assert.equal(isModuleUsableInSnapshot(snap, "kompis_bedrift"), true);
  assert.equal(
    snap.products.find((p) => p.productId === "kompisWeb")?.reasonCode,
    "module_status_unknown"
  );
  const direct = authorizeProductContext({
    snapshot: snap,
    pathname: "/app/kompis-bedrift/employees",
    cookieValue: "kompisWeb",
  });
  assert.equal(direct.pathDenied, false);
  assert.equal(direct.activeProduct, "kompisBedrift");
}

// Suspended license
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({
      licenseServiceStatus: "paused",
      activeModuleKeys: new Set(["website_kompis", "kompis_bedrift"]),
    })
  );
  assert.deepEqual(snap.authorizedProductIds, []);
  assert.ok(snap.products.every((p) => p.reasonCode === "license_paused"));
}

// Cancelled subscription
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({
      subscriptionStatus: "cancelled",
      activeModuleKeys: new Set(["website_kompis", "kompis_bedrift"]),
    })
  );
  assert.deepEqual(snap.authorizedProductIds, []);
}

// Membership revoked
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({ membershipValid: false })
  );
  assert.deepEqual(snap.authorizedProductIds, []);
  assert.ok(snap.products.every((p) => p.reasonCode === "membership_missing"));
}

// Cookie and direct Bedrift URL are not authorization
{
  const webOnly = resolveAccessControlPlaneSnapshot(baseSnapshotInput());
  const cookie = authorizeProductContext({
    snapshot: webOnly,
    pathname: "/app/account/subscription",
    cookieValue: "kompisBedrift",
  });
  assert.equal(cookie.activeProduct, "kompisWeb");
  assert.equal(cookie.cookieIgnored, true);
  assert.equal(cookie.reasonCode, "cookie_not_authorization");

  const directBedrift = authorizeProductContext({
    snapshot: webOnly,
    pathname: "/app/kompis-bedrift/documents",
    cookieValue: "kompisBedrift",
  });
  assert.equal(directBedrift.pathDenied, true);
  assert.equal(directBedrift.activeProduct, "kompisWeb");
  assert.equal(isKompisBedriftProductPath("/app/kompis-bedrift/documents"), true);
  assert.equal(isKompisBedriftProductPath("/app/website-kompis"), false);
}

// Direct Web path denied when the Web module is absent
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({ activeModuleKeys: new Set(["kompis_bedrift"]) })
  );
  const authz = authorizeProductContext({
    snapshot: snap,
    pathname: "/app/website-kompis/faq",
    cookieValue: "kompisWeb",
  });
  assert.equal(authz.pathDenied, true);
  assert.equal(authz.activeProduct, "kompisBedrift");
  assert.equal(authz.reasonCode, "path_not_authorized");
}

{
  const keys = new Set<string>();
  applyTenantModuleLookup(keys, "kompis_bedrift", { error: null, data: true });
  assert.equal(keys.has("kompis_bedrift"), true);
  const missing = new Set<string>();
  applyTenantModuleLookup(missing, "kompis_bedrift", { error: null, data: null });
  assert.equal(missing.size, 0);
  const failed = new Set<string>();
  applyTenantModuleLookup(failed, "kompis_bedrift", { error: { message: "timeout" }, data: true });
  assert.equal(failed.size, 0);
  const inactiveLookup = new Set<string>();
  applyTenantModuleLookup(inactiveLookup, "kompis_bedrift", { error: null, data: false });
  assert.equal(inactiveLookup.has("__kompis_bedrift_denied__"), true);
  assert.equal(inactiveLookup.has("kompis_bedrift"), false);
}

{
  const loader = read("lib/core/access-control-plane/load-snapshot.ts");
  assert.match(loader, /p_module_key: KOMPIS_BEDRIFT_MODULE_KEY/);
  assert.match(loader, /customer_id \?\? context.organization_id/);
  assert.doesNotMatch(loader, /searchParams/);
  const layout = read("app/app/layout.tsx");
  assert.match(layout, /isKompisBedriftProductPath/);
  assert.match(layout, /isModuleUsableInSnapshot\(accessSnapshot, "kompis_bedrift"\)/);
  assert.match(layout, /redirect\("\/app"\)/);
}

// Menu capability fail-closed aligns with control plane for unknown WK
{
  const bundle = resolveAppMenuCapabilityBundle({
    organizationId: "org-1",
    userId: "user-1",
    role: "organization_owner",
    featureEnabled: new Map([["billing", true]]),
    permissionGranted: new Map(),
    activePackKeys: new Set(),
    pendingPackKeys: new Set(),
    revokedPackKeys: new Set(),
    activeModuleKeys: new Set(),
  });
  const web = bundle.capabilities.find((c) => c.capabilityId === "kompisWebDashboard");
  assert.equal(web?.visibleInNavigation, false);
  assert.equal(web?.reasonCode, "module_status_unknown");
}

// Platform summary from existing detail payload
{
  const detail: PlatformPortalCustomerDetail = {
    customer: {
      id: "cust-1",
      companyId: "co-1",
      name: "Example Org",
      legalName: "Example Org AS",
      slug: "example",
      organizationNumber: "123",
      status: "active",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-06-01T00:00:00.000Z",
      requiresAttention: false,
    },
    commercial: {
      lifetime: false,
      subscriptionStatus: "active",
      planName: "Business",
      trialStartsAt: null,
      trialEndsAt: null,
      currentPeriodStartsAt: null,
      currentPeriodEndsAt: null,
      partnerAttributed: false,
      partnerName: null,
    },
    usage: {
      memberCount: 2,
      activeLicenseCount: 1,
      totalLicenseCount: 1,
      domainCount: 1,
      installationCount: 1,
      openSupportCount: 0,
    },
    licenses: [
      {
        id: "lic-1",
        status: "active",
        productCode: "website_kompis",
        productName: "Website Kompis",
        domain: "example.com",
        installId: "inst-1",
        maskedLicenseCode: null,
        provisioningStatus: "active",
        createdAt: null,
        activatedAt: null,
        expiresAt: null,
      },
    ],
    domains: [],
    entitlements: [
      {
        id: "ent-1",
        code: "website_kompis",
        name: "Website Kompis",
        status: "active",
        grantedAt: null,
        expiresAt: null,
      },
    ],
    metadata: { generatedAt: "2026-10-12T12:00:00.000Z" },
  };
  const summary = buildPlatformCustomerControlPlaneSummary(detail);
  assert.equal(summary.overallStatus, "active");
  assert.equal(summary.provisioningReady, true);
  assert.equal(summary.membershipReady, true);
}

// No SQL / migration files in this job scope
assert.doesNotMatch(read("lib/core/access-control-plane/load-snapshot.ts"), /apply_migration|CREATE TABLE/i);

// Frozen Website Kompis hashes
const manifest = JSON.parse(
  read("docs/integrations/website-kompis-public-chain-frozen-manifest.json")
) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };
for (const entry of manifest.protectedRuntimeFiles) {
  const actual = createHash("sha256").update(read(entry.path)).digest("hex");
  assert.equal(actual, entry.sha256, `frozen hash mismatch: ${entry.path}`);
}

// Companion still absent from shell
assert.doesNotMatch(read("components/dashboard/DashboardShell.tsx"), /CompanionFloatingButton/);

console.log("access-control-plane-62.test.ts: all assertions passed");
