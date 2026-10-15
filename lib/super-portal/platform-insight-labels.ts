import type { Translator } from "@/lib/i18n/translate";

export type PlatformSuperAdminInsightLabels = {
  title: string;
  subtitle: string;
  loading: string;
  loadError: string;
  retry: string;
  privacyNote: string;
  periodNote: string;
  totalOrganizations: string;
  totalRegisteredUsers: string;
  totalActiveSubscriptions: string;
  activePlatformSupportAdmins: string;
  openCriticalIncidents: string;
  globalPlatformStatus: string;
  organizationGrowth30d: string;
  subscriptionGrowth30d: string;
  executiveAlertCount: string;
  openSuperDashboard: string;
  statuses: {
    operational: string;
    attention_required: string;
    unknown: string;
  };
};

export function buildPlatformSuperAdminInsightLabels(
  t: Translator,
): PlatformSuperAdminInsightLabels {
  const k = "platform.portalStructure.dashboard.superAdminInsight";
  return {
    title: t(`${k}.title`),
    subtitle: t(`${k}.subtitle`),
    loading: t(`${k}.loading`),
    loadError: t(`${k}.loadError`),
    retry: t(`${k}.retry`),
    privacyNote: t(`${k}.privacyNote`),
    periodNote: t(`${k}.periodNote`),
    totalOrganizations: t(`${k}.totalOrganizations`),
    totalRegisteredUsers: t(`${k}.totalRegisteredUsers`),
    totalActiveSubscriptions: t(`${k}.totalActiveSubscriptions`),
    activePlatformSupportAdmins: t(`${k}.activePlatformSupportAdmins`),
    openCriticalIncidents: t(`${k}.openCriticalIncidents`),
    globalPlatformStatus: t(`${k}.globalPlatformStatus`),
    organizationGrowth30d: t(`${k}.organizationGrowth30d`),
    subscriptionGrowth30d: t(`${k}.subscriptionGrowth30d`),
    executiveAlertCount: t(`${k}.executiveAlertCount`),
    openSuperDashboard: t(`${k}.openSuperDashboard`),
    statuses: {
      operational: t(`${k}.statuses.operational`),
      attention_required: t(`${k}.statuses.attention_required`),
      unknown: t(`${k}.statuses.unknown`),
    },
  };
}
