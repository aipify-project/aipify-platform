import type {
  BoardReport,
  StrategicBriefing,
  StrategicForecast,
  StrategicInsight,
  StrategicIntelligenceCenter,
  StrategicOpportunity,
  StrategicRecommendation,
  StrategicTrend,
} from "./types";

function parseBriefing(row: Record<string, unknown>): StrategicBriefing {
  return {
    id: String(row.id ?? ""),
    briefing_type: String(row.briefing_type ?? "daily"),
    title: String(row.title ?? ""),
    executive_summary: row.executive_summary ? String(row.executive_summary) : undefined,
    what_changed: row.what_changed ? String(row.what_changed) : undefined,
    requires_attention: row.requires_attention ? String(row.requires_attention) : undefined,
    recommended_focus: row.recommended_focus ? String(row.recommended_focus) : undefined,
    generated_at: row.generated_at ? String(row.generated_at) : undefined,
  };
}

function parseList<T>(value: unknown, parser: (row: Record<string, unknown>) => T): T[] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => parser(row as Record<string, unknown>));
}

export function parseStrategicIntelligenceCenter(row: Record<string, unknown>): StrategicIntelligenceCenter {
  const execBriefing = row.executive_briefing as Record<string, unknown> | undefined;
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    organization_health: row.organization_health as Record<string, unknown> | undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    executive_briefing: execBriefing && execBriefing.id ? parseBriefing(execBriefing) : undefined,
    briefings: parseList(row.briefings, parseBriefing),
    insights: parseList(row.insights, (r) => ({
      id: String(r.id ?? ""),
      insight_number: r.insight_number ? String(r.insight_number) : undefined,
      title: String(r.title ?? ""),
      summary: r.summary ? String(r.summary) : undefined,
      insight_type: String(r.insight_type ?? "insight"),
      source_domain: String(r.source_domain ?? "organization-wide"),
      severity: String(r.severity ?? "informational"),
    })) as StrategicInsight[],
    recommendations: parseList(row.recommendations, (r) => ({
      id: String(r.id ?? ""),
      recommendation_number: r.recommendation_number ? String(r.recommendation_number) : undefined,
      title: String(r.title ?? ""),
      description: r.description ? String(r.description) : undefined,
      category: String(r.category ?? "operational"),
      status: String(r.status ?? "open"),
      confidence: String(r.confidence ?? "moderate"),
    })) as StrategicRecommendation[],
    forecasts: parseList(row.forecasts, (r) => ({
      id: String(r.id ?? ""),
      forecast_number: r.forecast_number ? String(r.forecast_number) : undefined,
      title: String(r.title ?? ""),
      forecast_type: String(r.forecast_type ?? "revenue"),
      period_label: String(r.period_label ?? "next_quarter"),
      forecast_direction: String(r.forecast_direction ?? "stable"),
      summary: r.summary ? String(r.summary) : undefined,
    })) as StrategicForecast[],
    trends: parseList(row.trends, (r) => ({
      id: String(r.id ?? ""),
      trend_key: String(r.trend_key ?? ""),
      title: String(r.title ?? ""),
      trend_direction: String(r.trend_direction ?? "stable"),
      category: String(r.category ?? "operational"),
      summary: r.summary ? String(r.summary) : undefined,
    })) as StrategicTrend[],
    opportunities: parseList(row.opportunities, (r) => ({
      id: String(r.id ?? ""),
      opportunity_number: r.opportunity_number ? String(r.opportunity_number) : undefined,
      title: String(r.title ?? ""),
      description: r.description ? String(r.description) : undefined,
      opportunity_type: String(r.opportunity_type ?? "upsell"),
      status: String(r.status ?? "identified"),
    })) as StrategicOpportunity[],
    risk_intelligence: row.risk_intelligence as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    board_reports: parseList(row.board_reports, (r) => ({
      id: String(r.id ?? ""),
      report_number: r.report_number ? String(r.report_number) : undefined,
      title: String(r.title ?? ""),
      report_type: String(r.report_type ?? "board_summary"),
      status: String(r.status ?? "draft"),
      exportable: r.exportable === true,
    })) as BoardReport[],
    reports: row.reports as Record<string, unknown> | undefined,
    companion_advisory: row.companion_advisory as Record<string, unknown> | undefined,
    companion_insights: row.companion_insights as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return { action: String(e.action ?? ""), summary: String(e.summary ?? ""), created_at: e.created_at ? String(e.created_at) : undefined };
        })
      : undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}
