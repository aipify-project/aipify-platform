import type { PlatformAutomation, PlatformMetrics } from "./types";
import type { PlatformDashboardSnapshot } from "./ai-dashboard";

export type ExecutivePriority = "critical" | "important" | "informational";

export type BriefingItem = {
  id: string;
  message: string;
  priority: ExecutivePriority;
};

export type RecommendedAction = {
  id: string;
  icon: "warning" | "insight";
  title: string;
  reason: string;
  suggestedAction: string;
  priority: ExecutivePriority;
  href?: string;
};

export type SinceLoginEvent = {
  id: string;
  label: string;
  count: number;
  href?: string;
};

export type AutomationHealthSummary = {
  total: number;
  successRate: number;
  avgExecutionMs: number;
  warnings: number;
  failures: number;
  upcoming: number;
  needsAttention: PlatformAutomation[];
};

export type SupportAiPerformance = {
  requestsToday: number;
  resolvedByAi: number;
  escalatedCases: number;
  avgResponseTimeSeconds: number;
  satisfactionScore: number;
  escalationReasons: string[];
};

export type InstallationHealthStatus = "healthy" | "warning" | "critical";

export type SuccessScoreStatus = "excellent" | "good" | "needs_attention" | "at_risk";

export function getInstallationHealthStatus(score: number): InstallationHealthStatus {
  if (score >= 85) return "healthy";
  if (score >= 65) return "warning";
  return "critical";
}

export function getSuccessScoreStatus(score: number): SuccessScoreStatus {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "needs_attention";
  return "at_risk";
}

type BriefingTemplates = {
  newCustomers: (count: number) => string;
  trialsEnding: (count: number) => string;
  supportResolved: (count: number) => string;
  escalated: (count: number) => string;
  failedAutomations: (count: number) => string;
  systemWarnings: (count: number) => string;
  newRecommendations: (count: number) => string;
  noIncidents: string;
  incidents: (count: number) => string;
  followUp: (count: number) => string;
};

export function buildExecutiveBriefingItems(
  snapshot: PlatformDashboardSnapshot,
  templates: BriefingTemplates
): BriefingItem[] {
  const items: BriefingItem[] = [];

  if (snapshot.failed_automations > 0) {
    items.push({
      id: "failed-automations",
      message: templates.failedAutomations(snapshot.failed_automations),
      priority: "critical",
    });
  }
  if (snapshot.escalated_cases > 0) {
    items.push({
      id: "escalated",
      message: templates.escalated(snapshot.escalated_cases),
      priority: "critical",
    });
  }
  if (snapshot.system_warnings > 0) {
    items.push({
      id: "system-warnings",
      message: templates.systemWarnings(snapshot.system_warnings),
      priority: "important",
    });
  }
  if (snapshot.trials_ending_7d > 0) {
    items.push({
      id: "trials-ending",
      message: templates.trialsEnding(snapshot.trials_ending_7d),
      priority: "important",
    });
  }
  if (snapshot.follow_up_customers > 0) {
    items.push({
      id: "follow-up",
      message: templates.followUp(snapshot.follow_up_customers),
      priority: "important",
    });
  }
  if (snapshot.new_customers > 0) {
    items.push({
      id: "new-customers",
      message: templates.newCustomers(snapshot.new_customers),
      priority: "informational",
    });
  }
  if (snapshot.support_resolved > 0) {
    items.push({
      id: "support-resolved",
      message: templates.supportResolved(snapshot.support_resolved),
      priority: "informational",
    });
  }
  if (snapshot.new_ai_recommendations > 0) {
    items.push({
      id: "new-recommendations",
      message: templates.newRecommendations(snapshot.new_ai_recommendations),
      priority: "informational",
    });
  }
  if (snapshot.system_incidents === 0 && snapshot.failed_automations === 0) {
    items.push({
      id: "no-incidents",
      message: templates.noIncidents,
      priority: "informational",
    });
  } else if (snapshot.system_incidents > 0) {
    items.push({
      id: "incidents",
      message: templates.incidents(snapshot.system_incidents),
      priority: "important",
    });
  }

  return items;
}

type ActionTemplates = {
  trialsExpiring: (count: number) => { title: string; reason: string; action: string };
  healthDropped: { title: string; reason: string; action: string };
  escalationWaiting: { title: string; reason: string; action: string };
  revenueOpportunity: { title: string; reason: string; action: string };
  failedAutomation: (count: number) => { title: string; reason: string; action: string };
};

