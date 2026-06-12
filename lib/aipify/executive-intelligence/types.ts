export type BlueprintObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type BriefingEntry = {
  id: string;
  briefing_key?: string;
  briefing_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  relevance_note?: string | null;
  actionability_note?: string | null;
};

export type MemoryEntry = {
  id: string;
  memory_key?: string;
  memory_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  occurred_at?: string | null;
};

export type PriorityItem = {
  id: string;
  priority_key?: string;
  track_type?: string;
  title?: string;
  summary?: string;
  owner_label?: string | null;
  progress_pct?: number | null;
  alignment_signal?: string | null;
  status?: string;
};

export type RiskSignal = {
  id: string;
  signal_key?: string;
  signal_category?: string;
  signal_type?: string;
  title?: string;
  summary?: string;
  severity?: string;
  confidence?: string;
  status?: string;
};

export type HealthSnapshot = {
  id: string;
  indicator_key?: string;
  indicator_type?: string;
  summary?: string;
  signal_strength?: string;
  trend_pct?: number | null;
  value_numeric?: number | null;
  confidence?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_never?: Record<string, unknown>[];
  required?: string[];
  boundary_note?: string;
};

export type CompanionAdaptationExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type ExecutiveIntelligenceBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  intelligence_center?: Record<string, unknown>[];
  dashboard_sections?: Record<string, unknown>[];
  briefing_types?: Record<string, unknown>[];
  decision_support?: Record<string, unknown>[];
  companion_supports?: Record<string, unknown>[];
  companion_limitations?: Record<string, unknown>[];
  communication_support_types?: Record<string, unknown>[];
  self_love_leadership?: Record<string, unknown>[];
  cross_links?: IntegrationLink[];
  limitation_principles?: LimitationPrinciples;
  companion_adaptation?: { examples?: CompanionAdaptationExample[]; principle?: string };
  success_metrics?: Record<string, unknown>[];
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  engagement_summary?: ExecutiveIntelligenceEngagementSummary;
  privacy_note?: string;
};

export type ExecutiveIntelligenceEngagementSummary = {
  intelligence_score?: number;
  briefings_ready?: number;
  memory_entries_active?: number;
  priorities_active?: number;
  risks_active?: number;
  opportunities_active?: number;
  health_indicators?: number;
  objectives_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type ExecutiveIntelligenceCard = {
  has_customer: boolean;
  intelligence_score?: number;
  briefings_ready?: number;
  priorities_active?: number;
  risks_active?: number;
  philosophy?: string;
  human_decision_required?: boolean;
  companion_enabled?: boolean;
  overload_aware_mode?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  executive_intelligence_mission?: string;
  executive_intelligence_abos_principle?: string;
  executive_intelligence_engagement_summary?: ExecutiveIntelligenceEngagementSummary;
  executive_intelligence_note?: string;
  executive_intelligence_vision_note?: string;
};

export type ExecutiveIntelligenceDashboard = {
  has_customer: boolean;
  intelligence_center_enabled?: boolean;
  companion_enabled?: boolean;
  daily_briefing_enabled?: boolean;
  weekly_review_enabled?: boolean;
  overload_aware_mode?: boolean;
  human_decision_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  intelligence_score?: number;
  briefings_ready?: number;
  memory_entries_active?: number;
  priorities_active?: number;
  risks_active?: number;
  opportunities_active?: number;
  health_indicators?: number;
  avg_priority_progress?: number;
  dashboard_sections: Record<string, unknown>[];
  briefings: BriefingEntry[];
  memory_entries: MemoryEntry[];
  priority_items: PriorityItem[];
  risk_signals: RiskSignal[];
  opportunity_signals: RiskSignal[];
  health_snapshots: HealthSnapshot[];
  decision_support_meta: Record<string, unknown>[];
  companion_supports: Record<string, unknown>[];
  companion_limitations: Record<string, unknown>[];
  communication_support_types: Record<string, unknown>[];
  self_love_leadership: Record<string, unknown>[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ExecutiveIntelligenceBlueprint;
  executive_intelligence_blueprint?: ExecutiveIntelligenceBlueprint;
  executive_intelligence_mission?: string;
  executive_intelligence_philosophy?: string;
  executive_intelligence_abos_principle?: string;
  executive_intelligence_objectives?: BlueprintObjective[];
  executive_intelligence_intelligence_center?: Record<string, unknown>[];
  executive_intelligence_limitation_principles?: LimitationPrinciples;
  executive_intelligence_companion_adaptation?: ExecutiveIntelligenceBlueprint["companion_adaptation"];
  executive_intelligence_engagement_summary?: ExecutiveIntelligenceEngagementSummary;
  executive_intelligence_success_criteria?: AbosSuccessCriterion[];
  executive_intelligence_success_metrics?: Record<string, unknown>[];
  exibp121_cross_links?: IntegrationLink[];
  executive_intelligence_vision?: string;
  executive_intelligence_privacy_note?: string;
  executive_intelligence_engine_note?: string;
};
