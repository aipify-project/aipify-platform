import type { Translator } from "@/lib/i18n/translate";
import { PLATFORM_ADMIN_ROLES, PLATFORM_ADMIN_STATUSES, SUPER_PORTAL_LOCALES } from "./constants";
import type { SuperPortalLabels } from "./types";

export function buildSuperPortalLabels(t: Translator): SuperPortalLabels {
  const d = "superAdmin.superPortal.dashboard";
  const pa = "superAdmin.superPortal.platformAdministrators";
  const la = "superAdmin.superPortal.languageAdministration";
  const ga = "superAdmin.superPortal.globalAudit";
  const ei = "superAdmin.superPortal.executiveInsights";

  return {
    dashboard: {
      title: t(`${d}.title`),
      subtitle: t(`${d}.subtitle`),
      loading: t(`${d}.loading`),
      principle: t(`${d}.principle`),
      privacyNote: t(`${d}.privacyNote`),
      totalOrganizations: t(`${d}.totalOrganizations`),
      totalActiveUsers: t(`${d}.totalActiveUsers`),
      totalActiveSubscriptions: t(`${d}.totalActiveSubscriptions`),
      platformAdministrators: t(`${d}.platformAdministrators`),
      globalPlatformStatus: t(`${d}.globalPlatformStatus`),
      openCriticalIncidents: t(`${d}.openCriticalIncidents`),
      platformUptime: t(`${d}.platformUptime`),
      platformHealthIndicators: t(`${d}.platformHealthIndicators`),
      operationalServices: t(`${d}.operationalServices`),
      degradedServices: t(`${d}.degradedServices`),
      maintenanceServices: t(`${d}.maintenanceServices`),
      incidentServices: t(`${d}.incidentServices`),
      growthTrends: t(`${d}.growthTrends`),
      executiveAlerts: t(`${d}.executiveAlerts`),
      noAlerts: t(`${d}.noAlerts`),
      portalModules: t(`${d}.portalModules`),
      openModule: t(`${d}.openModule`),
      statuses: {
        operational: t(`${d}.statuses.operational`),
        attention_required: t(`${d}.statuses.attentionRequired`),
      },
    },
    platformAdministrators: {
      title: t(`${pa}.title`),
      subtitle: t(`${pa}.subtitle`),
      loading: t(`${pa}.loading`),
      back: t(`${pa}.back`),
      email: t(`${pa}.email`),
      displayName: t(`${pa}.displayName`),
      role: t(`${pa}.role`),
      status: t(`${pa}.status`),
      lastLogin: t(`${pa}.lastLogin`),
      activitySummary: t(`${pa}.activitySummary`),
      auditEvents30d: t(`${pa}.auditEvents30d`),
      create: t(`${pa}.create`),
      suspend: t(`${pa}.suspend`),
      reactivate: t(`${pa}.reactivate`),
      saving: t(`${pa}.saving`),
      roles: Object.fromEntries(
        PLATFORM_ADMIN_ROLES.map((key) => [key, t(`${pa}.roles.${key}`)])
      ) as SuperPortalLabels["platformAdministrators"]["roles"],
      statuses: Object.fromEntries(
        PLATFORM_ADMIN_STATUSES.map((key) => [key, t(`${pa}.statuses.${key}`)])
      ) as SuperPortalLabels["platformAdministrators"]["statuses"],
    },
    languageAdministration: {
      title: t(`${la}.title`),
      subtitle: t(`${la}.subtitle`),
      loading: t(`${la}.loading`),
      back: t(`${la}.back`),
      locale: t(`${la}.locale`),
      enabled: t(`${la}.enabled`),
      completeness: t(`${la}.completeness`),
      missingKeys: t(`${la}.missingKeys`),
      enable: t(`${la}.enable`),
      disable: t(`${la}.disable`),
      saving: t(`${la}.saving`),
      yes: t(`${la}.yes`),
      no: t(`${la}.no`),
      locales: Object.fromEntries(
        SUPER_PORTAL_LOCALES.map((key) => [key, t(`${la}.locales.${key}`)])
      ) as SuperPortalLabels["languageAdministration"]["locales"],
    },
    globalAudit: {
      title: t(`${ga}.title`),
      subtitle: t(`${ga}.subtitle`),
      loading: t(`${ga}.loading`),
      back: t(`${ga}.back`),
      user: t(`${ga}.user`),
      action: t(`${ga}.action`),
      timestamp: t(`${ga}.timestamp`),
      previousValue: t(`${ga}.previousValue`),
      newValue: t(`${ga}.newValue`),
      empty: t(`${ga}.empty`),
    },
    executiveInsights: {
      title: t(`${ei}.title`),
      subtitle: t(`${ei}.subtitle`),
      loading: t(`${ei}.loading`),
      back: t(`${ei}.back`),
      organizationGrowth: t(`${ei}.organizationGrowth`),
      subscriptionGrowth: t(`${ei}.subscriptionGrowth`),
      revenueIndicators: t(`${ei}.revenueIndicators`),
      platformAdoption: t(`${ei}.platformAdoption`),
      globalActivity: t(`${ei}.globalActivity`),
      newOrganizations30d: t(`${ei}.newOrganizations30d`),
      newSubscriptions30d: t(`${ei}.newSubscriptions30d`),
      activeSubscriptions: t(`${ei}.activeSubscriptions`),
      mrr: t(`${ei}.mrr`),
      activeInstallations: t(`${ei}.activeInstallations`),
      actionsToday: t(`${ei}.actionsToday`),
      adminLogins7d: t(`${ei}.adminLogins7d`),
      trends: {
        up: t(`${ei}.trends.up`),
        stable: t(`${ei}.trends.stable`),
        down: t(`${ei}.trends.down`),
      },
    },
  };
}
