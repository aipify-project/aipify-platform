import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { presentAppNavFromCapabilities } from "@/lib/app-portal/canonical-nav/present-from-capabilities";
import { APP_PORTAL_NAV_GROUPS } from "@/lib/app-portal/nav-config";
import { mergeDynamicWithFallbackNav } from "@/lib/dynamic-navigation/build-app-nav";
import { createTranslator } from "@/lib/i18n/translate";
import {
  APP_MENU_CAPABILITY_CONTRACT_VERSION,
  buildAppMenuCapabilityCacheKey,
  buildFailClosedAppMenuCapabilityBundle,
  getVisibleCapabilityIds,
  isCapabilityAllowed,
  resolveAppMenuCapabilityBundle,
} from "@/lib/core/app-menu-capability";

const t = createTranslator({
  customerApp: {
    portalStructure: {
      navGroups: Object.fromEntries(
        APP_PORTAL_NAV_GROUPS.map((g) => [g.id, g.id])
      ),
      nav: Object.fromEntries(
        APP_PORTAL_NAV_GROUPS.flatMap((g) =>
          g.items.map((item) => [item.id, item.id])
        )
      ),
    },
  },
});

function emptyCtx(overrides: Partial<Parameters<typeof resolveAppMenuCapabilityBundle>[0]> = {}) {
  return {
    organizationId: "org-1",
    userId: "user-1",
    role: "organization_owner",
    featureEnabled: new Map<string, boolean>(),
    permissionGranted: new Map<string, boolean>(),
    activePackKeys: new Set<string>(),
    pendingPackKeys: new Set<string>(),
    revokedPackKeys: new Set<string>(),
    activeModuleKeys: new Set<string>(),
    ...overrides,
  };
}

