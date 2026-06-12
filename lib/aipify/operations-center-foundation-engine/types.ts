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
  practices?: string[];
  journey_phrase?: string;
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  operators_should_know?: string[];
  organizations_should_understand?: string[];
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type OrganizationalConnection = {
  key?: string;
  label?: string;
  route?: string;
  feeds?: string;
};

export type CrossFunctionalObservation = {
  emoji?: string;
  key?: string;
  observation?: string;
  description?: string;
};

export type CollaborationExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type EngagementSummary = {
  module_overview_blocks?: number;
  open_operations_events?: number;
  urgent_operations_events?: number;
  support_open_cases?: number;
  knowledge_open_gaps?: number;
  tasks_overdue?: number;
  connection_chain_length?: number;
  cross_functional_observations?: number;
  collaboration_examples?: number;
  pending_leadership_approvals?: number;
  recognition_signals?: number;
  executive_overview_signals?: number;
  executive_dashboard_dimensions?: number;
  daily_briefing_elements?: number;
  companion_guidance_examples?: number;
  privacy_note?: string;
};

export type BriefingElement = {
  emoji?: string;
  key?: string;
  element?: string;
  description?: string;
};

export type HealthIndicator = {
  emoji?: string;
  key?: string;
  indicator?: string;
  description?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type BlueprintSection = {
  principle?: string;
  [key: string]: unknown;
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
  implementation_blueprint_phase70?: ImplementationBlueprint;
  operations_center_foundation_engine_note?: string;
  module_overviews?: ModuleOverviews;
  since_last_time?: SinceLastTimeSummary;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  engagement_summary?: EngagementSummary;
  blueprint_note?: string;
  cross_functional_note?: string;
  implementation_blueprint_phase75?: ImplementationBlueprint;
  eocbp_mission?: string;
  eocbp_abos_principle?: string;
  eocbp_engagement_summary?: EngagementSummary;
  eocbp_note?: string;
  executive_leadership_note?: string;
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
  implementation_blueprint_phase70?: ImplementationBlueprint;
  cross_functional_intelligence_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_objectives?: BlueprintObjective[];
  organizational_connections?: BlueprintSection & { example_chain?: OrganizationalConnection[]; chain_summary?: string };
  cross_functional_observations?: BlueprintSection & { observations?: CrossFunctionalObservation[] };
  information_flow_visibility?: BlueprintSection & { dimensions?: BlueprintObjective[] };
  bottleneck_identification?: BlueprintSection & { patterns?: BlueprintObjective[] };
  collaboration_opportunities?: BlueprintSection & { examples?: CollaborationExample[] };
  blueprint_leadership_insights?: BlueprintSection & { insight_types?: BlueprintObjective[] };
  blueprint_self_love_connection?: SelfLoveConnection & { practices?: string[]; journey_phrase?: string };
  blueprint_trust_connection?: TrustConnection;
  privacy_principles?: BlueprintSection & { rules?: string[] };
  blueprint_dogfooding?: Record<string, unknown>;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: EngagementSummary;
  blueprint_success_criteria?: AbosSuccessCriterion[];
  blueprint_vision_phrases?: string[];
  blueprint_privacy_note?: string;
  implementation_blueprint_phase75?: ImplementationBlueprint;
  executive_operations_center_note?: string;
  eocbp_distinction_note?: string;
  eocbp_mission?: string;
  eocbp_philosophy?: string;
  eocbp_abos_principle?: string;
  eocbp_objectives?: BlueprintObjective[];
  eocbp_executive_dashboard?: BlueprintSection & { dimensions?: BlueprintObjective[]; clarity_objective?: string };
  eocbp_daily_executive_briefings?: BlueprintSection & { briefing_elements?: BriefingElement[] };
  eocbp_executive_priority_center?: BlueprintSection & { focus_areas?: BlueprintObjective[] };
  eocbp_organizational_health_overview?: BlueprintSection & { indicators?: HealthIndicator[] };
  eocbp_meeting_decision_continuity?: BlueprintSection & { continuity_elements?: BlueprintObjective[] };
  eocbp_strategic_momentum_tracking?: BlueprintSection & { tracking_elements?: BlueprintObjective[] };
  eocbp_companion_guidance?: BlueprintSection & { examples?: CompanionGuidanceExample[] };
  eocbp_self_love_connection?: SelfLoveConnection & { isolation_note?: string };
  eocbp_trust_connection?: TrustConnection;
  eocbp_dogfooding?: Record<string, unknown>;
  eocbp_integration_links?: IntegrationLink[];
  eocbp_engagement_summary?: EngagementSummary;
  eocbp_success_criteria?: AbosSuccessCriterion[];
  eocbp_vision_phrases?: string[];
  eocbp_privacy_note?: string;
  [key: string]: unknown;
};
