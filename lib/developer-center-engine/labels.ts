import type { Translator } from "@/lib/i18n/translate";

export function buildDeveloperCenterLabels(t: Translator) {
  const p = "platform.developerCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.emptyState`),
    refresh: t(`${p}.refresh`),
    back: t(`${p}.back`),
    records: t(`${p}.records`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    noRecords: t(`${p}.noRecords`),
    executiveDashboard: t(`${p}.executiveDashboard`),
    auditRecent: t(`${p}.auditRecent`),
    reports: t(`${p}.reports`),
    sections: {
      overview: t(`${p}.sections.overview`),
      projects: t(`${p}.sections.projects`),
      sdk: t(`${p}.sections.sdk`),
      api: t(`${p}.sections.api`),
      testing: t(`${p}.sections.testing`),
      publishing: t(`${p}.sections.publishing`),
      marketplace: t(`${p}.sections.marketplace`),
      reports: t(`${p}.sections.reports`),
    },
    stats: {
      developers: t(`${p}.stats.developers`),
      projects: t(`${p}.stats.projects`),
      manifests: t(`${p}.stats.manifests`),
      sandboxes: t(`${p}.stats.sandboxes`),
      validations: t(`${p}.stats.validations`),
      apiKeys: t(`${p}.stats.apiKeys`),
      documentation: t(`${p}.stats.documentation`),
    },
    executive: {
      registeredDevelopers: t(`${p}.executive.registeredDevelopers`),
      activeProjects: t(`${p}.executive.activeProjects`),
      publishedPacks: t(`${p}.executive.publishedPacks`),
      certificationsGranted: t(`${p}.executive.certificationsGranted`),
      pendingValidations: t(`${p}.executive.pendingValidations`),
      marketplaceReady: t(`${p}.executive.marketplaceReady`),
      platformUsage: t(`${p}.executive.platformUsage`),
    },
  };
}