describe("core app menu capability contract", () => {
  it("hides foundation capabilities from navigation", () => {
    const bundle = resolveAppMenuCapabilityBundle(emptyCtx());
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
    ]) {
      const cap = bundle.capabilities.find((item) => item.capabilityId === id);
      assert.ok(cap, id);
      assert.equal(cap?.visibleInNavigation, false, id);
      assert.equal(cap?.usable, false, id);
      assert.ok(
        cap?.state === "foundation" || cap?.state === "disabled",
        `${id} state=${cap?.state}`
      );
    }
  });

  it("keeps software catalog while unfinished pack shells stay foundation-hidden", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      emptyCtx({
        featureEnabled: new Map([["business_packs", false], ["billing", true]]),
      })
    );
    const installed = bundle.capabilities.find((c) => c.capabilityId === "installedBusinessPacks");
    assert.equal(installed?.visibleInNavigation, false);
    assert.equal(installed?.usable, false);
    assert.equal(installed?.state, "foundation");
    assert.equal(isCapabilityAllowed(bundle, "softwareCatalog"), true);
    assert.equal(isCapabilityAllowed(bundle, "installedBusinessPacks"), false);
    assert.equal(isCapabilityAllowed(bundle, "availableBusinessPacks"), false);
    assert.equal(isCapabilityAllowed(bundle, "businessPackSettings"), false);
  });

  it("keeps pending packs out of navigation", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      emptyCtx({
        featureEnabled: new Map([["business_packs", true]]),
        pendingPackKeys: new Set(["aipify_hosts"]),
        activePackKeys: new Set(),
      })
    );
    const installed = bundle.capabilities.find((c) => c.capabilityId === "installedBusinessPacks");
    assert.equal(installed?.state, "foundation");
    assert.equal(installed?.visibleInNavigation, false);
  });

  it("revokes pack navigation when packs are suspended and feature off", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      emptyCtx({
        featureEnabled: new Map([["business_packs", false]]),
        revokedPackKeys: new Set(["aipify_hosts"]),
        activePackKeys: new Set(),
      })
    );
    const installed = bundle.capabilities.find((c) => c.capabilityId === "installedBusinessPacks");
    // Foundation readiness wins — unfinished shells stay hidden even when revoked.
    assert.equal(installed?.state, "foundation");
    assert.equal(installed?.visibleInNavigation, false);
  });

  it("fails closed without mega-nav or foundation", () => {
    const bundle = buildFailClosedAppMenuCapabilityBundle({
      organizationId: "org-1",
      userId: "user-1",
      role: "organization_member",
    });
    const visible = getVisibleCapabilityIds(bundle);
    assert.ok(visible.has("appDashboard"));
    assert.equal(visible.has("appTasks"), false);
    assert.equal(visible.has("workflows"), false);
    const presented = presentAppNavFromCapabilities(bundle, t);
    assert.ok(presented.navConfig.every((item) => visible.has(item.id)));
    assert.equal(
      presented.navConfig.some((item) => item.id === "megaOnlyEngine"),
      false
    );
  });

  it("presentation never surfaces unknown or mega-nav-only ids", () => {
    const bundle = resolveAppMenuCapabilityBundle(emptyCtx());
    const poisoned = {
      ...bundle,
      capabilities: [
        ...bundle.capabilities,
        {
          capabilityId: "megaOnlyEngine",
          state: "active" as const,
          visibleInNavigation: true,
          usable: true,
          reasonCode: "injected",
        },
      ],
    };
    const presented = presentAppNavFromCapabilities(poisoned, t);
    assert.equal(
      presented.navConfig.some((item) => item.id === "megaOnlyEngine"),
      false
    );
    const portalIds = new Set(
      APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id))
    );
    for (const item of presented.navConfig) {
      assert.ok(portalIds.has(item.id as never), item.id);
    }
  });

  it("dynamic merge cannot replace Core presentation fallback", () => {
    const fallbackGroups = [
      {
        id: "home",
        label: "Home",
        items: [{ id: "appDashboard", href: "/app", label: "Dashboard" }],
      },
    ];
    const fallbackConfig = [{ id: "appDashboard", href: "/app", label: "Dashboard" }];
    const dynamic = {
      navGroups: [
        {
          id: "legacy",
          label: "Legacy",
          items: [
            { id: "appTasks", href: "/app/operations/tasks", label: "Tasks" },
            { id: "megaOnlyEngine", href: "/app/mega", label: "Mega" },
          ],
        },
      ],
      navConfig: [
        { id: "appTasks", href: "/app/operations/tasks", label: "Tasks" },
        { id: "megaOnlyEngine", href: "/app/mega", label: "Mega" },
      ],
    };
    const merged = mergeDynamicWithFallbackNav(dynamic, fallbackGroups, fallbackConfig);
    assert.deepEqual(merged.navConfig.map((i) => i.id), ["appDashboard"]);
    assert.equal(
      merged.navConfig.some((i) => i.id === "appTasks" || i.id === "megaOnlyEngine"),
      false
    );
  });

  it("cache key includes org user and version", () => {
    const key = buildAppMenuCapabilityCacheKey({
      organizationId: "org-a",
      userId: "user-b",
    });
    assert.match(key, new RegExp(APP_MENU_CAPABILITY_CONTRACT_VERSION));
    assert.match(key, /org-a/);
    assert.match(key, /user-b/);
    assert.notEqual(
      key,
      buildAppMenuCapabilityCacheKey({ organizationId: "org-b", userId: "user-b" })
    );
  });

  it("unauthorized role cannot see owner settings", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      emptyCtx({ role: "organization_member" })
    );
    const settings = bundle.capabilities.find((c) => c.capabilityId === "organizationSettings");
    assert.equal(settings?.visibleInNavigation, false);
    assert.equal(settings?.reasonCode, "unauthorized_role");
    const closed = buildFailClosedAppMenuCapabilityBundle({
      organizationId: "org-1",
      userId: "user-1",
      role: "organization_member",
    });
    assert.equal(isCapabilityAllowed(closed, "organizationSettings"), false);
    assert.equal(isCapabilityAllowed(closed, "appDashboard"), true);
  });

  it("unknown capability id is never treated as allowed", () => {
    const bundle = resolveAppMenuCapabilityBundle(emptyCtx());
    assert.equal(isCapabilityAllowed(bundle, "totallyUnknownCapability"), false);
  });

  it("active pack entitlement cannot reintroduce unfinished installed packs nav", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      emptyCtx({
        featureEnabled: new Map([["business_packs", true]]),
        activePackKeys: new Set(["aipify_hosts"]),
      })
    );
    assert.equal(isCapabilityAllowed(bundle, "installedBusinessPacks"), false);
    const installed = bundle.capabilities.find((c) => c.capabilityId === "installedBusinessPacks");
    assert.equal(installed?.state, "foundation");
    assert.equal(isCapabilityAllowed(bundle, "softwareCatalog"), true);
  });
});