export function buildRecommendedActions(
  snapshot: PlatformDashboardSnapshot,
  metrics: PlatformMetrics | null,
  templates: ActionTemplates
): RecommendedAction[] {
  const actions: RecommendedAction[] = [];

  if (snapshot.trials_ending_7d > 0) {
    const t = templates.trialsExpiring(snapshot.trials_ending_7d);
    actions.push({
      id: "trials-expiring",
      icon: "warning",
      title: t.title,
      reason: t.reason,
      suggestedAction: t.action,
      priority: "critical",
      href: "/platform/customers",
    });
  }

  if (snapshot.failed_automations > 0) {
    const t = templates.failedAutomation(snapshot.failed_automations);
    actions.push({
      id: "failed-automation",
      icon: "warning",
      title: t.title,
      reason: t.reason,
      suggestedAction: t.action,
      priority: "critical",
      href: "/platform/automations",
    });
  }

  if (snapshot.waiting_human > 0) {
    const t = templates.escalationWaiting;
    actions.push({
      id: "escalation-waiting",
      icon: "warning",
      title: t.title,
      reason: t.reason,
      suggestedAction: t.action,
      priority: "important",
      href: "/platform/support",
    });
  }

  const healthScore = metrics
    ? Math.round(
        ((metrics.installations.active /
          Math.max(metrics.installations.total, 1)) *
          100)
      )
    : 100;

  if (healthScore < 90) {
    const t = templates.healthDropped;
    actions.push({
      id: "health-dropped",
      icon: "warning",
      title: t.title,
      reason: t.reason.replace("{score}", String(healthScore)),
      suggestedAction: t.action,
      priority: "important",
      href: "/platform/installations",
    });
  }

  if (metrics && metrics.growth.new_customers_30d > 0) {
    const t = templates.revenueOpportunity;
    actions.push({
      id: "revenue-opportunity",
      icon: "insight",
      title: t.title,
      reason: t.reason,
      suggestedAction: t.action,
      priority: "informational",
      href: "/platform/metrics",
    });
  }

  return actions;
}

type SinceLoginTemplates = {
  newCustomers: (count: number) => string;
  supportResolved: (count: number) => string;
  escalated: (count: number) => string;
  installationsCompleted: (count: number) => string;
  automationsTriggered: (count: number) => string;
  aiRecommendations: (count: number) => string;
  systemIncidents: (count: number) => string;
  revenueEvents: (count: number) => string;
};

export function buildSinceLoginEvents(
  snapshot: PlatformDashboardSnapshot,
  metrics: PlatformMetrics | null,
  templates: SinceLoginTemplates
): SinceLoginEvent[] {
  return [
    {
      id: "new-customers",
      label: templates.newCustomers(snapshot.new_customers),
      count: snapshot.new_customers,
      href: "/platform/customers",
    },
    {
      id: "support-resolved",
      label: templates.supportResolved(snapshot.support_resolved),
      count: snapshot.support_resolved,
      href: "/platform/support",
    },
    {
      id: "escalated",
      label: templates.escalated(snapshot.escalated_cases),
      count: snapshot.escalated_cases,
      href: "/platform/support",
    },
    {
      id: "installations",
      label: templates.installationsCompleted(snapshot.new_installations),
      count: snapshot.new_installations,
      href: "/platform/installations",
    },
    {
      id: "automations",
      label: templates.automationsTriggered(snapshot.automations_triggered),
      count: snapshot.automations_triggered,
      href: "/platform/automations",
    },
    {
      id: "recommendations",
      label: templates.aiRecommendations(
        metrics?.ai_activity.ai_recommendations_generated ?? snapshot.new_ai_recommendations
      ),
      count: snapshot.new_ai_recommendations,
      href: "/platform/metrics",
    },
    {
      id: "incidents",
      label: templates.systemIncidents(snapshot.system_incidents),
      count: snapshot.system_incidents,
      href: "/platform/system",
    },
    {
      id: "revenue",
      label: templates.revenueEvents(snapshot.revenue_events),
      count: snapshot.revenue_events,
      href: "/platform/billing",
    },
  ];
}

export function computeAutomationHealthSummary(
  automations: PlatformAutomation[]
): AutomationHealthSummary {
  const total = automations.length;
  const failures = automations.filter((a) => a.status === "failed").length;
  const warnings = automations.filter((a) => a.status === "warning").length;
  const totalExecutions = automations.reduce((sum, a) => sum + a.total_executions, 0);
  const totalFailureCount = automations.reduce((sum, a) => sum + a.failure_count, 0);
  const successRate =
    totalExecutions === 0
      ? 100
      : Math.round(((totalExecutions - totalFailureCount) / totalExecutions) * 100);
  const avgExecutionMs =
    total === 0
      ? 0
      : Math.round(automations.reduce((sum, a) => sum + a.avg_execution_ms, 0) / total);
  const upcoming = automations.filter((a) => a.next_run_at != null).length;
  const needsAttention = automations.filter(
    (a) => a.status === "failed" || a.status === "warning"
  );

  return {
    total,
    successRate,
    avgExecutionMs,
    warnings,
    failures,
    upcoming,
    needsAttention,
  };
}

export function parseSupportAiPerformance(data: Record<string, unknown>): SupportAiPerformance {
  return {
    requestsToday: Number(data.requests_today ?? 0),
    resolvedByAi: Number(data.resolved_by_ai ?? 0),
    escalatedCases: Number(data.escalated_cases ?? 0),
    avgResponseTimeSeconds: Number(data.avg_response_time_seconds ?? 0),
    satisfactionScore: Number(data.satisfaction_score ?? 0),
    escalationReasons: Array.isArray(data.escalation_reasons)
      ? (data.escalation_reasons as string[]).filter(Boolean)
      : [],
  };
}

export const PRIORITY_STYLES: Record<ExecutivePriority, string> = {
  critical: "bg-rose-50 text-rose-700 ring-rose-100",
  important: "bg-amber-50 text-amber-700 ring-amber-100",
  informational: "bg-blue-50 text-blue-700 ring-blue-100",
};
