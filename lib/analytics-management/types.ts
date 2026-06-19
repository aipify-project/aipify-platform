export type AnalyticsInsight = {
  id: string;
  insight_type: string;
  severity: string;
  title: string;
  summary: string;
  recommendation: string;
  department_id?: string | null;
  metric_delta?: number | null;
  status: string;
  created_at: string;
};

export type AnalyticsCenter = {
  found: boolean;
  principle?: string;
  coaching_note?: string;
  visibility?: { scope?: string; role?: string; coaching_mode?: boolean };
  executive_dashboard?: Record<string, unknown>;
  operations?: {
    tasks?: Record<string, unknown>;
    workflows?: Record<string, unknown>;
    calendar?: Record<string, unknown>;
  };
  departments?: Record<string, unknown>[];
  employees?: Record<string, unknown>[];
  domains?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  assets?: Record<string, unknown>;
  communication?: Record<string, unknown>;
  knowledge?: Record<string, unknown>;
  financial?: Record<string, unknown>;
  productivity?: Record<string, unknown>;
  reports?: Record<string, unknown>[];
  scheduled_reports?: Record<string, unknown>[];
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: Record<string, string>;
};

export type ExecutiveInsightsCenter = {
  found: boolean;
  reason?: string;
  principle?: string;
  coaching_note?: string;
  organization_health?: number;
  visibility?: { scope?: string; role?: string };
  insights?: AnalyticsInsight[];
  briefings?: Record<string, { title?: string; summary?: string }>;
  companion_examples?: string[];
  routes?: Record<string, string>;
};
