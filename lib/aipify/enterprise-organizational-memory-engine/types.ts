export type KnowledgeSource = {
  id?: string;
  source_key?: string;
  source_name?: string;
  source_type?: string;
  source_status?: string;
  [key: string]: unknown;
};

export type KnowledgeAsset = {
  id?: string;
  asset_key?: string;
  asset_title?: string;
  asset_type?: string;
  asset_status?: string;
  department?: string;
  owner_name?: string;
  freshness_score?: number;
  validation_status?: string;
  [key: string]: unknown;
};

export type DecisionMemory = {
  id?: string;
  decision_key?: string;
  decision_title?: string;
  decision_owner?: string;
  decision_status?: string;
  reasoning?: string;
  outcome_summary?: string;
  review_at?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type OperationalMemory = {
  id?: string;
  record_key?: string;
  record_title?: string;
  record_type?: string;
  record_status?: string;
  department?: string;
  outcome_summary?: string;
  [key: string]: unknown;
};

export type LessonLearned = {
  id?: string;
  lesson_key?: string;
  lesson_title?: string;
  lesson_type?: string;
  lesson_summary?: string;
  department?: string;
  [key: string]: unknown;
};

export type RetentionItem = {
  id?: string;
  retention_key?: string;
  retention_title?: string;
  gap_type?: string;
  gap_status?: string;
  priority?: string;
  summary?: string;
  [key: string]: unknown;
};

export type MemoryAdvisorSignal = {
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

export type OrganizationalMemoryCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  knowledge_center_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  knowledge_sources?: KnowledgeSource[];
  knowledge_assets?: KnowledgeAsset[];
  decisions?: DecisionMemory[];
  operational_memory?: OperationalMemory[];
  lessons_learned?: LessonLearned[];
  retention_items?: RetentionItem[];
  advisor_signals?: MemoryAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
