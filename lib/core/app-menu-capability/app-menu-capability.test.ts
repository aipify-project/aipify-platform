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
      navGroups: Object.fromEntries(APP_PORTAL_NAV_GROUPS.map((g) => [g.id, g.id])),
      nav: Object.fromEntries(
        APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items.map((item) => [item.id, item.id]))
      ),
    },
  },
});

function emptyCtx(overrides: Partial<Parameters<typeof resolveAppMenuCapabilityBundle>[0]> = {}) {
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
    activeModuleKeys: new Set<string>(["website_kompis"]),
    ...overrides,
  };
}

describe("core app menu capability contract", () => {
  it("presents one flat product menu at a time (job 60)", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      emptyCtx({ activeModuleKeys: new Set(["website_kompis"]) })
    );
    const presented = presentAppNavFromCapabilities(bundle, t, { activeProduct: "kompisWeb" });
    assert.deepEqual(presented.navGroups.map((g) => g.id), ["kompisWeb"]);
    assert.ok(!presented.navConfig.some((i) => i.id.startsWith("kompisBedrift")));
    const bedrift = presentAppNavFromCapabilities(
      resolveAppMenuCapabilityBundle(
        emptyCtx({ activeModuleKeys: new Set(["website_kompis", "kompis_bedrift"]) })
      ),
      t,
      { activeProduct: "kompisBedrift" }
    );
    assert.deepEqual(bedrift.navGroups.map((g) => g.id), ["kompisBedrift"]);
    assert.ok(!bedrift.navConfig.some((i) => i.id.startsWith("kompisWeb")));
  });

  it("hides Kompis Web when website_kompis module is denied", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      emptyCtx({
        activeModuleKeys: new Set(["__website_kompis_denied__"]),
      })
    );
    assert.equal(isCapabilityAllowed(bundle, "kompisWebDashboard"), false);
    assert.equal(isCapabilityAllowed(bundle, "kompisBedriftDashboard"), false);
    assert.equal(isCapabilityAllowed(bundle, "accountSubscription"), true);
  });

  it("hides Kompis Web when website_kompis module status is unknown (fail closed)", () => {
    const bundle = resolveAppMenuCapabilityBundle(emptyCtx({ activeModuleKeys: new Set() }));
    assert.equal(isCapabilityAllowed(bundle, "kompisWebDashboard"), false);
    assert.equal(isCapabilityAllowed(bundle, "kompisBedriftDashboard"), false);
  });

  it("hides billing account items when billing feature is off", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      emptyCtx({
        featureEnabled: new Map([["billing", false], ["integrations", true]]),
      })
    );
    assert.equal(isCapabilityAllowed(bundle, "accountSubscription"), false);
    assert.equal(isCapabilityAllowed(bundle, "accountInvoices"), false);
    assert.equal(isCapabilityAllowed(bundle, "accountIntegrations"), true);
  });

  it("fails closed to a safe subset", () => {
    const bundle = buildFailClosedAppMenuCapabilityBundle({
      organizationId: "org-1",
      userId: "user-1",
      role: "organization_member",
    });
    const visible = getVisibleCapabilityIds(bundle);
    assert.ok(visible.has("accountNotifications"));
    assert.equal(visible.has("kompisBedriftDashboard"), false);
    assert.equal(visible.has("kompisBedriftSettings"), false);
    const presented = presentAppNavFromCapabilities(bundle, t);
    assert.ok(presented.navConfig.every((item) => visible.has(item.id)));
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
    const portalIds = new Set(APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id)));
    for (const item of presented.navConfig) {
      assert.ok(portalIds.has(item.id as never), item.id);
    }
  });

  it("dynamic merge cannot replace Core presentation fallback", () => {
    const fallbackGroups = [
      {
        id: "account",
        label: "Account",
        items: [{ id: "accountNotifications", href: "/app/account/notification-settings", label: "Notifications" }],
      },
    ];
    const fallbackConfig = [
      { id: "accountNotifications", href: "/app/account/notification-settings", label: "Notifications" },
    ];
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
    assert.deepEqual(merged.navConfig.map((i) => i.id), ["accountNotifications"]);
  });

  it("cache key includes org user and version", () => {
    const key = buildAppMenuCapabilityCacheKey({
      organizationId: "org-a",
      userId: "user-b",
    });
    assert.match(key, new RegExp(APP_MENU_CAPABILITY_CONTRACT_VERSION));
    assert.match(key, /org-a/);
    assert.match(key, /user-b/);
  });

  it("unauthorized role cannot see owner settings", () => {
    const bundle = resolveAppMenuCapabilityBundle(
      emptyCtx({ role: "organization_member" })
    );
    const settings = bundle.capabilities.find((c) => c.capabilityId === "kompisBedriftSettings");
    assert.equal(settings?.visibleInNavigation, false);
    assert.equal(settings?.reasonCode, "unauthorized_role");
    const closed = buildFailClosedAppMenuCapabilityBundle({
      organizationId: "org-1",
      userId: "user-1",
      role: "organization_member",
    });
    assert.equal(isCapabilityAllowed(closed, "kompisBedriftSettings"), false);
    assert.equal(isCapabilityAllowed(closed, "kompisBedriftDashboard"), false);
    assert.equal(isCapabilityAllowed(closed, "accountNotifications"), true);
  });

  it("unknown capability id is never treated as allowed", () => {
    const bundle = resolveAppMenuCapabilityBundle(emptyCtx());
    assert.equal(isCapabilityAllowed(bundle, "totallyUnknownCapability"), false);
  });
});
