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
  phase?: number;
  relationship?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type HealthSnapshot = {
  id: string;
  indicator_key?: string;
  indicator_type?: string;
  summary?: string;
  signal_strength?: string;
  trend_pct?: number | null;
  value_numeric?: number | null;
  captured_at?: string;
};

export type KnowledgeFlowSignal = {
  id: string;
  signal_key?: string;
  signal_type?: string;
  summary?: string;
  confidence?: string;
  captured_at?: string;
};

export type ResilienceIndicator = {
  id: string;
  indicator_key?: string;
  monitor_type?: string;
  summary?: string;
  signal?: string;
  value_numeric?: number | null;
  captured_at?: string;
};

export type OpportunitySignal = {
  id: string;
  signal_key?: string;
  opportunity_type?: string;
  summary?: string;
  priority?: string;
  status?: string;
  captured_at?: string;
};

export type MemoryEntry = {
  id: string;
  entry_key?: string;
  memory_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  captured_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  required?: string[];
  boundary_note?: string;
};

export type CompanionAdaptationExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type EcosystemOrchestrationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  orchestration_center?: Record<string, unknown>;
  collective_evolution_engine?: Record<string, unknown>;
  ecosystem_health_model?: Record<string, unknown>;
  knowledge_flow_engine?: Record<string, unknown>;
  resilience_engine?: Record<string, unknown>;
  strategic_opportunity_engine?: Record<string, unknown>;
  companion_responsibilities?: Record<string, unknown>;
  stewardship_council?: Record<string, unknown>;
  self_love_in_ecosystem?: Record<string, unknown>;
  ecosystem_memory_engine?: Record<string, unknown>;
  era_ecosystem_cross_links?: IntegrationLink[];
  extended_cross_links?: IntegrationLink[];
  cross_links?: IntegrationLink[];
  limitation_principles?: LimitationPrinciples;
  companion_adaptation?: { examples?: CompanionAdaptationExample[]; principle?: string; boundary_note?: string };
  success_metrics?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  engagement_summary?: EcosystemOrchestrationEngagementSummary;
  privacy_note?: string;
};

export type EcosystemOrchestrationEngagementSummary = {
  orchestration_score?: number;
  health_indicators_count?: number;
  knowledge_flow_signals_count?: number;
  resilience_indicators_count?: number;
  opportunity_signals_count?: number;
  memory_entries_count?: number;
  orchestration_capabilities_count?: number;
  evolution_areas_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type EcosystemOrchestrationCard = {
  has_customer: boolean;
  orchestration_score?: number;
  health_indicators_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  ecosystem_orchestration_mission?: string;
  ecosystem_orchestration_abos_principle?: string;
  ecosystem_orchestration_engagement_summary?: EcosystemOrchestrationEngagementSummary;
  ecosystem_orchestration_note?: string;
  ecosystem_orchestration_vision_note?: string;
};

export type EcosystemOrchestrationDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  enabled?: boolean;
  collective_evolution_enabled?: boolean;
  orchestration_visibility?: string;
  philosophy?: string;
  safety_note?: string;
  orchestration_score?: number;
  health_indicators_count?: number;
  knowledge_flow_signals_count?: number;
  resilience_indicators_count?: number;
  opportunity_signals_count?: number;
  memory_entries_count?: number;
  avg_health_value?: number;
  health_snapshots: HealthSnapshot[];
  knowledge_flow_signals: KnowledgeFlowSignal[];
  resilience_indicators: ResilienceIndicator[];
  opportunity_signals: OpportunitySignal[];
  memory_entries: MemoryEntry[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  ecosystem_orchestration_engine_note?: string;
  ecosystem_orchestration_blueprint?: EcosystemOrchestrationBlueprint;
  ecosystem_orchestration_distinction_note?: string;
  ecosystem_orchestration_mission?: string;
  ecosystem_orchestration_philosophy?: string;
  ecosystem_orchestration_abos_principle?: string;
  ecosystem_orchestration_objectives?: BlueprintObjective[];
  orchestration_center_meta?: Record<string, unknown>;
  collective_evolution_meta?: Record<string, unknown>;
  ecosystem_health_model_meta?: Record<string, unknown>;
  knowledge_flow_meta?: Record<string, unknown>;
  resilience_engine_meta?: Record<string, unknown>;
  strategic_opportunity_meta?: Record<string, unknown>;
  companion_responsibilities_meta?: Record<string, unknown>;
  stewardship_council_meta?: Record<string, unknown>;
  self_love_in_ecosystem_meta?: Record<string, unknown>;
  ecosystem_memory_meta?: Record<string, unknown>;
  eocbp120_era_ecosystem_cross_links?: IntegrationLink[];
  eocbp120_extended_cross_links?: IntegrationLink[];
  ecosystem_orchestration_limitation_principles?: LimitationPrinciples;
  ecosystem_orchestration_companion_adaptation?: EcosystemOrchestrationBlueprint["companion_adaptation"];
  eocbp120_integration_links?: IntegrationLink[];
  ecosystem_orchestration_engagement_summary?: EcosystemOrchestrationEngagementSummary;
  ecosystem_orchestration_success_criteria?: AbosSuccessCriterion[];
  ecosystem_orchestration_success_metrics?: Record<string, unknown>;
  ecosystem_orchestration_vision?: string;
  ecosystem_orchestration_privacy_note?: string;
};
