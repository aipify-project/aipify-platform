import type { PlatformMetrics } from "./types";

export type MetricAlert = {
  id: string;
  message: string;
  tone: "info" | "warning" | "critical";
};

export type MetricRecommendation = {
  id: string;
  message: string;
};

export function formatMetricCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMetricNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

/**
 * Historical MRR series is not exposed by Core. Do not invent progressive curves.
 * Callers must treat an empty array as “trend unavailable”.
 */
export function buildMrrTrendSeries(_currentMrr: number): number[] {
  return [];
}

/**
 * Monthly customer growth series is not exposed by Core beyond a single 30d count.
 */
export function buildCustomerGrowthSeries(_recentCount: number, _total: number): number[] {
  return [];
}

/** Percent change vs previous period is unavailable without metrics history. */
export function estimateMrrGrowthPercent(_metrics: PlatformMetrics): number | null {
  return null;
}

export function estimateActiveCustomerTrend(_metrics: PlatformMetrics): number | null {
  return null;
}

export function getTrialsEndingSoon(metrics: PlatformMetrics): number {
  return metrics.customers.trial;
}

export function getSystemHealth(metrics: PlatformMetrics): {
  label: "healthy" | "stable" | "attention";
  score: number;
} {
  let score = 100;
  score -= metrics.installations.failed * 18;
  score -= metrics.customers.overdue * 22;
  score -= metrics.revenue.outstanding_invoice_amount > 0 ? 12 : 0;
  score = Math.max(0, Math.min(100, score));

  if (score >= 85) return { label: "healthy", score };
  if (score >= 65) return { label: "stable", score };
  return { label: "attention", score };
}

export function buildAlerts(
  metrics: PlatformMetrics,
  templates: {
    trialsEnding: (count: number) => string;
    overdueInvoice: (count: number) => string;
    failedSync: (count: number) => string;
    followUp: (count: number) => string;
    none: string;
  }
): MetricAlert[] {
  const alerts: MetricAlert[] = [];
  const trialsEnding = getTrialsEndingSoon(metrics);

  if (trialsEnding > 0) {
    alerts.push({
      id: "trials-ending",
      message: templates.trialsEnding(trialsEnding),
      tone: "warning",
    });
  }

  const overdueCount =
    metrics.customers.overdue + (metrics.revenue.outstanding_invoice_amount > 0 ? 1 : 0);
  if (overdueCount > 0) {
    alerts.push({
      id: "overdue-invoice",
      message: templates.overdueInvoice(overdueCount),
      tone: metrics.customers.overdue > 0 ? "critical" : "warning",
    });
  }

  if (metrics.installations.failed > 0) {
    alerts.push({
      id: "failed-sync",
      message: templates.failedSync(metrics.installations.failed),
      tone: "warning",
    });
  }

  const followUp = metrics.customers.paused + metrics.customers.overdue;
  if (followUp > 0) {
    alerts.push({
      id: "follow-up",
      message: templates.followUp(followUp),
      tone: "info",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "clear",
      message: templates.none,
      tone: "info",
    });
  }

  return alerts;
}

export function buildRecommendations(
  metrics: PlatformMetrics,
  templates: {
    inactiveModules: (count: number) => string;
    trialsExpiring: (count: number) => string;
    contactBeforeTrial: string;
    bestPlan: string;
    bestPlanConversion: string;
    supportAiImpact: (count: number) => string;
    supportAiHoursSaved: (hours: number) => string;
  }
): MetricRecommendation[] {
  const items: MetricRecommendation[] = [];
  const inactiveCustomers = Math.max(
    metrics.customers.total - metrics.customers.active - metrics.customers.trial,
    0
  );

  if (inactiveCustomers > 0) {
    items.push({
      id: "inactive-modules",
      message: templates.inactiveModules(inactiveCustomers),
    });
  }

  if (metrics.customers.trial > 0) {
    items.push({
      id: "trials-expiring",
      message: templates.trialsExpiring(metrics.customers.trial),
    });
    items.push({
      id: "contact-before-trial",
      message: templates.contactBeforeTrial,
    });
  }

  items.push({
    id: "best-plan",
    message: templates.bestPlan,
  });

  items.push({
    id: "best-plan-conversion",
    message: templates.bestPlanConversion,
  });

  if (metrics.ai_activity.support_requests_handled > 0) {
    items.push({
      id: "support-ai-impact",
      message: templates.supportAiImpact(metrics.ai_activity.support_requests_handled),
    });
    const hoursSaved = Math.max(
      1,
      Math.round(metrics.ai_activity.support_requests_handled * 0.66)
    );
    items.push({
      id: "support-ai-hours",
      message: templates.supportAiHoursSaved(hoursSaved),
    });
  }

  return items.slice(0, 6);
}
