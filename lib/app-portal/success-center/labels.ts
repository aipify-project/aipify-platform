import type { SuccessCenterLabels } from "./types";
import type { Translator } from "@/lib/i18n/translate";

export function buildSuccessCenterLabels(t: Translator): SuccessCenterLabels {
  const p = "customerApp.portalStructure.successCenter";
  const rec = (key: string) => ({
    title: t(`${p}.recommendations.${key}.title`),
    reason: t(`${p}.recommendations.${key}.reason`),
    benefit: t(`${p}.recommendations.${key}.benefit`),
    action: t(`${p}.recommendations.${key}.action`),
  });
  const growth = (key: string) => ({
    title: t(`${p}.growth.${key}.title`),
    description: t(`${p}.growth.${key}.description`),
    action: t(`${p}.growth.${key}.action`),
  });
  const factor = (key: string) => ({
    label: t(`${p}.factors.${key}.label`),
    impact: t(`${p}.factors.${key}.impact`),
  });

  return {
    eyebrow: t(`${p}.eyebrow`),
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    breadcrumbSupport: t(`${p}.breadcrumbSupport`),
    breadcrumbSuccessCenter: t(`${p}.breadcrumbSuccessCenter`),
    backToSupport: t(`${p}.backToSupport`),
    purposeSummary: {
      healthy: t(`${p}.purposeSummary.healthy`),
      moderate: t(`${p}.purposeSummary.moderate`),
      poor: t(`${p}.purposeSummary.poor`),
      critical: t(`${p}.purposeSummary.critical`),
    },
    emptyTitle: t(`${p}.emptyTitle`),
    emptyBody: t(`${p}.emptyBody`),
    emptyAction: t(`${p}.emptyAction`),
    errorTitle: t(`${p}.errorTitle`),
    errorBody: t(`${p}.errorBody`),
    retry: t(`${p}.retry`),
    sections: {
      overview: t(`${p}.sections.overview`),
      recommendations: t(`${p}.sections.recommendations`),
      timeline: t(`${p}.sections.timeline`),
      growth: t(`${p}.sections.growth`),
      adoption: t(`${p}.sections.adoption`),
      factors: t(`${p}.sections.factors`),
      understandingScore: t(`${p}.sections.understandingScore`),
      completedRecommendations: t(`${p}.sections.completedRecommendations`),
    },
    overview: {
      organizationOverview: t(`${p}.overview.organizationOverview`),
      healthScore: t(`${p}.overview.healthScore`),
      adoptionScore: t(`${p}.overview.adoptionScore`),
      engagementScore: t(`${p}.overview.engagementScore`),
      utilizationScore: t(`${p}.overview.utilizationScore`),
      healthStatus: t(`${p}.overview.healthStatus`),
      riskLevel: t(`${p}.overview.riskLevel`),
      advisory: t(`${p}.overview.advisory`),
      lastUpdated: t(`${p}.overview.lastUpdated`),
      recommendedNextAction: t(`${p}.overview.recommendedNextAction`),
    },
    scoreExplanations: {
      adoption: t(`${p}.scoreExplanations.adoption`),
      engagement: t(`${p}.scoreExplanations.engagement`),
      utilization: t(`${p}.scoreExplanations.utilization`),
    },
    healthStates: {
      healthy: t(`${p}.healthStates.healthy`),
      good: t(`${p}.healthStates.good`),
      moderate: t(`${p}.healthStates.moderate`),
      poor: t(`${p}.healthStates.poor`),
      critical_health: t(`${p}.healthStates.criticalHealth`),
      unknown: t(`${p}.healthStates.unknown`),
    },
    riskLevels: {
      low: t(`${p}.riskLevels.low`),
      moderate: t(`${p}.riskLevels.moderate`),
      elevated: t(`${p}.riskLevels.elevated`),
      high: t(`${p}.riskLevels.high`),
    },
    priorities: {
      high: t(`${p}.priorities.high`),
      medium: t(`${p}.priorities.medium`),
      low: t(`${p}.priorities.low`),
    },
    recommendationStatus: {
      open: t(`${p}.recommendationStatus.open`),
      in_progress: t(`${p}.recommendationStatus.inProgress`),
      completed: t(`${p}.recommendationStatus.completed`),
    },
    recommendations: {
      inviteTeam: rec("inviteTeam"),
      explorePacks: rec("explorePacks"),
      enableIntegrations: rec("enableIntegrations"),
      reviewSupport: rec("reviewSupport"),
      reviewApprovals: rec("reviewApprovals"),
      completeFollowUps: rec("completeFollowUps"),
      completeOnboarding: rec("completeOnboarding"),
      configureSecurity: rec("configureSecurity"),
    },
    growth: {
      team_expansion: growth("team_expansion"),
      business_packs: growth("business_packs"),
      integrations: growth("integrations"),
      plan_upgrade: growth("plan_upgrade"),
    },
    adoption: {
      activeUsers: t(`${p}.adoption.activeUsers`),
      teamSize: t(`${p}.adoption.teamSize`),
      businessPacks: t(`${p}.adoption.businessPacks`),
      activeCapabilities: t(`${p}.adoption.activeCapabilities`),
      integrationsUsed: t(`${p}.adoption.integrationsUsed`),
      unusedCapabilities: t(`${p}.adoption.unusedCapabilities`),
    },
    factors: {
      active_users: factor("active_users"),
      team_size: factor("team_size"),
      business_packs: factor("business_packs"),
      integrations: factor("integrations"),
      open_support: factor("open_support"),
      pending_approvals: factor("pending_approvals"),
      open_follow_ups: factor("open_follow_ups"),
    },
    factorActions: {
      active_users: t(`${p}.factorActions.active_users`),
      team_size: t(`${p}.factorActions.team_size`),
      business_packs: t(`${p}.factorActions.business_packs`),
      integrations: t(`${p}.factorActions.integrations`),
      open_support: t(`${p}.factorActions.open_support`),
      pending_approvals: t(`${p}.factorActions.pending_approvals`),
      open_follow_ups: t(`${p}.factorActions.open_follow_ups`),
    },
    timelineStatus: {
      completed: t(`${p}.timelineStatus.completed`),
      open: t(`${p}.timelineStatus.open`),
      in_progress: t(`${p}.timelineStatus.inProgress`),
    },
    understandingScore: {
      adoptionTitle: t(`${p}.understandingScore.adoptionTitle`),
      adoptionBody: t(`${p}.understandingScore.adoptionBody`),
      engagementTitle: t(`${p}.understandingScore.engagementTitle`),
      engagementBody: t(`${p}.understandingScore.engagementBody`),
      utilizationTitle: t(`${p}.understandingScore.utilizationTitle`),
      utilizationBody: t(`${p}.understandingScore.utilizationBody`),
      methodologyLink: t(`${p}.understandingScore.methodologyLink`),
    },
  };
}
