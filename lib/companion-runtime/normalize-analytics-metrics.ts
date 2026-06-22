import type { CompanionOperationalContext } from "./companion-operational-context";
import type { CompanionProactiveSignal } from "./companion-proactive-context";
import type {
  CompanionAnalyticsCompleteness,
  CompanionAnalyticsConfidence,
  CompanionAnalyticsFreshness,
  CompanionAnalyticsMetric,
  CompanionAnalyticsTrend,
  CompanionCrossModuleAnalyticsView,
} from "./companion-analytics-context";

const FRESH_MS = 60 * 60 * 1000;
const STALE_MS = 24 * 60 * 60 * 1000;

const FRESHNESS_WEIGHT: Record<CompanionAnalyticsFreshness, number> = {
  fresh: 3,
  stale: 1,
  unknown: 0,
};

const CONFIDENCE_WEIGHT: Record<NonNullable<CompanionAnalyticsConfidence>, number> = {
  high: 3,
  moderate: 2,
  low: 1,
};

const COMPLETENESS_WEIGHT: Record<CompanionAnalyticsCompleteness, number> = {
  complete: 3,
  partial: 2,
  unknown: 0,
};

const SENSITIVE_METRIC_PATTERN =
  /salary|compensation|ssn|national_id|bank|password|secret|token|credential|private_key/i;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function resolveFreshness(generatedAt: string | null): CompanionAnalyticsFreshness {
  if (!generatedAt) return "unknown";
  const parsed = Date.parse(generatedAt);
  if (!Number.isFinite(parsed)) return "unknown";
  const age = Date.now() - parsed;
  if (age <= FRESH_MS) return "fresh";
  if (age <= STALE_MS) return "stale";
  return "stale";
}

function humanizeMetricKey(key: string): string {
  return key.replace(/_/g, " ");
}

