import type { Translator } from "@/lib/i18n/translate";

export function buildEcosystemCenterLabels(t: Translator) {
  const p = "platform.ecosystemCenter";
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
      providers: t(`${p}.sections.providers`),
      businessPacks: t(`${p}.sections.businessPacks`),
      certifications: t(`${p}.sections.certifications`),
      marketplace: t(`${p}.sections.marketplace`),
      reviews: t(`${p}.sections.reviews`),
      revenue: t(`${p}.sections.revenue`),
      governance: t(`${p}.sections.governance`),
      reports: t(`${p}.sections.reports`),
    },
    scoreBand: {
      excellent: t(`${p}.scoreBand.excellent`),
      trusted: t(`${p}.scoreBand.trusted`),
      review_needed: t(`${p}.scoreBand.reviewNeeded`),
      provider_risk: t(`${p}.scoreBand.providerRisk`),
    },
  };
}
