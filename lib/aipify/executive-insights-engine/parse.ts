import type {
  ExecutiveInsightsEngineCard,
  ExecutiveInsightsEngineDashboard,
  ExecutiveInsightItem,
  ExecutiveRecommendedAction,
  ExecutiveReportExport,
  ExecutiveReportSchedule,
  ExecutiveReportSummary,
} from "./types";

function asRecordList(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
}

export function parseExecutiveInsightsEngineCard(data: unknown): ExecutiveInsightsEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    health_score: typeof d.health_score === "number" ? d.health_score : Number(d.health_score ?? 0),
    health_status: typeof d.health_status === "string" ? d.health_status : undefined,
    risk_count: Number(d.risk_count ?? 0),
    action_count: Number(d.action_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseExecutiveInsightsEngineDashboard(
  data: unknown
): ExecutiveInsightsEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary:
      typeof d.summary === "object" && d.summary
        ? (d.summary as ExecutiveInsightsEngineDashboard["summary"])
        : undefined,
    organization_health:
      typeof d.organization_health === "object" && d.organization_health
        ? (d.organization_health as ExecutiveInsightsEngineDashboard["organization_health"])
        : undefined,
    major_achievements: asRecordList(d.major_achievements) as ExecutiveInsightItem[],
    operational_risks: asRecordList(d.operational_risks) as ExecutiveInsightItem[],
    strategic_opportunities: asRecordList(d.strategic_opportunities) as ExecutiveInsightItem[],
    customer_trends: asRecordList(d.customer_trends),
    ai_recommendations: asRecordList(d.ai_recommendations) as ExecutiveRecommendedAction[],
    recommended_actions: asRecordList(d.recommended_actions) as ExecutiveRecommendedAction[],
    recent_reports: asRecordList(d.recent_reports) as ExecutiveReportSummary[],
    schedules: asRecordList(d.schedules) as ExecutiveReportSchedule[],
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as Record<string, unknown>)
        : undefined,
    source_modules: asRecordList(d.source_modules),
  };
}

export function parseExecutiveReport(data: unknown): Record<string, unknown> {
  return (data ?? {}) as Record<string, unknown>;
}

export function parseExecutiveReportExport(data: unknown): ExecutiveReportExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    export_format: typeof d.export_format === "string" ? d.export_format : undefined,
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    report:
      typeof d.report === "object" && d.report ? (d.report as Record<string, unknown>) : undefined,
  };
}