function inferTrend(change: number | null): CompanionAnalyticsTrend {
  if (change === null) return "unknown";
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "flat";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function buildMetric(input: {
  metricId: string;
  label: string;
  value: string | number | null;
  unit: string;
  period?: string;
  comparisonPeriod?: string | null;
  change?: string | number | null;
  trend?: CompanionAnalyticsTrend;
  sourceModule: string;
  sourceReference: string;
  generatedAt?: string | null;
  completeness?: CompanionAnalyticsCompleteness;
  confidence?: CompanionAnalyticsConfidence;
  warnings?: string[];
  requiredPermission?: string | null;
}): CompanionAnalyticsMetric | null {
  if (input.value === null || input.value === undefined) return null;
  if (typeof input.value === "string" && input.value.trim() === "") return null;
  if (SENSITIVE_METRIC_PATTERN.test(input.metricId)) return null;

  const generatedAt = input.generatedAt ?? null;
  return {
    metric_id: input.metricId,
    metric_label: input.label,
    value: input.value,
    unit: input.unit,
    period: input.period ?? "current",
    comparison_period: input.comparisonPeriod ?? null,
    change: input.change ?? null,
    trend: input.trend ?? inferTrend(typeof input.change === "number" ? input.change : null),
    source_module: input.sourceModule,
    source_reference: input.sourceReference,
    generated_at: generatedAt,
    freshness: resolveFreshness(generatedAt),
    completeness: input.completeness ?? "complete",
    confidence: input.confidence ?? "moderate",
    warnings: input.warnings ?? [],
    required_permission: input.requiredPermission ?? null,
    inference: false,
  };
}

function extractNumericFields(
  record: Record<string, unknown>,
  sourceModule: string,
  sourceReference: string,
  period: string,
  unit: string,
  requiredPermission: string | null,
  prefix: string,
): CompanionAnalyticsMetric[] {
  const metrics: CompanionAnalyticsMetric[] = [];
  for (const [key, raw] of Object.entries(record)) {
    const value = num(raw);
    if (value === null) continue;
    const metric = buildMetric({
      metricId: `${sourceModule}:${prefix}${key}`,
      label: humanizeMetricKey(key),
      value,
      unit,
      period,
      sourceModule,
      sourceReference: `${sourceReference}.${key}`,
      requiredPermission,
    });
    if (metric) metrics.push(metric);
  }
  return metrics;
}

export function extractCompanionAnalyticsContextMetrics(
  raw: unknown,
  requiredPermission: string | null = "analytics.view",
): CompanionAnalyticsMetric[] {
  if (!isRecord(raw) || raw.found === false) return [];
  const metrics: CompanionAnalyticsMetric[] = [];
  const fields = [
    "organization_health",
    "open_tasks",
    "overdue_tasks",
    "active_employees",
    "business_packs_active",
  ] as const;

  for (const field of fields) {
    const metric = buildMetric({
      metricId: `companion_analytics_context:${field}`,
      label: humanizeMetricKey(field),
      value: num(raw[field]),
      unit: field === "organization_health" ? "score" : "count",
      period: "current",
      sourceModule: "companion_analytics_context",
      sourceReference: field,
      requiredPermission,
    });
    if (metric) metrics.push(metric);
  }

  return metrics;
}

export function extractAnalyticsCenterMetrics(
  raw: unknown,
  requiredPermission: string | null = "analytics.view",
): CompanionAnalyticsMetric[] {
  if (!isRecord(raw) || raw.found === false) return [];
  const executive = raw.executive_dashboard;
  if (!isRecord(executive)) return [];

  return extractNumericFields(
    executive,
    "analytics_center",
    "executive_dashboard",
    "current",
    "count",
    requiredPermission,
    "",
  ).map((metric) => {
    if (metric.metric_id.includes("organization_health")) {
      return { ...metric, unit: "score" };
    }
    if (metric.metric_id.includes("completion_rate")) {
      return { ...metric, unit: "percent" };
    }
    return metric;
  });
}

export function extractExecutiveInsightsCenterMetrics(
  raw: unknown,
  requiredPermission: string | null = "analytics.view",
): CompanionAnalyticsMetric[] {
  if (!isRecord(raw) || raw.found === false) return [];
  const metrics: CompanionAnalyticsMetric[] = [];

  const health = buildMetric({
    metricId: "executive_insights_center:organization_health",
    label: "organization health",
    value: num(raw.organization_health),
    unit: "score",
    period: "current",
    sourceModule: "executive_insights_center",
    sourceReference: "organization_health",
    requiredPermission,
  });
  if (health) metrics.push(health);

  const insights = Array.isArray(raw.insights) ? raw.insights : [];
  for (const entry of insights) {
    if (!isRecord(entry)) continue;
    const id = str(entry.id) || str(entry.title);
    const delta = num(entry.metric_delta);
    if (delta === null) continue;
    const metric = buildMetric({
      metricId: `executive_insights_center:insight:${id}`,
      label: str(entry.title) || "insight metric delta",
      value: delta,
      unit: "delta",
      period: "current",
      sourceModule: "executive_insights_center",
      sourceReference: `insight.${id}.metric_delta`,
      generatedAt: str(entry.created_at) || null,
      completeness: "partial",
      confidence: "moderate",
      requiredPermission,
    });
    if (metric) metrics.push(metric);
  }

  return metrics;
}

export function extractExecutiveLayerDashboardMetrics(
  raw: unknown,
  requiredPermission: string | null = "advanced_insights.view",
): CompanionAnalyticsMetric[] {
  if (!isRecord(raw) || raw.found === false) return [];
  const metrics: CompanionAnalyticsMetric[] = [];

  for (const field of ["risk_count", "opportunity_count"] as const) {
    const metric = buildMetric({
      metricId: `companion_executive_layer:${field}`,
      label: humanizeMetricKey(field),
      value: num(raw[field]),
      unit: "count",
      period: "current",
      sourceModule: "companion_executive_layer",
      sourceReference: field,
      requiredPermission,
    });
    if (metric) metrics.push(metric);
  }

  for (const field of [
    "executive_health_score",
    "organizational_health_score",
    "executive_readiness_score",
  ] as const) {
    const metric = buildMetric({
      metricId: `companion_executive_layer:${field}`,
      label: humanizeMetricKey(field),
      value: num(raw[field]),
      unit: "score",
      period: "current",
      sourceModule: "companion_executive_layer",
      sourceReference: field,
      requiredPermission,
    });
    if (metric) metrics.push(metric);
  }

  const priorities = Array.isArray(raw.priorities) ? raw.priorities.length : null;
  if (priorities !== null) {
    const metric = buildMetric({
      metricId: "companion_executive_layer:open_priorities",
      label: "open priorities",
      value: priorities,
      unit: "count",
      period: "current",
      sourceModule: "companion_executive_layer",
      sourceReference: "priorities",
      requiredPermission,
    });
    if (metric) metrics.push(metric);
  }

  return metrics;
}

export function extractCommandBriefAnalyticsMetrics(
  operationalContext: CompanionOperationalContext,
  requiredPermission: string | null = "executive.view",
): CompanionAnalyticsMetric[] {
  const metrics: CompanionAnalyticsMetric[] = [];
  const attentionCount = operationalContext.attention_items.length;
  const changeCount = operationalContext.important_changes.length;

  const attentionMetric = buildMetric({
    metricId: "command_brief_analytics:attention_items",
    label: "attention items",
    value: attentionCount,
    unit: "count",
    period: "current",
    sourceModule: "command_brief_analytics",
    sourceReference: "attention_items",
    requiredPermission,
    completeness: attentionCount > 0 ? "complete" : "partial",
  });
  if (attentionMetric) metrics.push(attentionMetric);

  const changeMetric = buildMetric({
    metricId: "command_brief_analytics:important_changes",
    label: "important changes",
    value: changeCount,
    unit: "count",
    period: "current",
    sourceModule: "command_brief_analytics",
    sourceReference: "important_changes",
    requiredPermission,
    completeness: changeCount > 0 ? "complete" : "partial",
  });
  if (changeMetric) metrics.push(changeMetric);

  return metrics;
}

export function extractProactiveSignalAsRecommendedAction(
  signal: CompanionProactiveSignal,
): CompanionAnalyticsMetric | null {
  if (!signal.recommended_action) return null;
  return buildMetric({
    metricId: `proactive_signal_action:${signal.signal_id}`,
    label: signal.title,
    value: signal.recommended_action,
    unit: "action",
    period: "current",
    sourceModule: signal.source_module,
    sourceReference: signal.source_reference,
    generatedAt: signal.detected_at,
    completeness: "partial",
    confidence: signal.confidence,
    requiredPermission: signal.required_permission,
    warnings: ["recommended_action_from_proactive_signal"],
  });
}

export function arePeriodsComparable(periodA: string, periodB: string): boolean {
  if (periodA === periodB) return true;
  const normalized = new Set([periodA, periodB]);
  return normalized.has("current") && (normalized.has("snapshot") || normalized.size === 1);
}

export function areUnitsCompatible(unitA: string, unitB: string): boolean {
  return unitA === unitB;
}

export function dedupeAnalyticsMetrics(
  metrics: readonly CompanionAnalyticsMetric[],
): CompanionAnalyticsMetric[] {
  const seen = new Map<string, CompanionAnalyticsMetric>();
  for (const metric of metrics) {
    const existing = seen.get(metric.metric_id);
    if (!existing) {
      seen.set(metric.metric_id, metric);
      continue;
    }
    const existingScore =
      FRESHNESS_WEIGHT[existing.freshness] + CONFIDENCE_WEIGHT[existing.confidence ?? "low"];
    const nextScore =
      FRESHNESS_WEIGHT[metric.freshness] + CONFIDENCE_WEIGHT[metric.confidence ?? "low"];
    if (nextScore >= existingScore) {
      seen.set(metric.metric_id, metric);
    }
  }
  return [...seen.values()];
}

export function filterAnalyticsMetricsForPermission(
  metrics: readonly CompanionAnalyticsMetric[],
  effectivePermissions: readonly string[],
): CompanionAnalyticsMetric[] {
  return metrics.filter((metric) => {
    if (!metric.required_permission) return true;
    return effectivePermissions.includes(metric.required_permission);
  });
}

export function filterSensitiveAnalyticsMetrics(
  metrics: readonly CompanionAnalyticsMetric[],
): CompanionAnalyticsMetric[] {
  return metrics.filter(
    (metric) =>
      !SENSITIVE_METRIC_PATTERN.test(metric.metric_id) &&
      !SENSITIVE_METRIC_PATTERN.test(metric.metric_label),
  );
}

export function prioritizeAnalyticsMetrics(
  metrics: readonly CompanionAnalyticsMetric[],
): CompanionAnalyticsMetric[] {
  return [...metrics].sort((a, b) => {
    const scoreA =
      FRESHNESS_WEIGHT[a.freshness] +
      CONFIDENCE_WEIGHT[a.confidence ?? "low"] +
      COMPLETENESS_WEIGHT[a.completeness];
    const scoreB =
      FRESHNESS_WEIGHT[b.freshness] +
      CONFIDENCE_WEIGHT[b.confidence ?? "low"] +
      COMPLETENESS_WEIGHT[b.completeness];
    return scoreB - scoreA;
  });
}

export function buildCrossModuleAnalyticsViews(
  metrics: readonly CompanionAnalyticsMetric[],
  effectivePermissions: readonly string[],
): CompanionCrossModuleAnalyticsView[] {
  const permitted = filterAnalyticsMetricsForPermission(metrics, effectivePermissions);
  const views: CompanionCrossModuleAnalyticsView[] = [];
  const grouped = new Map<string, CompanionAnalyticsMetric[]>();

  for (const metric of permitted) {
    if (metric.inference) continue;
    const key = `${metric.period}::${metric.unit}`;
    const bucket = grouped.get(key) ?? [];
    bucket.push(metric);
    grouped.set(key, bucket);
  }

  for (const [key, bucket] of grouped.entries()) {
    const sourceModules = [...new Set(bucket.map((metric) => metric.source_module))];
    if (sourceModules.length < 2) continue;

    const [period, unit] = key.split("::");
    if (!period || !unit) continue;

    const compatible = bucket.every((metric) =>
      bucket.every(
        (other) =>
          arePeriodsComparable(metric.period, other.period) &&
          areUnitsCompatible(metric.unit, other.unit),
      ),
    );
    if (!compatible) continue;

    views.push({
      view_id: `cross_module:${period}:${unit}:${sourceModules.sort().join("+")}`,
      period,
      unit,
      metric_ids: bucket.map((metric) => metric.metric_id),
      source_modules: sourceModules,
      fact_summary: bucket
        .map((metric) => `${metric.metric_label}=${metric.value} (${metric.source_module})`)
        .join(" · "),
      inference: false,
    });
  }

  return views;
}

export function validateUnsupportedCorrelationAttempt(
  query: string,
  metrics: readonly CompanionAnalyticsMetric[],
): boolean {
  const normalized = query.trim().toLowerCase();
  const asksCorrelation =
    /\b(correlat|caus|because|due to|led to|driven by|why did|root cause)\b/i.test(normalized);
  if (!asksCorrelation) return false;
  const crossModuleCount = new Set(metrics.map((metric) => metric.source_module)).size;
  return crossModuleCount > 1 && metrics.length >= 2;
}
