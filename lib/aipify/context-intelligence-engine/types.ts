export const CONTEXT_DIMENSIONS = [
  "organizational",
  "workspace",
  "user",
  "historical",
  "operational",
  "permission",
  "strategic",
  "temporal",
] as const;

export const CONTEXT_GAP_TYPES = [
  "missing_structure",
  "stale_context",
  "permission_ambiguity",
  "operational_blind_spot",
  "historical_gap",
  "strategic_misalignment",
  "temporal_conflict",
  "integration_gap",
] as const;

export const CONTEXT_GAP_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export const CONTEXT_GAP_STATUSES = ["open", "acknowledged", "resolved", "dismissed"] as const;
export const CONTEXT_PROACTIVE_LEVELS = ["minimal", "balanced", "proactive"] as const;

export type ContextDimension = (typeof CONTEXT_DIMENSIONS)[number];
export type ContextGapType = (typeof CONTEXT_GAP_TYPES)[number];
export type ContextGapSeverity = (typeof CONTEXT_GAP_SEVERITIES)[number];
export type ContextGapStatus = (typeof CONTEXT_GAP_STATUSES)[number];
export type ContextProactiveLevel = (typeof CONTEXT_PROACTIVE_LEVELS)[number];

export type ContextDimensionSummary = {
  key?: ContextDimension | string;
  label?: string;
  description?: string;
  signal_summary?: Record<string, unknown>;
};

export type OrganizationContextGap = {
  id: string;
  organization_id?: string;
  gap_type?: ContextGapType | string;
  dimension?: ContextDimension | string;
  summary?: string;
  severity?: ContextGapSeverity | string;
  status?: ContextGapStatus | string;
  detected_at?: string;
  resolved_at?: string | null;
  resolved_by?: string | null;
  resolution_note?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ContextIntelligenceSettings = {
  proactive_level?: ContextProactiveLevel | string;
  gap_detection_enabled?: boolean;
  dimension_weights?: Record<string, unknown>;
};

export type ContextIntelligenceSummary = {
  open_gaps?: number;
  dimensions_monitored?: number;
  proactive_level?: string;
  gap_detection_enabled?: boolean;
};

export type ContextIntegrationLink = {
  route?: string;
  engine?: string;
  note?: string;
  metadata_only?: boolean;
};

export type ContextIntelligenceEngineCard = {
  has_organization: boolean;
  open_gaps?: number;
  dimensions_monitored?: number;
  philosophy?: string;
};

export type ContextIntelligenceEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  self_love_note?: string;
  principles?: string[];
  settings?: ContextIntelligenceSettings;
  summary?: ContextIntelligenceSummary;
  context_dimensions: ContextDimensionSummary[];
  context_gaps: OrganizationContextGap[];
  integration_links?: Record<string, ContextIntegrationLink>;
  privacy_note?: string;
};
