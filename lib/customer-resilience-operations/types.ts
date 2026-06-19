export type ResilienceTab =
  | "overview"
  | "incidents"
  | "continuity"
  | "recovery"
  | "crisis"
  | "dependencies"
  | "preparedness"
  | "reports";

export type ResilienceIncident = {
  incident_key: string;
  incident_title: string;
  incident_type?: string;
  severity?: string;
  incident_status?: string;
  owner_name?: string;
  impact_summary?: string;
  affected_areas?: unknown[];
  lessons_learned?: string;
  summary?: string;
};

export type ResilienceCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  incidents?: ResilienceIncident[];
  continuity?: Record<string, unknown>[];
  business_continuity?: Record<string, unknown>[];
  recovery?: Record<string, unknown>[];
  crisis_management?: Record<string, unknown>;
  dependencies?: Record<string, unknown>[];
  preparedness?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  resilience_scores?: Record<string, unknown>[];
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type ResilienceLabels = {
  title: string;
  subtitle: string;
  incidentsTitle: string;
  emergencyTitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<ResilienceTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  resilienceLabels: Record<string, string>;
  severityLevels: Record<string, string>;
};
