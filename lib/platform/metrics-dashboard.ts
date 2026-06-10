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

export function buildMrrTrendSeries(currentMrr: number): number[] {
  const factors = [0.72, 0.78, 0.85, 0.91, 0.96, 1];
  return factors.map((factor) => Math.round(currentMrr * factor));
}

export function buildCustomerGrowthSeries(recentCount: number, total: number): number[] {
  const anchor = Math.max(recentCount, 1);
  const base = Math.max(total - anchor * 3, 0);
  return [
    Math.max(base, 1),
    Math.max(base + anchor, 1),
    Math.max(base + anchor * 2, 1),
    Math.max(base + anchor * 2, 1),
    Math.max(base + anchor * 3, 1),
    Math.max(recentCount, 1),
  ];
}

export function estimateMrrGrowthPercent(metrics: PlatformMetrics): number {
  if (metrics.revenue.mrr <= 0) return 0;
  const lift = metrics.growth.new_customers_30d * 8;
  return Math.min(Math.max(lift, 0), 28);
}

export function estimateActiveCustomerTrend(metrics: PlatformMetrics): number {
  if (metrics.customers.active <= 0) return 0;
  return Math.min(
    Math.round((metrics.growth.new_customers_30d / Math.max(metrics.customers.active, 1)) * 100),
    24
  );
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
    bestPlan: string;
    supportAiImpact: (count: number) => string;
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
  }

  items.push({
    id: "best-plan",
    message: templates.bestPlan,
  });

  if (metrics.ai_activity.support_requests_handled > 0) {
    items.push({
      id: "support-ai-impact",
      message: templates.supportAiImpact(metrics.ai_activity.support_requests_handled),
    });
  }

  return items.slice(0, 4);
}
