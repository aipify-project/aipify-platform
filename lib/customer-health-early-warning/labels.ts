import type { Translator } from "@/lib/i18n/translate";
import type { CustomerHealthLabels } from "./types";
import { HEALTH_CATEGORIES, HEALTH_TRENDS, SUPPORT_STATUSES } from "./constants";

export function buildCustomerHealthLabels(t: Translator): CustomerHealthLabels {
  const p = "superAdmin.customerHealth";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      customers: t(`${p}.sections.customers`),
      warnings: t(`${p}.sections.warnings`),
      recommendations: t(`${p}.sections.recommendations`),
      tasks: t(`${p}.sections.tasks`),
      recovery: t(`${p}.sections.recovery`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
    },
    overview: {
      healthy: t(`${p}.overview.healthy`),
      stable: t(`${p}.overview.stable`),
      attentionNeeded: t(`${p}.overview.attentionNeeded`),
      atRisk: t(`${p}.overview.atRisk`),
      recoveryOpportunities: t(`${p}.overview.recoveryOpportunities`),
    },
    table: {
      company: t(`${p}.table.company`),
      healthScore: t(`${p}.table.healthScore`),
      trend: t(`${p}.table.trend`),
      lastActivity: t(`${p}.table.lastActivity`),
      subscriptionPlan: t(`${p}.table.subscriptionPlan`),
      supportStatus: t(`${p}.table.supportStatus`),
      assignedOwner: t(`${p}.table.assignedOwner`),
      actions: t(`${p}.table.actions`),
      signal: t(`${p}.table.signal`),
      message: t(`${p}.table.message`),
      recommendation: t(`${p}.table.recommendation`),
      task: t(`${p}.table.task`),
      workflow: t(`${p}.table.workflow`),
      event: t(`${p}.table.event`),
    },
    healthCategories: Object.fromEntries(
      HEALTH_CATEGORIES.map((key) => [key, t(`${p}.healthCategories.${key}`)])
    ) as CustomerHealthLabels["healthCategories"],
    trends: Object.fromEntries(
      HEALTH_TRENDS.map((key) => [key, t(`${p}.trends.${key}`)])
    ) as CustomerHealthLabels["trends"],
    supportStatuses: Object.fromEntries(
      SUPPORT_STATUSES.map((key) => [key, t(`${p}.supportStatuses.${key}`)])
    ) as CustomerHealthLabels["supportStatuses"],
    actions: {
      assignOwner: t(`${p}.actions.assignOwner`),
      recoveryOutreach: t(`${p}.actions.recoveryOutreach`),
      onboardingSequence: t(`${p}.actions.onboardingSequence`),
      recommendTraining: t(`${p}.actions.recommendTraining`),
      scheduleCheckIn: t(`${p}.actions.scheduleCheckIn`),
      resolveWarning: t(`${p}.actions.resolveWarning`),
      completeTask: t(`${p}.actions.completeTask`),
      applying: t(`${p}.actions.applying`),
    },
    filters: {
      category: t(`${p}.filters.category`),
      trend: t(`${p}.filters.trend`),
      allCategories: t(`${p}.filters.allCategories`),
      allTrends: t(`${p}.filters.allTrends`),
      apply: t(`${p}.filters.apply`),
    },
  };
}
