import type { Translator } from "@/lib/i18n/translate";
import type { CustomerLifecycleCenterLabels } from "./types";
import { HEALTH_STATUSES, LIFECYCLE_STAGES, PLAN_TYPES } from "./constants";

export function buildCustomerLifecycleCenterLabels(t: Translator): CustomerLifecycleCenterLabels {
  const p = "platform.customerLifecycleCenter";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      stages: t(`${p}.sections.stages`),
      customers: t(`${p}.sections.customers`),
      atRisk: t(`${p}.sections.atRisk`),
      expansion: t(`${p}.sections.expansion`),
      timeline: t(`${p}.sections.timeline`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
      healthScore: t(`${p}.sections.healthScore`),
    },
    overview: {
      newCustomers: t(`${p}.overview.newCustomers`),
      trialCustomers: t(`${p}.overview.trialCustomers`),
      activeCustomers: t(`${p}.overview.activeCustomers`),
      atRiskCustomers: t(`${p}.overview.atRiskCustomers`),
      churnedCustomers: t(`${p}.overview.churnedCustomers`),
      reactivatedCustomers: t(`${p}.overview.reactivatedCustomers`),
    },
    table: {
      company: t(`${p}.table.company`),
      lifecycleStage: t(`${p}.table.lifecycleStage`),
      currentPlan: t(`${p}.table.currentPlan`),
      users: t(`${p}.table.users`),
      country: t(`${p}.table.country`),
      daysAsCustomer: t(`${p}.table.daysAsCustomer`),
      healthScore: t(`${p}.table.healthScore`),
      lastActivity: t(`${p}.table.lastActivity`),
      actions: t(`${p}.table.actions`),
      customer: t(`${p}.table.customer`),
      riskReason: t(`${p}.table.riskReason`),
      recommendedAction: t(`${p}.table.recommendedAction`),
      opportunity: t(`${p}.table.opportunity`),
      revenueImpact: t(`${p}.table.revenueImpact`),
      event: t(`${p}.table.event`),
    },
    healthFactors: {
      loginFrequency: t(`${p}.healthFactors.loginFrequency`),
      featureAdoption: t(`${p}.healthFactors.featureAdoption`),
      supportInteractions: t(`${p}.healthFactors.supportInteractions`),
      paymentHistory: t(`${p}.healthFactors.paymentHistory`),
      teamEngagement: t(`${p}.healthFactors.teamEngagement`),
    },
    stages: Object.fromEntries(
      LIFECYCLE_STAGES.map((stage) => [stage, t(`${p}.stages.${stage}`)])
    ) as CustomerLifecycleCenterLabels["stages"],
    healthStatuses: Object.fromEntries(
      HEALTH_STATUSES.map((status) => [status, t(`${p}.healthStatuses.${status}`)])
    ) as CustomerLifecycleCenterLabels["healthStatuses"],
    actions: {
      view: t(`${p}.actions.view`),
      contact: t(`${p}.actions.contact`),
      scheduleOnboarding: t(`${p}.actions.scheduleOnboarding`),
      offerTraining: t(`${p}.actions.offerTraining`),
      escalate: t(`${p}.actions.escalate`),
      monitor: t(`${p}.actions.monitor`),
      applying: t(`${p}.actions.applying`),
    },
    filters: {
      lifecycleStage: t(`${p}.filters.lifecycleStage`),
      country: t(`${p}.filters.country`),
      healthStatus: t(`${p}.filters.healthStatus`),
      plan: t(`${p}.filters.plan`),
      registrationFrom: t(`${p}.filters.registrationFrom`),
      registrationTo: t(`${p}.filters.registrationTo`),
      allStages: t(`${p}.filters.allStages`),
      allHealth: t(`${p}.filters.allHealth`),
      allPlans: t(`${p}.filters.allPlans`),
      allCountries: t(`${p}.filters.allCountries`),
      apply: t(`${p}.filters.apply`),
    },
    plans: Object.fromEntries(
      PLAN_TYPES.map((plan) => [plan, t(`${p}.plans.${plan}`)])
    ) as CustomerLifecycleCenterLabels["plans"],
  };
}
