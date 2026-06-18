export type TrustReliabilityMetric = {
  id?: string;
  metric_key?: string;
  metric_title?: string;
  metric_type?: string;
  status?: string;
  score?: number;
  summary?: string;
  [key: string]: unknown;
};

export type TrustTransparencyItem = {
  id?: string;
  item_key?: string;
  item_title?: string;
  item_type?: string;
  status?: string;
  visibility?: string;
  summary?: string;
  [key: string]: unknown;
};

export type TrustSignal = {
  id?: string;
  signal_key?: string;
  signal_title?: string;
  signal_type?: string;
  status?: string;
  value_text?: string;
  summary?: string;
  [key: string]: unknown;
};

export type TrustReputationRecord = {
  id?: string;
  record_key?: string;
  record_title?: string;
  record_type?: string;
  sentiment?: string;
  score?: number;
  summary?: string;
  [key: string]: unknown;
};

export type TrustServiceQuality = {
  id?: string;
  quality_key?: string;
  quality_title?: string;
  quality_domain?: string;
  score?: number;
  trend?: string;
  summary?: string;
  [key: string]: unknown;
};

export type TrustIncident = {
  id?: string;
  incident_key?: string;
  incident_title?: string;
  severity?: string;
  status?: string;
  root_cause?: string;
  resolution_summary?: string;
  lessons_learned?: string;
  summary?: string;
  [key: string]: unknown;
};

export type TrustMilestone = {
  id?: string;
  milestone_key?: string;
  milestone_title?: string;
  milestone_type?: string;
  status?: string;
  summary?: string;
  [key: string]: unknown;
};

export type TrustIntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type TrustAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type EnterpriseTrustConfidenceCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  trust_engine_route?: string;
  trust_reputation_route?: string;
  license_route?: string;
  security_settings_route?: string;
  platform_excellence_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  core_languages?: string[];
  reliability_metrics?: TrustReliabilityMetric[];
  transparency_items?: TrustTransparencyItem[];
  trust_signals?: TrustSignal[];
  reputation_records?: TrustReputationRecord[];
  service_quality?: TrustServiceQuality[];
  incidents?: TrustIncident[];
  trust_milestones?: TrustMilestone[];
  intelligence_signals?: TrustIntelligenceSignal[];
  advisor_signals?: TrustAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  executive_dashboard?: Record<string, unknown>;
  governance?: Record<string, unknown>;
  [key: string]: unknown;
};
