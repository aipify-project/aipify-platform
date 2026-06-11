import type {
  AnalyticsInsightsEngineCard,
  AnalyticsInsightsEngineDashboard,
  AnalyticsInsight,
  AnalyticsMetric,
  AnalyticsReport,
} from "./types";

export function parseAnalyticsInsightsEngineCard(data: unknown): AnalyticsInsightsEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    health_score: Number(d.health_score ?? 0),
    health_status: typeof d.health_status === "string" ? d.health_status : undefined,
    active_insights: Number(d.active_insights ?? 0),
    metrics_tracked: Number(d.metrics_tracked ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseAnalyticsInsightsEngineDashboard(
  data: unknown
): AnalyticsInsightsEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    user_role: typeof d.user_role === "string" ? d.user_role : undefined,
    visible_categories: Array.isArray(d.visible_categories)
      ? (d.visible_categories as string[])
      : undefined,
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as Record<string, unknown>)
        : undefined,
    last_refresh:
      typeof d.last_refresh === "object" && d.last_refresh
        ? (d.last_refresh as Record<string, unknown>)
        : undefined,
    organization_health:
      typeof d.organization_health === "object" && d.organization_health
        ? (d.organization_health as AnalyticsInsightsEngineDashboard["organization_health"])
        : undefined,
    kpi_overview:
      typeof d.kpi_overview === "object" && d.kpi_overview
        ? (d.kpi_overview as AnalyticsInsightsEngineDashboard["kpi_overview"])
        : undefined,
    trends: Array.isArray(d.trends) ? (d.trends as AnalyticsMetric[]) : [],
    insights: Array.isArray(d.insights) ? (d.insights as AnalyticsInsight[]) : [],
    reports: Array.isArray(d.reports) ? (d.reports as AnalyticsReport[]) : [],
    improvement_opportunities: Array.isArray(d.improvement_opportunities)
      ? (d.improvement_opportunities as AnalyticsInsightsEngineDashboard["improvement_opportunities"])
      : [],
  };
}
