import type { SuperAdminSection } from "./types";

export const SUPER_ADMIN_HOME_ROUTE = "/super";

/** Phase 257 — SUPER portal structure: executive oversight only. Operational work lives in PLATFORM. */
export const SUPER_ADMIN_SECTIONS: SuperAdminSection[] = [
  {
    id: "executiveOversight",
    titleKey: "superAdmin.sections.executiveOversight.title",
    purposeKey: "superAdmin.sections.executiveOversight.purpose",
    modules: [
      {
        id: "executiveDashboard",
        labelKey: "superAdmin.modules.executiveDashboard",
        descriptionKey: "superAdmin.modules.executiveDashboardDescription",
        href: "/super",
      },
      {
        id: "executiveInsights",
        labelKey: "superAdmin.modules.executiveInsights",
        descriptionKey: "superAdmin.modules.executiveInsightsDescription",
        href: "/super/executive-insights",
      },
      {
        id: "groupOverview",
        labelKey: "superAdmin.modules.groupOverview",
        descriptionKey: "superAdmin.modules.groupOverviewDescription",
        href: "/super/group-overview",
      },
    ],
  },
  {
    id: "platformGovernance",
    titleKey: "superAdmin.sections.platformGovernance.title",
    purposeKey: "superAdmin.sections.platformGovernance.purpose",
    modules: [
      {
        id: "platformAdministrators",
        labelKey: "superAdmin.modules.platformAdministrators",
        descriptionKey: "superAdmin.modules.platformAdministratorsDescription",
        href: "/super/platform-administrators",
      },
      {
        id: "languageAdministration",
        labelKey: "superAdmin.modules.languageAdministration",
        descriptionKey: "superAdmin.modules.languageAdministrationDescription",
        href: "/super/language-administration",
      },
      {
        id: "globalAuditCenter",
        labelKey: "superAdmin.modules.globalAuditCenter",
        descriptionKey: "superAdmin.modules.globalAuditCenterDescription",
        href: "/super/global-audit",
      },
      {
        id: "moduleRegistry",
        labelKey: "superAdmin.modules.moduleRegistry",
        descriptionKey: "superAdmin.modules.moduleRegistryDescription",
        href: "/super/module-registry",
      },
      {
        id: "rolePermissionMatrix",
        labelKey: "superAdmin.modules.rolePermissionMatrix",
        descriptionKey: "superAdmin.modules.rolePermissionMatrixDescription",
        href: "/super/role-permission-matrix",
      },
      {
        id: "partnerCommunications",
        labelKey: "superAdmin.modules.partnerCommunications",
        descriptionKey: "superAdmin.modules.partnerCommunicationsDescription",
        href: "/super/partner-communications",
      },
    ],
  },
];
