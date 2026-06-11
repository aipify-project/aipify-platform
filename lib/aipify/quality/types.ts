export const QUALITY_SEVERITIES = ["info", "low", "medium", "high", "critical"] as const;
export type QualitySeverity = (typeof QUALITY_SEVERITIES)[number];

export const QUALITY_INCIDENT_STATUSES = [
  "open",
  "investigating",
  "resolved",
  "false_positive",
] as const;
export type QualityIncidentStatus = (typeof QUALITY_INCIDENT_STATUSES)[number];

export const QUALITY_SCAN_TYPES = [
  "full",
  "links",
  "workflows",
  "integrations",
  "translations",
  "mobile",
  "journeys",
  "summary",
] as const;
export type QualityScanType = (typeof QUALITY_SCAN_TYPES)[number];

export const QUALITY_SCANNER_TYPES = [
  "link_monitor",
  "journey_monitor",
  "integration_monitor",
  "performance_monitor",
  "translation_monitor",
  "mobile_monitor",
  "workflow_validator",
] as const;
export type QualityScannerType = (typeof QUALITY_SCANNER_TYPES)[number];

export type QualityScanResult = {
  check_key?: string;
  check_id?: string;
  incident_key: string;
  title: string;
  passed: boolean;
  severity?: QualitySeverity;
  scanner_type: QualityScannerType;
  category: string;
  expected_behavior: string;
  observed_behavior?: string;
  impact?: string;
  evidence?: Record<string, unknown>;
  suggested_fix?: string;
  missing_documentation?: string;
  language?: string;
};

export type QualityDashboard = {
  has_customer: boolean;
  has_access?: boolean;
  upgrade_required?: boolean;
  plan?: string;
  observation_mode?: boolean;
  auto_fix_enabled?: boolean;
  widgets?: {
    open_incidents: number;
    critical_incidents: number;
    broken_links: number;
    failed_workflows: number;
    integration_issues: number;
    knowledge_gaps: number;
    recommended_actions: number;
  };
  recent_incidents?: QualityIncident[];
  recent_scans?: QualityScanRun[];
  recommended_actions?: QualityRecommendation[];
  privacy_note?: string;
};

export type QualityIncident = {
  id: string;
  incident_key: string;
  title: string;
  severity: QualitySeverity;
  status: QualityIncidentStatus;
  category: string | null;
  scanner_type: string | null;
  expected_behavior: string;
  observed_behavior: string;
  impact: string;
  evidence: Record<string, unknown>;
  suggested_fix: string;
  priority: string;
  knowledge_gap_id: string | null;
  created_at: string;
  resolved_at: string | null;
};

export type QualityReport = {
  id: string;
  incident_id: string | null;
  title: string;
  report_body: string;
  status: string;
  created_at: string;
};

export type QualityScanRun = {
  id: string;
  scan_type: string;
  status: string;
  summary: string | null;
  checks_passed: number;
  checks_failed: number;
  incidents_created: number;
  completed_at: string | null;
  created_at?: string;
};

export type QualityRecommendation = {
  id: string;
  recommendation_text: string;
  priority: string;
  requires_approval: boolean;
  incident_id: string | null;
};

export type QualitySettings = {
  observation_mode: boolean;
  auto_fix_enabled: boolean;
  notify_developers: boolean;
  create_admin_tasks: boolean;
  open_knowledge_gaps: boolean;
  scan_interval_hours: number;
  enabled_scanners: string[];
};

export type QualityCheckDefinition = {
  check_key: string;
  scanner_type: QualityScannerType;
  category: string;
  title: string;
  description?: string;
  expected_behavior: string;
  target_url?: string;
  workflow_key?: string;
  integration_key?: string;
  locale_codes?: string[];
  metadata?: Record<string, unknown>;
};
