import type { AppPortalExecutiveInsightsLabels } from "./types";
import type { Translator } from "@/lib/i18n/translate";

export function buildAppPortalExecutiveInsightsLabels(t: Translator): AppPortalExecutiveInsightsLabels {
  const p = "customerApp.portalStructure.executiveInsights";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    principle: t(`${p}.principle`),
    accessDeniedTitle: t(`${p}.accessDeniedTitle`),
    accessDeniedBody: t(`${p}.accessDeniedBody`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyBody: t(`${p}.emptyBody`),
    exploreBusinessPacks: t(`${p}.exploreBusinessPacks`),
    sections: {
      health: t(`${p}.sections.health`),
      priorities: t(`${p}.sections.priorities`),
      sinceLastLogin: t(`${p}.sections.sinceLastLogin`),
      opportunities: t(`${p}.sections.opportunities`),
      risks: t(`${p}.sections.risks`),
      recommendations: t(`${p}.sections.recommendations`),
    },
    health: {
      score: t(`${p}.health.score`),
      trend: t(`${p}.health.trend`),
      status: t(`${p}.health.status`),
      factors: t(`${p}.health.factors`),
      trends: {
        improving: t(`${p}.health.trends.improving`),
        stable: t(`${p}.health.trends.stable`),
        declining: t(`${p}.health.trends.declining`),
      },
      statuses: {
        healthy: t(`${p}.health.statuses.healthy`),
        warning: t(`${p}.health.statuses.warning`),
        critical: t(`${p}.health.statuses.critical`),
      },
    },
    sinceLastLogin: {
      newTeamMembers: t(`${p}.sinceLastLogin.newTeamMembers`),
      integrationsConnected: t(`${p}.sinceLastLogin.integrationsConnected`),
      businessPacksInstalled: t(`${p}.sinceLastLogin.businessPacksInstalled`),
      tasksCompleted: t(`${p}.sinceLastLogin.tasksCompleted`),
      majorEvents: t(`${p}.sinceLastLogin.majorEvents`),
      billingEvents: t(`${p}.sinceLastLogin.billingEvents`),
    },
    recommendation: {
      why: t(`${p}.recommendation.why`),
      expectedImpact: t(`${p}.recommendation.expectedImpact`),
      suggestedAction: t(`${p}.recommendation.suggestedAction`),
    },
    severity: {
      low: t(`${p}.severity.low`),
      medium: t(`${p}.severity.medium`),
      high: t(`${p}.severity.high`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      autoDecisions: t(`${p}.faq.autoDecisions`),
      autoDecisionsAnswer: t(`${p}.faq.autoDecisionsAnswer`),
      updateFrequency: t(`${p}.faq.updateFrequency`),
      updateFrequencyAnswer: t(`${p}.faq.updateFrequencyAnswer`),
    },
  };
}
