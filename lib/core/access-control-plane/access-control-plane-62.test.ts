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
  resolveAccessControlPlaneSnapshot,
} from "@/lib/core/access-control-plane";
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
  const snap = resolveAccessControlPlaneSnapshot(baseSnapshotInput());
  assert.deepEqual(snap.authorizedProductIds.sort(), ["kompisBedrift", "kompisWeb"].sort());
  const design = snap.modules.find((m) => m.capabilityKey === KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY);
  assert.ok(design);
  assert.equal(design.visible, false);
  assert.equal(design.usable, false);
  assert.equal(design.reasonCode, "reserved_capability_hidden");
  assert.equal(isReservedHiddenCapability(KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY), true);
  assert.ok(ACCESS_CAPABILITY_CATALOG.some((e) => e.capabilityKey === KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY));
}

// Web-only (Bedrift module explicitly off)
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({ bedriftModuleEnabled: false })
  );
  assert.deepEqual(snap.authorizedProductIds, ["kompisWeb"]);
}

// Bedrift-only (no website_kompis module)
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({ activeModuleKeys: new Set() })
  );
  assert.deepEqual(snap.authorizedProductIds, ["kompisBedrift"]);
  assert.equal(
    snap.products.find((p) => p.productId === "kompisWeb")?.reasonCode,
    "module_status_unknown"
  );
}

// Suspended license
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({ licenseServiceStatus: "paused" })
  );
  assert.deepEqual(snap.authorizedProductIds, []);
  assert.ok(snap.products.every((p) => p.reasonCode === "license_paused"));
}

// Cancelled subscription
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({ subscriptionStatus: "cancelled" })
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

// Cookie tampering — preference ignored when not authorized
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({ activeModuleKeys: new Set() })
  );
  const authz = authorizeProductContext({
    snapshot: snap,
    pathname: "/app/account/subscription",
    cookieValue: "kompisWeb",
  });
  assert.equal(authz.activeProduct, "kompisBedrift");
  assert.equal(authz.cookieIgnored, true);
  assert.equal(authz.reasonCode, "cookie_not_authorization");
}

// Direct path denied → safe fallback, no data bleed into unauthorized product
{
  const snap = resolveAccessControlPlaneSnapshot(
    baseSnapshotInput({ activeModuleKeys: new Set() })
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
