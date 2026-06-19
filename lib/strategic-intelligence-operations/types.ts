export type StrategicIntelligenceTab =
  | "overview"
  | "executive_briefing"
  | "insights"
  | "recommendations"
  | "forecasts"
  | "trends"
  | "opportunities"
  | "risks"
  | "reports"
  | "executive_dashboard";

export type StrategicInsight = {
  id: string;
  insight_number?: string;
  title: string;
  summary?: string;
  insight_type: string;
  source_domain: string;
  severity: string;
};

export type StrategicRecommendation = {
  id: string;
  recommendation_number?: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  confidence: string;
};

export type StrategicForecast = {
  id: string;
  forecast_number?: string;
  title: string;
  forecast_type: string;
  period_label: string;
  forecast_direction: string;
  summary?: string;
};

export type StrategicTrend = {
  id: string;
  trend_key: string;
  title: string;
  trend_direction: string;
  category: string;
  summary?: string;
};

export type StrategicOpportunity = {
  id: string;
  opportunity_number?: string;
  title: string;
  description?: string;
  opportunity_type: string;
  status: string;
};

export type StrategicBriefing = {
  id: string;
  briefing_type: string;
  title: string;
  executive_summary?: string;
  what_changed?: string;
  requires_attention?: string;
  recommended_focus?: string;
  generated_at?: string;
};

export type BoardReport = {
  id: string;
  report_number?: string;
  title: string;
  report_type: string;
  status: string;
  exportable: boolean;
};

export type StrategicIntelligenceCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  organization_health?: Record<string, unknown>;
  overview?: Record<string, string | number | undefined>;
  executive_briefing?: StrategicBriefing;
  briefings?: StrategicBriefing[];
  insights?: StrategicInsight[];
  recommendations?: StrategicRecommendation[];
  forecasts?: StrategicForecast[];
  trends?: StrategicTrend[];
  opportunities?: StrategicOpportunity[];
  risk_intelligence?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  board_reports?: BoardReport[];
  reports?: Record<string, unknown>;
  companion_advisory?: Record<string, unknown>;
  companion_insights?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at?: string }[];
  routes?: Record<string, string>;
  error?: string;
};
