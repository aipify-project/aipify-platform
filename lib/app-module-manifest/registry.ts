import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import type { ModuleManifest } from "./types";

/**
 * Typed software-module registry for APP shell + shared dashboard.
 * Routes and menu children are code-owned; entitlements always come from Core.
 */
export const APP_SOFTWARE_MODULE_MANIFESTS: readonly ModuleManifest[] = [
  {
    moduleKey: "website_kompis",
    productBindings: ["kompis_web", "website_kompis", "kompis-web"],
    productContextId: "kompisWeb",
    labelKey: "customerApp.portalStructure.navGroups.kompisWeb",
    iconToken: "kompisWeb",
    canonicalRoute: FOUNDATION_NAV_BINDINGS.kompisWebDashboard,
    sortOrder: 10,
    readiness: "activated",
    accessPolicy: "tenant_module",
    menuChildren: [
      { navId: "kompisWebDashboard", primaryNav: true },
      { navId: "kompisWebQa", primaryNav: true },
      { navId: "kompisWebFaq", primaryNav: true },
      { navId: "kompisWebConnection", primaryNav: true },
      { navId: "kompisWebSettings", primaryNav: true },
      { navId: "kompisWebAppearance", primaryNav: false },
      { navId: "kompisWebModules", primaryNav: false },
    ],
    dashboardCapabilities: ["status_card", "kpi_summary", "attention", "deep_link"],
  },
  {
    moduleKey: "kompis_bedrift",
    productBindings: ["kompis_bedrift", "kompis-bedrift"],
    productContextId: "kompisBedrift",
    labelKey: "customerApp.portalStructure.navGroups.kompisBedrift",
    iconToken: "kompisBedrift",
    canonicalRoute: FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard,
    sortOrder: 20,
    readiness: "activated",
    accessPolicy: "tenant_module",
    menuChildren: [
      { navId: "kompisBedriftDashboard", primaryNav: true },
      { navId: "kompisBedriftEmployees", primaryNav: true },
      { navId: "kompisBedriftDocuments", primaryNav: true },
      { navId: "kompisBedriftFaq", primaryNav: true },
      { navId: "kompisBedriftComms", primaryNav: true },
      { navId: "kompisBedriftMeetings", primaryNav: true },
      { navId: "kompisBedriftModules", primaryNav: true },
      { navId: "kompisBedriftConnection", primaryNav: true },
      { navId: "kompisBedriftSettings", primaryNav: true },
    ],
    dashboardCapabilities: ["status_card", "kpi_summary", "deep_link"],
  },
  {
    moduleKey: "sales_partner",
    productBindings: ["sales_partner", "certified_sales_partner", "growth_partner"],
    productContextId: null,
    labelKey: "customerApp.portalStructure.navGroups.salesPartner",
    iconToken: "salesPartner",
    /** Phase B APP thin hosts — CSP APIs unchanged; /partners not retired. */
    canonicalRoute: "/app/sales-partner",
    sortOrder: 30,
    readiness: "activated",
    accessPolicy: "partner_identity",
    menuChildren: [
      { navId: "salesPartnerOverview", primaryNav: true },
      { navId: "salesPartnerProducts", primaryNav: true },
      { navId: "salesPartnerCustomers", primaryNav: true },
      { navId: "salesPartnerCommissions", primaryNav: true },
      { navId: "salesPartnerAcademy", primaryNav: true },
    ],
    dashboardCapabilities: ["status_card", "kpi_summary", "deep_link"],
  },
] as const;

export function getSoftwareModuleManifest(
  moduleKey: string
): ModuleManifest | null {
  return APP_SOFTWARE_MODULE_MANIFESTS.find((m) => m.moduleKey === moduleKey) ?? null;
}

export function listReadySoftwareModules(): ModuleManifest[] {
  return APP_SOFTWARE_MODULE_MANIFESTS.filter(
    (m) => m.readiness === "activated" || m.readiness === "implemented" || m.readiness === "test_ready"
  ).filter((m) => m.readiness !== "hidden" && m.readiness !== "inactive");
}
