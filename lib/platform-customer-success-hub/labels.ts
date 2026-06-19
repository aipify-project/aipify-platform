import type { Translator } from "@/lib/i18n/translate";
import type { PlatformCustomerSuccessHubLabels } from "./types";
import {
  HEALTH_STATUSES,
  PLAYBOOK_TYPES,
  RISK_SEVERITIES,
  RISK_TYPES,
} from "./constants";

export function buildPlatformCustomerSuccessHubLabels(
  t: Translator
): PlatformCustomerSuccessHubLabels {
  const p = "platform.customerSuccessHub";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    legacyLink: t(`${p}.legacyLink`),
    tabs: {
      overview: t(`${p}.tabs.overview`),
      customer_health: t(`${p}.tabs.customerHealth`),
      onboarding: t(`${p}.tabs.onboarding`),
      guidance: t(`${p}.tabs.guidance`),
      success_plans: t(`${p}.tabs.successPlans`),
      adoption: t(`${p}.tabs.adoption`),
      risks: t(`${p}.tabs.risks`),
      companion_insights: t(`${p}.tabs.companionInsights`),
      reports: t(`${p}.tabs.reports`),
      executive: t(`${p}.tabs.executive`),
    },
    overview: {
      healthyCustomers: t(`${p}.overview.healthyCustomers`),
      needsAttention: t(`${p}.overview.needsAttention`),
      atRiskCustomers: t(`${p}.overview.atRiskCustomers`),
      newCustomers: t(`${p}.overview.newCustomers`),
      onboardingProgress: t(`${p}.overview.onboardingProgress`),
      businessPackAdoption: t(`${p}.overview.businessPackAdoption`),
      supportTrends: t(`${p}.overview.supportTrends`),
      customerGrowth: t(`${p}.overview.customerGrowth`),
      openRisks: t(`${p}.overview.openRisks`),
      expansionOpportunities: t(`${p}.overview.expansionOpportunities`),
      proactivePending: t(`${p}.overview.proactivePending`),
    },
    health: {
      customer: t(`${p}.health.customer`),
      status: t(`${p}.health.status`),
      score: t(`${p}.health.score`),
      adoption: t(`${p}.health.adoption`),
    },
    onboarding: {
      customer: t(`${p}.onboarding.customer`),
      progress: t(`${p}.onboarding.progress`),
      milestones: t(`${p}.onboarding.milestones`),
    },
    guidance: {
      customer: t(`${p}.guidance.customer`),
      step: t(`${p}.guidance.step`),
      status: t(`${p}.guidance.status`),
      companionMessage: t(`${p}.guidance.companionMessage`),
    },
    risks: {
      customer: t(`${p}.risks.customer`),
      type: t(`${p}.risks.type`),
      severity: t(`${p}.risks.severity`),
      recommendation: t(`${p}.risks.recommendation`),
    },
    companion: {
      insights: t(`${p}.companion.insights`),
      pendingAssistance: t(`${p}.companion.pendingAssistance`),
    },
    executive: {
      title: t(`${p}.executive.title`),
      renewalRisks: t(`${p}.executive.renewalRisks`),
      partnerSuccess: t(`${p}.executive.partnerSuccess`),
    },
    reports: {
      title: t(`${p}.reports.title`),
      healthTrends: t(`${p}.reports.healthTrends`),
      onboardingRate: t(`${p}.reports.onboardingRate`),
      packAdoption: t(`${p}.reports.packAdoption`),
      companionMetrics: t(`${p}.reports.companionMetrics`),
    },
    playbooks: {
      title: t(`${p}.playbooks.title`),
      description: t(`${p}.playbooks.description`),
      steps: t(`${p}.playbooks.steps`),
    },
    actions: {
      completeGuidance: t(`${p}.actions.completeGuidance`),
      acknowledgeRisk: t(`${p}.actions.acknowledgeRisk`),
      resolveRisk: t(`${p}.actions.resolveRisk`),
      deliverProactive: t(`${p}.actions.deliverProactive`),
      viewOnboarding: t(`${p}.actions.viewOnboarding`),
      viewPlaybooks: t(`${p}.actions.viewPlaybooks`),
    },
    healthStatuses: Object.fromEntries(
      HEALTH_STATUSES.map((key) => [key, t(`${p}.healthStatuses.${key}`)])
    ) as PlatformCustomerSuccessHubLabels["healthStatuses"],
    riskTypes: Object.fromEntries(
      RISK_TYPES.map((key) => [key, t(`${p}.riskTypes.${key}`)])
    ) as PlatformCustomerSuccessHubLabels["riskTypes"],
    severities: Object.fromEntries(
      RISK_SEVERITIES.map((key) => [key, t(`${p}.severities.${key}`)])
    ) as PlatformCustomerSuccessHubLabels["severities"],
    playbookTypes: Object.fromEntries(
      PLAYBOOK_TYPES.map((key) => [key, t(`${p}.playbookTypes.${key}`)])
    ) as PlatformCustomerSuccessHubLabels["playbookTypes"],
  };
}
