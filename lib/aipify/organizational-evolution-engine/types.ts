export type EvolutionLearningSignal = {
  id?: string;
  signal_key?: string;
  signal_type?: string;
  signal_title?: string;
  observation?: string;
  source_summary?: string;
  confidence?: string;
  status?: string;
  [key: string]: unknown;
};

export type EvolutionImprovementOpportunity = {
  id?: string;
  opportunity_key?: string;
  opportunity_title?: string;
  opportunity_type?: string;
  observation?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  evolution_status?: string;
  [key: string]: unknown;
};

export type EvolutionOperationalLearning = {
  id?: string;
  learning_key?: string;
  learning_title?: string;
  learning_type?: string;
  outcome_summary?: string;
  recommendation?: string;
  status?: string;
  [key: string]: unknown;
};

export type EvolutionKnowledgeItem = {
  id?: string;
  knowledge_key?: string;
  knowledge_title?: string;
  knowledge_status?: string;
  accuracy_score?: number;
  ownership?: string;
  observation?: string;
  recommendation?: string;
  [key: string]: unknown;
};

export type EvolutionWorkflowItem = {
  id?: string;
  workflow_key?: string;
  workflow_title?: string;
  workflow_status?: string;
  success_rate_percent?: number;
  observation?: string;
  recommendation?: string;
  [key: string]: unknown;
};

export type EvolutionPattern = {
  id?: string;
  pattern_key?: string;
  pattern_title?: string;
  pattern_type?: string;
  frequency?: string;
  observation?: string;
  recommendation?: string;
  [key: string]: unknown;
};

export type EvolutionApprovedImprovement = {
  id?: string;
  improvement_key?: string;
  improvement_title?: string;
  improvement_type?: string;
  evolution_status?: string;
  outcome_summary?: string;
  business_impact?: string;
  rollout_status?: string;
  [key: string]: unknown;
};

export type EvolutionIntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type EvolutionAdvisorSignal = {
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

export type OrganizationalEvolutionCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  learning_route?: string;
  approvals_route?: string;
  knowledge_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  evolution_statuses?: Array<{ key?: string; label?: string }>;
  learning_signals?: EvolutionLearningSignal[];
  improvement_opportunities?: EvolutionImprovementOpportunity[];
  operational_learnings?: EvolutionOperationalLearning[];
  knowledge_evolution?: EvolutionKnowledgeItem[];
  workflow_evolution?: EvolutionWorkflowItem[];
  patterns?: EvolutionPattern[];
  approved_improvements?: EvolutionApprovedImprovement[];
  intelligence_signals?: EvolutionIntelligenceSignal[];
  advisor_signals?: EvolutionAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  executive_dashboard?: Record<string, unknown>;
  governance?: Record<string, unknown>;
  [key: string]: unknown;
};
