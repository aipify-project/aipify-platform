import type { SuccessCenterLabels } from "./types";
import type { Translator } from "@/lib/i18n/translate";

export function buildSuccessCenterLabels(t: Translator): SuccessCenterLabels {
  const p = "customerApp.portalStructure.successCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyBody: t(`${p}.emptyBody`),
    principle: t(`${p}.principle`),
    sections: {
      overview: t(`${p}.sections.overview`),
      recommendations: t(`${p}.sections.recommendations`),
      timeline: t(`${p}.sections.timeline`),
      growth: t(`${p}.sections.growth`),
      adoption: t(`${p}.sections.adoption`),
      factors: t(`${p}.sections.factors`),
    },
    overview: {
      healthScore: t(`${p}.overview.healthScore`),
      adoptionScore: t(`${p}.overview.adoptionScore`),
      engagementScore: t(`${p}.overview.engagementScore`),
      utilizationScore: t(`${p}.overview.utilizationScore`),
      healthStatus: t(`${p}.overview.healthStatus`),
      riskLevel: t(`${p}.overview.riskLevel`),
      advisory: t(`${p}.overview.advisory`),
    },
    healthStatuses: {
      excellent: t(`${p}.healthStatuses.excellent`),
      healthy: t(`${p}.healthStatuses.healthy`),
      attention_needed: t(`${p}.healthStatuses.attentionNeeded`),
      at_risk: t(`${p}.healthStatuses.atRisk`),
    },
    riskLevels: {
      low: t(`${p}.riskLevels.low`),
      moderate: t(`${p}.riskLevels.moderate`),
      elevated: t(`${p}.riskLevels.elevated`),
      high: t(`${p}.riskLevels.high`),
    },
    recommendations: {
      inviteTeam: t(`${p}.recommendations.inviteTeam`),
      explorePacks: t(`${p}.recommendations.explorePacks`),
      enableIntegrations: t(`${p}.recommendations.enableIntegrations`),
      reviewSupport: t(`${p}.recommendations.reviewSupport`),
      reviewApprovals: t(`${p}.recommendations.reviewApprovals`),
      completeFollowUps: t(`${p}.recommendations.completeFollowUps`),
      completeOnboarding: t(`${p}.recommendations.completeOnboarding`),
      configureSecurity: t(`${p}.recommendations.configureSecurity`),
    },
    growth: {
      team_expansion: t(`${p}.growth.teamExpansion`),
      business_packs: t(`${p}.growth.businessPacks`),
      integrations: t(`${p}.growth.integrations`),
      plan_upgrade: t(`${p}.growth.planUpgrade`),
    },
    adoption: {
      activeUsers: t(`${p}.adoption.activeUsers`),
      packsUsed: t(`${p}.adoption.packsUsed`),
      integrationsUsed: t(`${p}.adoption.integrationsUsed`),
      unusedCapabilities: t(`${p}.adoption.unusedCapabilities`),
    },
    factors: {
      active_users: t(`${p}.factors.activeUsers`),
      team_size: t(`${p}.factors.teamSize`),
      business_packs: t(`${p}.factors.businessPacks`),
      integrations: t(`${p}.factors.integrations`),
      open_support: t(`${p}.factors.openSupport`),
      pending_approvals: t(`${p}.factors.pendingApprovals`),
      open_follow_ups: t(`${p}.factors.openFollowUps`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      healthScore: t(`${p}.faq.healthScore`),
      healthScoreAnswer: t(`${p}.faq.healthScoreAnswer`),
      predictRisk: t(`${p}.faq.predictRisk`),
      predictRiskAnswer: t(`${p}.faq.predictRiskAnswer`),
    },
  };
}
