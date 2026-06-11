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
  "full_site",
  "images",
  "performance",
  "seo",
  "localization",
  "frontend_journey",
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
  "image_guardian",
  "performance_guardian",
  "frontend_experience",
  "seo_monitor",
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
  incident_type?: string;
  page_url?: string;
  affected_asset_url?: string;
  recommendation_type?: string;
};

export type QualityAsset = {
  id: string;
  url: string;
  page_url: string | null;
  file_format: string | null;
  size_bytes: number | null;
  has_alt_text: boolean | null;
  is_lazy_loaded: boolean | null;
  has_width_height: boolean | null;
  recommendation: string | null;
  status_code: number | null;
  rendered_width: number | null;
  rendered_height: number | null;
  created_at: string;
};

export type QualityPageSnapshot = {
  id: string;
  page_url: string;
  viewport: string;
  load_time_ms: number | null;
  total_page_weight_bytes: number | null;
  request_count: number | null;
  image_weight_bytes: number | null;
  script_weight_bytes: number | null;
  layout_issue_count: number;
  created_at: string;
};

export type QualityDashboard = {
  has_customer: boolean;
  has_access?: boolean;
  upgrade_required?: boolean;
  plan?: string;
  observation_mode?: boolean;
  auto_fix_enabled?: boolean;
  health_score?: number;
  widgets?: {
    open_incidents: number;
    critical_incidents: number;
    image_issues: number;
    performance_issues: number;
    mobile_issues: number;
    broken_links: number;
    missing_translations: number;
    failed_workflows: number;
    integration_issues: number;
    knowledge_gaps: number;
    recommended_actions: number;
    oversized_images: number;
  };
  last_scan?: Record<string, unknown> | null;
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
  image_scanning_enabled?: boolean;
  performance_scanning_enabled?: boolean;
  mobile_scanning_enabled?: boolean;
  seo_scanning_enabled?: boolean;
  localization_scanning_enabled?: boolean;
  scan_frequency?: string;
  max_pages_per_scan?: number;
  max_image_size_warning_kb?: number;
  max_image_size_high_kb?: number;
  max_page_weight_warning_mb?: number;
  max_page_weight_high_mb?: number;
  notify_on_high?: boolean;
  notify_on_critical?: boolean;
  auto_create_developer_reports?: boolean;
  target_urls?: unknown[];
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
