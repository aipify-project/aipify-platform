import type { Translator } from "@/lib/i18n/translate";
import type { ExecutiveOperationsLabels } from "./types";
import {
  ACTION_CATEGORIES,
  ACTION_PRIORITIES,
  ALERT_TYPES,
  CALENDAR_EVENT_TYPES,
  EXECUTIVE_PERIODS,
  HEALTH_STATUSES,
} from "./constants";

export function buildExecutiveOperationsLabels(t: Translator): ExecutiveOperationsLabels {
  const p = "platform.executiveOperationsCenter";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sinceLastLogin: t(`${p}.sinceLastLogin`),
    sections: {
      overview: t(`${p}.sections.overview`),
      summary: t(`${p}.sections.summary`),
      actions: t(`${p}.sections.actions`),
      organizationalHealth: t(`${p}.sections.organizationalHealth`),
      growth: t(`${p}.sections.growth`),
      system: t(`${p}.sections.system`),
      alerts: t(`${p}.sections.alerts`),
      calendar: t(`${p}.sections.calendar`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
    },
    overview: {
      activeCustomers: t(`${p}.overview.activeCustomers`),
      mrr: t(`${p}.overview.mrr`),
      customerGrowth: t(`${p}.overview.customerGrowth`),
      systemHealth: t(`${p}.overview.systemHealth`),
      criticalIssues: t(`${p}.overview.criticalIssues`),
      actionsRequired: t(`${p}.overview.actionsRequired`),
    },
    table: {
      action: t(`${p}.table.action`),
      category: t(`${p}.table.category`),
      priority: t(`${p}.table.priority`),
      dueDate: t(`${p}.table.dueDate`),
      owner: t(`${p}.table.owner`),
      actions: t(`${p}.table.actions`),
      event: t(`${p}.table.event`),
      score: t(`${p}.table.score`),
      status: t(`${p}.table.status`),
      scheduledAt: t(`${p}.table.scheduledAt`),
      title: t(`${p}.table.title`),
    },
    categories: Object.fromEntries(
      ACTION_CATEGORIES.map((key) => [key, t(`${p}.categories.${key}`)])
    ) as ExecutiveOperationsLabels["categories"],
    priorities: Object.fromEntries(
      ACTION_PRIORITIES.map((key) => [key, t(`${p}.priorities.${key}`)])
    ) as ExecutiveOperationsLabels["priorities"],
    healthStatuses: Object.fromEntries(
      HEALTH_STATUSES.map((key) => [key, t(`${p}.healthStatuses.${key}`)])
    ) as ExecutiveOperationsLabels["healthStatuses"],
    healthMetrics: {
      customer: t(`${p}.healthMetrics.customer`),
      revenue: t(`${p}.healthMetrics.revenue`),
      platform: t(`${p}.healthMetrics.platform`),
      support: t(`${p}.healthMetrics.support`),
    },
    growth: {
      newCustomers: t(`${p}.growth.newCustomers`),
      upgrades: t(`${p}.growth.upgrades`),
      expansionRevenue: t(`${p}.growth.expansionRevenue`),
      churnRate: t(`${p}.growth.churnRate`),
      trialConversion: t(`${p}.growth.trialConversion`),
    },
    system: {
      infrastructure: t(`${p}.system.infrastructure`),
      paymentProvider: t(`${p}.system.paymentProvider`),
      integration: t(`${p}.system.integration`),
      aiEngine: t(`${p}.system.aiEngine`),
      notification: t(`${p}.system.notification`),
      uptime: t(`${p}.system.uptime`),
    },
    alertTypes: Object.fromEntries(
      ALERT_TYPES.map((key) => [key, t(`${p}.alertTypes.${key}`)])
    ) as ExecutiveOperationsLabels["alertTypes"],
    calendarTypes: Object.fromEntries(
      CALENDAR_EVENT_TYPES.map((key) => [key, t(`${p}.calendarTypes.${key}`)])
    ) as ExecutiveOperationsLabels["calendarTypes"],
    systemStatuses: {
      operational: t(`${p}.systemStatuses.operational`),
      healthy: t(`${p}.systemStatuses.healthy`),
      degraded: t(`${p}.systemStatuses.degraded`),
      attention: t(`${p}.systemStatuses.attention`),
    },
    actions: {
      approve: t(`${p}.actions.approve`),
      escalate: t(`${p}.actions.escalate`),
      acknowledge: t(`${p}.actions.acknowledge`),
      complete: t(`${p}.actions.complete`),
      applying: t(`${p}.actions.applying`),
    },
    filters: {
      period: t(`${p}.filters.period`),
      apply: t(`${p}.filters.apply`),
    },
    periods: Object.fromEntries(
      EXECUTIVE_PERIODS.map((key) => [key, t(`${p}.periods.${key}`)])
    ) as ExecutiveOperationsLabels["periods"],
  };
}
