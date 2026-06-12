export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ImplementationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type OperationalObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type ModuleOverviewBlock = {
  key?: string;
  label?: string;
  route?: string;
  source_modules?: string[];
  summary?: string;
  [key: string]: unknown;
};

export type ModuleOverviews = {
  support_overview?: ModuleOverviewBlock;
  task_overview?: ModuleOverviewBlock;
  knowledge_overview?: ModuleOverviewBlock;
  executive_overview?: ModuleOverviewBlock;
  recognition_overview?: ModuleOverviewBlock;
};

export type SinceLastTimeSummary = {
  since?: string;
  since_source?: string;
  assumption_note?: string;
  support_cases_resolved?: number;
  kc_articles_updated?: number;
  high_priority_tasks_completed?: number;
  bottlenecks_open?: number;
  bell_moments?: number;
  recognition_moments?: number;
  operations_events_acknowledged?: number;
  trend_summary?: string;
};

export type CompanionCommunicationExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  operations_patterns?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  operators_should_know?: string[];
  organizations_should_understand?: string[];
  audit_note?: string;
};

export type OperationsEvent = {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  source_module?: string;
  action_required?: boolean;
  created_at?: string;
  [key: string]: unknown;
};

export type OperationsCenterFoundationEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  open_events?: number;
  urgent_events?: number;
  implementation_blueprint?: ImplementationBlueprint;
  operations_center_foundation_engine_note?: string;
  module_overviews?: ModuleOverviews;
  since_last_time?: SinceLastTimeSummary;
  [key: string]: unknown;
};

export type OperationsCenterFoundationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  implementation_blueprint?: ImplementationBlueprint;
  operations_center_foundation_engine_note?: string;
  distinction_note?: string;
  operational_objectives?: OperationalObjective[];
  module_overviews?: ModuleOverviews;
  since_last_time?: SinceLastTimeSummary;
  companion_communication_examples?: CompanionCommunicationExample[];
  self_love_connection?: SelfLoveConnection;
  self_love_note?: string;
  trust_connection?: TrustConnection;
  data_sources?: Record<string, unknown>;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  safety_note?: string;
  urgent_actions?: OperationsEvent[];
  events?: OperationsEvent[];
  recent_completed?: OperationsEvent[];
  [key: string]: unknown;
};
