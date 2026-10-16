/**
 * Exact 12 bypass scenarios — updated for foundation APP nav (job 58).
 * Intent preserved: dynamic cannot inject, unknown hidden, entitlement gates,
 * fail-closed, org isolation, role gates, deterministic duplicate ids.
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
    featureEnabled: new Map<string, boolean>([
      ["billing", true],
      ["integrations", true],
    ]),
    permissionGranted: new Map<string, boolean>(),
    activePackKeys: new Set<string>(),
    pendingPackKeys: new Set<string>(),
    revokedPackKeys: new Set<string>(),
    // Job 62: Web requires explicit tenant_modules enable (fail closed).
    activeModuleKeys: new Set<string>(["website_kompis", "kompis_bedrift"]),
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
  it("01 dynamic payload with legacy mega item is discarded by merge and intersect", () => {
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
  it("03 dynamic Kompis Web item without module entitlement stays hidden", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      ctx({
        activeModuleKeys: new Set(["__website_kompis_denied__"]),
      })
    );
    assert.equal(isCapabilityAllowed(bundle, "kompisWebDashboard"), false);

    const dynamic = dynamicCandidates([
      { id: "kompisWebDashboard", href: "/app/website-kompis" },
    ]);
    const intersected = intersectNavWithCapabilities(dynamic, bundle);
    assert.deepEqual(intersected, []);

    const core = presentAppNavFromCapabilities(bundle, t);
    const merged = mergeDynamicWithFallbackNav(
      {
        navGroups: dynamic,
        navConfig: [
          {
            id: "kompisWebDashboard",
            href: "/app/website-kompis",
            label: "Web",
          },
        ],
      },
      core.navGroups,
      core.navConfig
    );
    assert.equal(merged.navConfig.some((i) => i.id === "kompisWebDashboard"), false);
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
  it("05 billing feature off keeps subscription out of navigation", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      ctx({
        featureEnabled: new Map([["billing", false], ["integrations", true]]),
      })
    );
    const subscription = bundle.capabilities.find((c) => c.capabilityId === "accountSubscription");
    assert.equal(subscription?.visibleInNavigation, false);
    assert.equal(isCapabilityAllowed(bundle, "accountSubscription"), false);
    assert.equal(
      presentAppNavFromCapabilities(bundle, t).navConfig.some((i) => i.id === "accountSubscription"),
      false
    );
  });
});

describe("bypass scenario 06 — available not in nav", () => {
  it("06 denied website_kompis module is not navigation", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      ctx({
        activeModuleKeys: new Set(["__website_kompis_denied__"]),
      })
    );
    assert.equal(isCapabilityAllowed(bundle, "kompisWebDashboard"), false);
    assert.equal(isCapabilityAllowed(bundle, "kompisBedriftDashboard"), false);
    assert.equal(
      presentAppNavFromCapabilities(bundle, t).navConfig.some((i) => i.id === "kompisWebDashboard"),
      false
    );
  });
});

describe("bypass scenario 07 — revoked removed after fresh bundle", () => {
  it("07 denied module removed on fresh Core bundle after prior active state", () => {
    const active = resolveAppMenuCapabilityBundle(ctx());
    assert.equal(isCapabilityAllowed(active, "kompisWebDashboard"), true);
    assert.equal(isCapabilityAllowed(active, "accountSubscription"), true);

    const denied = resolveAppMenuCapabilityBundle(
      ctx({
        activeModuleKeys: new Set(["__website_kompis_denied__"]),
      })
    );
    assert.equal(isCapabilityAllowed(denied, "kompisWebDashboard"), false);
    assert.equal(
      presentAppNavFromCapabilities(denied, t).navConfig.some((i) => i.id === "kompisWebDashboard"),
      false
    );
  });
});

describe("bypass scenario 08 — suspended entitlement not operative nav", () => {
  it("08 integrations feature off is not an operative menu item", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      ctx({
        featureEnabled: new Map([["billing", true], ["integrations", false]]),
      })
    );
    const integrations = bundle.capabilities.find((c) => c.capabilityId === "accountIntegrations");
    assert.equal(integrations?.visibleInNavigation, false);
    assert.equal(isCapabilityAllowed(bundle, "accountIntegrations"), false);
    const presented = presentAppNavFromCapabilities(bundle, t);
    assert.equal(presented.navConfig.some((i) => i.id === "accountIntegrations"), false);
  });
});

describe("bypass scenario 09 — resolver error fail-closed", () => {
  it("09 resolver failure uses minimal fail-closed nav — never mega-nav", () => {
    const closed = buildFailClosedAppMenuCapabilityBundle({
      organizationId: null,
      userId: null,
      role: null,
    });
    const visible = getVisibleCapabilityIds(closed);
    assert.ok(visible.has("accountSubscription"));
    assert.equal(visible.has("kompisBedriftDashboard"), false);
    for (const id of ["appTasks", "workflows", "rolesPermissions", "apiAccess", "megaOnlyEngine"]) {
      assert.equal(visible.has(id), false, id);
    }
    const presented = presentAppNavFromCapabilities(closed, t);
    assert.ok(presented.navConfig.length > 0);
    assert.ok(presented.navConfig.every((item) => visible.has(item.id)));
    assert.equal(presented.navConfig.some((i) => i.id === "kompisBedriftSettings"), false);
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
      })
    );
    const orgB = resolveAppMenuCapabilityBundle(
      ctx({
        organizationId: "org-b",
        activeModuleKeys: new Set(["__website_kompis_denied__"]),
      })
    );
    assert.equal(orgA.organizationId, "org-a");
    assert.equal(orgB.organizationId, "org-b");
    assert.equal(isCapabilityAllowed(orgA, "kompisWebDashboard"), true);
    assert.equal(isCapabilityAllowed(orgB, "kompisWebDashboard"), false);
    assert.notEqual(orgA.organizationId, orgB.organizationId);
    const presentedB = presentAppNavFromCapabilities(orgB, t);
    assert.equal(presentedB.navConfig.some((i) => i.id === "kompisWebDashboard"), false);
  });
});

describe("bypass scenario 11 — role change owner to member", () => {
  it("11 role change owner/admin → member removes owner settings from nav", () => {
    const owner = resolveAppMenuCapabilityBundle(ctx({ role: "organization_owner" }));
    assert.equal(isCapabilityAllowed(owner, "kompisBedriftSettings"), true);

    const member = resolveAppMenuCapabilityBundle(ctx({ role: "organization_member" }));
    const settings = member.capabilities.find((c) => c.capabilityId === "kompisBedriftSettings");
    assert.equal(settings?.visibleInNavigation, false);
    assert.equal(settings?.reasonCode, "unauthorized_role");
    assert.equal(isCapabilityAllowed(member, "kompisBedriftSettings"), false);
    const presented = presentAppNavFromCapabilities(member, t);
    assert.equal(presented.navConfig.some((i) => i.id === "kompisBedriftSettings"), false);
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
          capabilityId: "kompisBedriftDashboard",
          state: "disabled",
          visibleInNavigation: false,
          usable: false,
          reasonCode: "duplicate_poison",
        },
        {
          capabilityId: "kompisBedriftDashboard",
          state: "active",
          visibleInNavigation: true,
          usable: true,
          reasonCode: "duplicate_poison_allow",
        },
      ],
    };
    const presented = presentAppNavFromCapabilities(duplicated, t, {
      activeProduct: "kompisBedrift",
    });
    const dashboardHits = presented.navConfig.filter((i) => i.id === "kompisBedriftDashboard");
    assert.equal(dashboardHits.length, 1);
    assert.equal(getVisibleCapabilityIds(duplicated).has("kompisBedriftDashboard"), true);
  });
});
