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
  it("uses APP_PORTAL_NAV_GROUPS without duplicate ids", () => {
    assertCanonicalNavIntegrity();
    const ids = APP_PORTAL_NAV_GROUPS.flatMap((group) => group.items.map((item) => item.id));
    assert.equal(new Set(ids).size, ids.length);
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
    ] as const) {
      assert.equal(isAppRouteNavVisible(id), false, id);
      assert.equal(resolveAppRouteReadiness(id).status, "hidden", id);
    }
  });

  it("keeps software catalog operational", () => {
    assert.equal(isAppRouteNavVisible("softwareCatalog"), true);
    const contract = buildCanonicalNavContracts().find((item) => item.id === "softwareCatalog");
    assert.ok(contract);
    assert.equal(contract?.route, "/app/software");
    assert.equal(contract?.readiness, "operational");
  });

  it("hides entitled nav without feature entitlement and keeps catalog-eligible", () => {
    const resolution = resolveCanonicalNavVisibility({
      organizationRole: "organization_member",
      featureEnabled: new Map([["business_packs", false], ["billing", true], ["workflows", false]]),
      permissionGranted: new Map(),
      activePackKeys: new Set(),
      pendingPackKeys: new Set(),
      activeModuleKeys: new Set(),
    });
    assert.equal(resolution.visibleNavIds.includes("installedBusinessPacks"), false);
    assert.equal(resolution.visibleNavIds.includes("appTasks"), false);
    assert.equal(resolution.visibleNavIds.includes("softwareCatalog"), true);
    const installed = resolution.decisions.find((d) => d.id === "installedBusinessPacks");
    assert.equal(installed?.catalogEligible, true);
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
