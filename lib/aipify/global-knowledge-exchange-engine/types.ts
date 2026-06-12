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
  phase?: number;
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  relationship?: string;
  description?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type ExchangeProgram = {
  id: string;
  program_key?: string;
  status?: string;
  enrolled_at?: string;
};

export type KnowledgeContribution = {
  id: string;
  contribution_key?: string;
  contribution_type?: string;
  title?: string;
  summary?: string;
  industry_tag?: string | null;
  status?: string;
  anonymized?: boolean;
  submitted_at?: string;
};

export type BenchmarkSnapshot = {
  id: string;
  snapshot_key?: string;
  benchmark_domain?: string;
  aggregate_value?: number | null;
  industry_tag?: string | null;
  participant_count?: number;
  captured_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type GlobalKnowledgeExchangeEngagementSummary = {
  exchange_score?: number;
  participation_status?: string;
  enabled?: boolean;
  programs_count?: number;
  contributions_count?: number;
  approved_contributions_count?: number;
  pending_contributions_count?: number;
  benchmark_snapshots_count?: number;
  cross_links_count?: number;
  learning_networks_count?: number;
  privacy_note?: string;
  opt_in_required?: boolean;
};

export type GlobalKnowledgeExchangeBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  global_knowledge_center?: Record<string, unknown>;
  interorganizational_learning_engine?: Record<string, unknown>;
  knowledge_sharing_governance?: Record<string, unknown>;
  anonymized_benchmarking_engine?: Record<string, unknown>;
  global_learning_networks?: Record<string, unknown>;
  growth_partner_contribution_engine?: Record<string, unknown>;
  collective_wisdom_companion?: Record<string, unknown>;
  privacy_confidentiality_framework?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: GlobalKnowledgeExchangeEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type GlobalKnowledgeExchangeCard = {
  has_customer: boolean;
  exchange_score?: number;
  participation_status?: string;
  enabled?: boolean;
  programs_count?: number;
  philosophy?: string;
  approval_required?: boolean;
  executive_approval_required?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  global_knowledge_exchange_mission?: string;
  global_knowledge_exchange_abos_principle?: string;
  global_knowledge_exchange_engagement_summary?: GlobalKnowledgeExchangeEngagementSummary;
  global_knowledge_exchange_note?: string;
  global_knowledge_exchange_vision_note?: string;
};

export type GlobalKnowledgeExchangeDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  participation_status?: string;
  anonymization_level?: string;
  approval_required?: boolean;
  executive_approval_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  exchange_score?: number;
  programs_count?: number;
  contributions_count?: number;
  approved_contributions_count?: number;
  pending_contributions_count?: number;
  benchmark_snapshots_count?: number;
  programs: ExchangeProgram[];
  contributions: KnowledgeContribution[];
  benchmark_snapshots: BenchmarkSnapshot[];
  anonymized_benchmark_summary?: Record<string, unknown>;
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  global_knowledge_exchange_blueprint?: GlobalKnowledgeExchangeBlueprint;
  global_knowledge_exchange_mission?: string;
  global_knowledge_exchange_philosophy?: string;
  global_knowledge_exchange_abos_principle?: string;
  global_knowledge_exchange_objectives?: BlueprintObjective[];
  global_knowledge_center_meta?: Record<string, unknown>;
  interorganizational_learning_engine_meta?: Record<string, unknown>;
  knowledge_sharing_governance_meta?: Record<string, unknown>;
  anonymized_benchmarking_engine_meta?: Record<string, unknown>;
  global_learning_networks_meta?: Record<string, unknown>;
  growth_partner_contribution_engine_meta?: Record<string, unknown>;
  collective_wisdom_companion_meta?: Record<string, unknown>;
  privacy_confidentiality_framework_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  gkeebp141_integration_links?: IntegrationLink[];
  global_knowledge_exchange_engagement_summary?: GlobalKnowledgeExchangeEngagementSummary;
  global_knowledge_exchange_success_criteria?: AbosSuccessCriterion[];
  global_knowledge_exchange_vision?: string;
  global_knowledge_exchange_vision_phrases?: string[];
  global_knowledge_exchange_privacy_note?: string;
  global_knowledge_exchange_dogfooding?: string;
  global_knowledge_exchange_engine_note?: string;
  global_knowledge_exchange_distinction_note?: string;
};
