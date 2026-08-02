/**
 * Exact 12 bypass scenarios for
 * AIPIFY.CORE.CANONICAL.APP.MENU.CAPABILITY.CONTRACT.V1.FINAL.PREMERGE.VERIFICATION
 *
 * Test-only evidence — no product behavior changes.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  intersectNavWithCapabilities,
  presentAppNavFromCapabilities,
} from "@/lib/app-portal/canonical-nav/present-from-capabilities";
import { APP_PORTAL_NAV_GROUPS } from "@/lib/app-portal/nav-config";
import { mergeDynamicWithFallbackNav } from "@/lib/dynamic-navigation/build-app-nav";
import { createTranslator } from "@/lib/i18n/translate";
import {
  buildAppMenuCapabilityCacheKey,
  buildFailClosedAppMenuCapabilityBundle,
  getVisibleCapabilityIds,
  isCapabilityAllowed,
  resolveAppMenuCapabilityBundle,
  type AppMenuCapabilityBundle,
} from "@/lib/core/app-menu-capability";

const t = createTranslator({
  customerApp: {
    portalStructure: {
      navGroups: Object.fromEntries(APP_PORTAL_NAV_GROUPS.map((g) => [g.id, g.id])),
      nav: Object.fromEntries(
        APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items.map((item) => [item.id, item.id]))
      ),
    },
  },
});

function ctx(
  overrides: Partial<Parameters<typeof resolveAppMenuCapabilityBundle>[0]> = {}
) {
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

function dynamicCandidates(ids: Array<{ id: string; href: string }>) {
  return [
    {
      id: "dynamic",
      label: "Dynamic",
      items: ids.map((item) => ({ ...item, label: item.id })),
    },
  ];
}

describe("bypass scenario 01 — dynamic foundation hidden", () => {
  it("01 dynamic payload with foundation item is discarded by merge and intersect", () => {
    const core = presentAppNavFromCapabilities(resolveAppMenuCapabilityBundle(ctx()), t);
    const dynamic = {
      navGroups: dynamicCandidates([
        { id: "appTasks", href: "/app/operations/tasks" },
        { id: "workflows", href: "/app/operations/workflows" },
      ]),
      navConfig: [
        { id: "appTasks", href: "/app/operations/tasks", label: "Tasks" },
        { id: "workflows", href: "/app/operations/workflows", label: "Workflows" },
      ],
    };
    const merged = mergeDynamicWithFallbackNav(dynamic, core.navGroups, core.navConfig);
    assert.equal(merged.navConfig.some((i) => i.id === "appTasks"), false);
    assert.equal(merged.navConfig.some((i) => i.id === "workflows"), false);

    const intersected = intersectNavWithCapabilities(dynamic.navGroups, resolveAppMenuCapabilityBundle(ctx()));
    assert.equal(
      intersected.flatMap((g) => g.items).some((i) => i.id === "appTasks" || i.id === "workflows"),
      false
    );
  });
});

describe("bypass scenario 02 — dynamic unknown hidden", () => {
  it("02 dynamic payload with unknown item is discarded", () => {
    const bundle = resolveAppMenuCapabilityBundle(ctx());
    const dynamic = dynamicCandidates([
      { id: "totallyUnknownCapability", href: "/app/unknown" },
    ]);
    const intersected = intersectNavWithCapabilities(dynamic, bundle);
    assert.deepEqual(intersected, []);
    assert.equal(isCapabilityAllowed(bundle, "totallyUnknownCapability"), false);

    const presented = presentAppNavFromCapabilities(
      {
        ...bundle,
        capabilities: [
          ...bundle.capabilities,
          {
            capabilityId: "totallyUnknownCapability",
            state: "active",
            visibleInNavigation: true,
            usable: true,
          },
        ],
      },
      t
    );
    assert.equal(
      presented.navConfig.some((i) => i.id === "totallyUnknownCapability"),
      false
    );
  });
});

describe("bypass scenario 03 — dynamic active without entitlement hidden", () => {
  it("03 dynamic installedBusinessPacks without entitlement stays hidden", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      ctx({
        featureEnabled: new Map([["business_packs", false]]),
        activePackKeys: new Set(),
      })
    );
    assert.equal(isCapabilityAllowed(bundle, "installedBusinessPacks"), false);
    assert.equal(
      bundle.capabilities.find((c) => c.capabilityId === "installedBusinessPacks")?.state,
      "available"
    );

    const dynamic = dynamicCandidates([
      { id: "installedBusinessPacks", href: "/app/business-packs/installed" },
    ]);
    const intersected = intersectNavWithCapabilities(dynamic, bundle);
    assert.deepEqual(intersected, []);

    const core = presentAppNavFromCapabilities(bundle, t);
    const merged = mergeDynamicWithFallbackNav(
      {
        navGroups: dynamic,
        navConfig: [
          {
            id: "installedBusinessPacks",
            href: "/app/business-packs/installed",
            label: "Installed",
          },
        ],
      },
      core.navGroups,
      core.navConfig
    );
    assert.equal(merged.navConfig.some((i) => i.id === "installedBusinessPacks"), false);
  });
});

describe("bypass scenario 04 — mega-nav-only item hidden", () => {
  it("04 item that exists only in mega-nav never appears in Customer APP presentation", () => {
    const bundle = resolveAppMenuCapabilityBundle(ctx());
    const poisoned: AppMenuCapabilityBundle = {
      ...bundle,
      capabilities: [
        ...bundle.capabilities,
        {
          capabilityId: "aipifyCorePlatformEngine",
          state: "active",
          visibleInNavigation: true,
          usable: true,
          reasonCode: "mega_injected",
        },
      ],
    };
    const presented = presentAppNavFromCapabilities(poisoned, t);
    assert.equal(
      presented.navConfig.some((i) => i.id === "aipifyCorePlatformEngine"),
      false
    );
    const portalIds = new Set(APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id)));
    assert.equal(portalIds.has("aipifyCorePlatformEngine" as never), false);
  });
});

describe("bypass scenario 05 — pending not in nav", () => {
  it("05 pending capability is catalog/status only — not navigation", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      ctx({
        featureEnabled: new Map([["business_packs", true]]),
        pendingPackKeys: new Set(["aipify_hosts"]),
        activePackKeys: new Set(),
      })
    );
    const installed = bundle.capabilities.find((c) => c.capabilityId === "installedBusinessPacks");
    assert.equal(installed?.state, "pending");
    assert.equal(installed?.visibleInNavigation, false);
    assert.equal(installed?.usable, false);
    assert.equal(isCapabilityAllowed(bundle, "installedBusinessPacks"), false);
  });
});

describe("bypass scenario 06 — available not in nav", () => {
  it("06 available capability is catalog only — not navigation", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      ctx({
        featureEnabled: new Map([["business_packs", false]]),
        activePackKeys: new Set(),
      })
    );
    const installed = bundle.capabilities.find((c) => c.capabilityId === "installedBusinessPacks");
    assert.equal(installed?.state, "available");
    assert.equal(installed?.visibleInNavigation, false);
    assert.equal(isCapabilityAllowed(bundle, "softwareCatalog"), true);
    assert.equal(isCapabilityAllowed(bundle, "installedBusinessPacks"), false);
  });
});

describe("bypass scenario 07 — revoked removed after fresh bundle", () => {
  it("07 revoked capability removed on fresh Core bundle after prior active state", () => {
    const active = resolveAppMenuCapabilityBundle(
      ctx({
        featureEnabled: new Map([["business_packs", true]]),
        activePackKeys: new Set(["aipify_hosts"]),
      })
    );
    assert.equal(isCapabilityAllowed(active, "installedBusinessPacks"), true);

    const revoked = resolveAppMenuCapabilityBundle(
      ctx({
        featureEnabled: new Map([["business_packs", false]]),
        activePackKeys: new Set(),
        revokedPackKeys: new Set(["aipify_hosts"]),
      })
    );
    assert.equal(
      revoked.capabilities.find((c) => c.capabilityId === "installedBusinessPacks")?.state,
      "revoked"
    );
    assert.equal(isCapabilityAllowed(revoked, "installedBusinessPacks"), false);
    assert.equal(
      presentAppNavFromCapabilities(revoked, t).navConfig.some(
        (i) => i.id === "installedBusinessPacks"
      ),
      false
    );
  });
});

describe("bypass scenario 08 — suspended pack not operative nav", () => {
  it("08 suspended Business Pack is not an operative menu item", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      ctx({
        featureEnabled: new Map([["business_packs", true]]),
        activePackKeys: new Set(),
        revokedPackKeys: new Set(["aipify_hosts"]),
      })
    );
    const installed = bundle.capabilities.find((c) => c.capabilityId === "installedBusinessPacks");
    assert.equal(installed?.state, "revoked");
    assert.equal(installed?.visibleInNavigation, false);
    assert.equal(installed?.usable, false);
    const presented = presentAppNavFromCapabilities(bundle, t);
    assert.equal(presented.navConfig.some((i) => i.id === "installedBusinessPacks"), false);
  });
});

describe("bypass scenario 09 — resolver error fail-closed", () => {
  it("09 resolver failure uses minimal fail-closed nav — never mega-nav or foundation", () => {
    const closed = buildFailClosedAppMenuCapabilityBundle({
      organizationId: null,
      userId: null,
      role: null,
    });
    const visible = getVisibleCapabilityIds(closed);
    assert.ok(visible.has("appDashboard"));
    for (const id of ["appTasks", "workflows", "rolesPermissions", "apiAccess", "megaOnlyEngine"]) {
      assert.equal(visible.has(id), false, id);
    }
    const presented = presentAppNavFromCapabilities(closed, t);
    assert.ok(presented.navConfig.length > 0);
    assert.ok(presented.navConfig.every((item) => visible.has(item.id)));
    assert.equal(presented.navConfig.some((i) => i.id === "organizationSettings"), false);
  });
});

describe("bypass scenario 10 — organization switch cache isolation", () => {
  it("10 organization switch cannot reuse prior org capability key or allowlist", () => {
    const keyA = buildAppMenuCapabilityCacheKey({
      organizationId: "org-a",
      userId: "user-1",
    });
    const keyB = buildAppMenuCapabilityCacheKey({
      organizationId: "org-b",
      userId: "user-1",
    });
    assert.notEqual(keyA, keyB);

    const orgA = resolveAppMenuCapabilityBundle(
      ctx({
        organizationId: "org-a",
        featureEnabled: new Map([["business_packs", true]]),
        activePackKeys: new Set(["aipify_hosts"]),
      })
    );
    const orgB = resolveAppMenuCapabilityBundle(
      ctx({
        organizationId: "org-b",
        featureEnabled: new Map([["business_packs", false]]),
        activePackKeys: new Set(),
      })
    );
    assert.equal(orgA.organizationId, "org-a");
    assert.equal(orgB.organizationId, "org-b");
    assert.equal(isCapabilityAllowed(orgA, "installedBusinessPacks"), true);
    assert.equal(isCapabilityAllowed(orgB, "installedBusinessPacks"), false);
    const presentedB = presentAppNavFromCapabilities(orgB, t);
    assert.equal(presentedB.navConfig.some((i) => i.id === "installedBusinessPacks"), false);
  });
});

describe("bypass scenario 11 — role change owner to member", () => {
  it("11 role change owner/admin → member removes owner settings from nav", () => {
    const owner = resolveAppMenuCapabilityBundle(ctx({ role: "organization_owner" }));
    assert.equal(isCapabilityAllowed(owner, "organizationSettings"), true);

    const member = resolveAppMenuCapabilityBundle(ctx({ role: "organization_member" }));
    const settings = member.capabilities.find((c) => c.capabilityId === "organizationSettings");
    assert.equal(settings?.visibleInNavigation, false);
    assert.equal(settings?.reasonCode, "unauthorized_role");
    assert.equal(isCapabilityAllowed(member, "organizationSettings"), false);
    const presented = presentAppNavFromCapabilities(member, t);
    assert.equal(presented.navConfig.some((i) => i.id === "organizationSettings"), false);
  });
});

describe("bypass scenario 12 — duplicate capability id deterministic", () => {
  it("12 duplicate capability ids resolve deterministically without bypass", () => {
    const bundle = resolveAppMenuCapabilityBundle(ctx());
    const ids = bundle.capabilities.map((c) => c.capabilityId);
    assert.equal(ids.length, new Set(ids).size);

    const duplicated: AppMenuCapabilityBundle = {
      ...bundle,
      capabilities: [
        ...bundle.capabilities,
        {
          capabilityId: "appDashboard",
          state: "disabled",
          visibleInNavigation: false,
          usable: false,
          reasonCode: "duplicate_poison",
        },
        {
          capabilityId: "appDashboard",
          state: "active",
          visibleInNavigation: true,
          usable: true,
          reasonCode: "duplicate_poison_allow",
        },
      ],
    };
    // Presentation uses Set of allowed ids — first matching visible id still only renders once.
    const presented = presentAppNavFromCapabilities(duplicated, t);
    const dashboardHits = presented.navConfig.filter((i) => i.id === "appDashboard");
    assert.equal(dashboardHits.length, 1);
    assert.equal(getVisibleCapabilityIds(duplicated).has("appDashboard"), true);
  });
});
