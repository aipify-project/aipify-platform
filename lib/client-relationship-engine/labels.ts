import type { Translator } from "@/lib/i18n/translate";

export function buildClientRelationshipLabels(t: Translator) {
  const p = "customerApp.clientRelationships";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    healthScore: t(`${p}.healthScore`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    companionAdvisor: t(`${p}.companionAdvisor`),
    noRecords: t(`${p}.noRecords`),
    humanReviewRequired: t(`${p}.humanReviewRequired`),
    phaseReuseNote: t(`${p}.phaseReuseNote`),
    sections: {
      overview: t(`${p}.sections.overview`),
      clients: t(`${p}.sections.clients`),
      journeys: t(`${p}.sections.journeys`),
      rebooking: t(`${p}.sections.rebooking`),
      retention: t(`${p}.sections.retention`),
      loyalty: t(`${p}.sections.loyalty`),
      memberships: t(`${p}.sections.memberships`),
      packages: t(`${p}.sections.packages`),
      referrals: t(`${p}.sections.referrals`),
      campaigns: t(`${p}.sections.campaigns`),
      feedback: t(`${p}.sections.feedback`),
      serviceRecovery: t(`${p}.sections.serviceRecovery`),
      consent: t(`${p}.sections.consent`),
      automation: t(`${p}.sections.automation`),
      reports: t(`${p}.sections.reports`),
    },
    healthBand: {
      healthy: t(`${p}.healthBand.healthy`),
      attention_required: t(`${p}.healthBand.attentionRequired`),
      at_risk: t(`${p}.healthBand.atRisk`),
    },
    stats: {
      activeClients: t(`${p}.stats.activeClients`),
      lapsedClients: t(`${p}.stats.lapsedClients`),
      pendingRebooking: t(`${p}.stats.pendingRebooking`),
      openRetention: t(`${p}.stats.openRetention`),
      loyaltyAccounts: t(`${p}.stats.loyaltyAccounts`),
      openRecovery: t(`${p}.stats.openRecovery`),
      pendingReview: t(`${p}.stats.pendingReview`),
    },
  };
}
