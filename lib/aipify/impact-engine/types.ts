export type ImpactDimensionInfo = {
  key?: string;
  label?: string;
  bullets?: string[] | unknown[];
  [key: string]: unknown;
};

export type ImpactReportingExample = {
  key?: string;
  label?: string;
  example?: string;
  [key: string]: unknown;
};

export type ImpactCelebrationExample = {
  context?: string;
  bell_text?: string;
  [key: string]: unknown;
};

export type ImpactSignal = {
  id?: string;
  dimension?: string;
  signal_type?: string;
  summary?: string;
  trend_pct?: number | null;
  confidence?: string;
  measurement_notes?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ImpactReport = {
  id?: string;
  report_period?: string;
  summary?: string;
  highlights?: unknown[] | Record<string, unknown>[];
  limitations?: unknown[];
  assumptions?: unknown[];
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ImpactEngineSettings = {
  organization_id?: string;
  enabled?: boolean;
  reporting_cadence?: string;
  celebrate_progress?: boolean;
  include_wellbeing_metrics?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type ImpactEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  signal_count?: number;
  published_reports?: number;
  positive_trends?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type ImpactEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  impact_dimensions?: ImpactDimensionInfo[];
  reporting_examples?: ImpactReportingExample[];
  celebration_examples?: ImpactCelebrationExample[];
  self_love_note?: string;
  trust_note?: string;
  settings?: ImpactEngineSettings;
  recent_signals?: ImpactSignal[];
  latest_report?: ImpactReport | null;
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ImpactEngineExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  impact_dimensions?: ImpactDimensionInfo[];
  reporting_examples?: ImpactReportingExample[];
  trust_note?: string;
  self_love_note?: string;
  settings?: ImpactEngineSettings;
  recent_signals?: ImpactSignal[];
  latest_report?: ImpactReport | null;
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
