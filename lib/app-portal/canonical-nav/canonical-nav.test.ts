import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { APP_PORTAL_NAV_GROUPS } from "@/lib/app-portal/nav-config";
import {
  assertCanonicalNavIntegrity,
  buildCanonicalNavContracts,
  resolveCanonicalNavVisibility,
  summarizePurchaseActivationChain,
} from "@/lib/app-portal/canonical-nav";
import {
  isAppRouteNavVisible,
  resolveAppRouteReadiness,
} from "@/lib/app-production-experience/route-readiness";

describe("canonical nav foundation", () => {
  it("builds unique canonical contracts (shared invoice/subscription appear once)", () => {
    assertCanonicalNavIntegrity();
    const contracts = buildCanonicalNavContracts();
    const ids = contracts.map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length);
    // Shared items may appear in both product order lists; groups alone are not unique.
    assert.ok(APP_PORTAL_NAV_GROUPS.length >= 1);
  });

  it("hides foundation shells from nav visibility", () => {
    for (const id of [
      "appTasks",
      "workflows",
      "rolesPermissions",
      "contactSupport",
      "accountSecurity",
      "activityOverview",
      "apiAccess",
      "profile",
      "upgradeOptions",
      "installedBusinessPacks",
      "availableBusinessPacks",
      "businessPackSettings",
    ] as const) {
      assert.equal(isAppRouteNavVisible(id), false, id);
      assert.equal(resolveAppRouteReadiness(id).status, "hidden", id);
    }
  });

  it("keeps Web modules route operational (software surface via product menu)", () => {
    assert.equal(isAppRouteNavVisible("kompisWebModules"), true);
    const contract = buildCanonicalNavContracts().find((item) => item.id === "kompisWebModules");
    assert.ok(contract);
    assert.equal(contract?.route, "/app/software");
    assert.equal(contract?.readiness, "operational");
  });

  it("hides legacy mega-nav shells that are not in the flat product contracts", () => {
    const resolution = resolveCanonicalNavVisibility({
      organizationRole: "organization_member",
      featureEnabled: new Map([["business_packs", false], ["billing", true], ["workflows", false]]),
      permissionGranted: new Map(),
      activePackKeys: new Set(),
      pendingPackKeys: new Set(),
      activeModuleKeys: new Set(),
    });
    assert.equal(resolution.visibleNavIds.includes("installedBusinessPacks"), false);
    assert.equal(resolution.visibleNavIds.includes("availableBusinessPacks"), false);
    assert.equal(resolution.visibleNavIds.includes("appTasks"), false);
    assert.equal(resolution.visibleNavIds.includes("softwareCatalog"), false);
    assert.ok(resolution.visibleNavIds.includes("accountSubscription"));
  });

  it("hides permission-gated intelligence without grants", () => {
    const resolution = resolveCanonicalNavVisibility({
      organizationRole: "organization_member",
      featureEnabled: new Map(),
      permissionGranted: new Map([["scenario_planning.view", false]]),
      activePackKeys: new Set(),
      pendingPackKeys: new Set(),
      activeModuleKeys: new Set(),
    });
    assert.equal(resolution.visibleNavIds.includes("scenarioPlanning"), false);
  });

  it("documents purchase chain without claiming full mutation readiness", () => {
    const summary = summarizePurchaseActivationChain();
    assert.ok(summary.operational >= 1);
    assert.ok(summary.partial >= 1);
    assert.ok(summary.missing >= 1);
  });
});
