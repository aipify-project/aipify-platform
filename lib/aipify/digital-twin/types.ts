export const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;

export const INSIGHT_TYPES = [
  "bottleneck",
  "ownership_gap",
  "escalation_overload",
  "knowledge_gap",
  "routing_suggestion",
  "confidence_review",
  "process_health",
] as const;

export type DigitalTwinRole = {
  id?: string;
  role_key: string;
  role_name: string;
  description?: string | null;
  responsibility_types: string[];
  escalation_authority?: boolean;
  knowledge_ownership?: boolean;
};

export type DigitalTwinProcess = {
  process_key: string;
  process_name: string;
  category: string;
  owner_role_id?: string | null;
  deadline_hours?: number | null;
};

export type DigitalTwinKnowledgeOwner = {
  topic: string;
  topic_key: string;
  role_id?: string | null;
  confidence: number;
  confidence_level: string;
  requires_review: boolean;
};

export type DigitalTwinInsight = {
  id: string;
  insight_type: string;
  summary: string;
  confidence: number;
  status?: string;
};

export type DigitalTwinOrgUnit = {
  id: string;
  name: string;
  unit_type: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type CompanionObservation = {
  emoji?: string;
  key?: string;
  signal?: string;
  prompt?: string;
  description?: string;
};

export type BlueprintSection = {
  principle?: string;
  components?: BlueprintObjective[];
  reflects?: BlueprintObjective[];
  captures?: BlueprintObjective[];
  considerations?: BlueprintObjective[];
  examples?: Array<CompanionObservation & { consideration?: string }>;
  scenarios?: BlueprintObjective[];
  must_never?: BlueprintObjective[];
  example_chain?: string[];
  flow_note?: string;
  mapping_dimensions?: BlueprintObjective[];
  observations?: CompanionObservation[];
  awareness_note?: string;
  example_scenarios?: BlueprintObjective[];
  simulation_route?: string;
  org_memory_route?: string;
  boundary_note?: string;
  evolution_sources?: Array<BlueprintObjective & { route?: string }>;
  learning_note?: string;
  practices?: string[];
  journey_phrase?: string;
  self_love_route?: string;
  insight_types?: Array<BlueprintObjective & { emoji?: string }>;
  dialogue_note?: string;
  forbidden?: string[];
  required?: string[];
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type OrganizationalConsciousnessPhase159Blueprint = {
  phase?: string;
  doc?: string;
  spec_doc?: string;
  engine_phase?: string;
  era?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  systemic_awareness_center?: BlueprintObjective[];
  interdependency_engine?: BlueprintObjective[];
  systemic_consequence_framework?: BlueprintObjective[];
  executive_systemic_reviews?: BlueprintSection;
  systemic_companion?: BlueprintObjective[];
  organizational_health_engine?: BlueprintSection;
  systemic_learning_engine?: BlueprintObjective[];
  awareness_memory_engine?: BlueprintSection;
  companion_limitations?: BlueprintObjective[];
  self_love_connection?: BlueprintSection;
  security_requirements?: BlueprintSection;
  integration_links?: IntegrationLink[];
  dogfooding?: Record<string, unknown>;
  success_metrics?: BlueprintObjective[];
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: DigitalTwinEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type OrganizationalDigitalTwinPhase124Blueprint = {
  phase?: string;
  doc?: string;
  spec_doc?: string;
  engine_phase?: string;
  era?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  organizational_digital_twin?: BlueprintSection;
  digital_twin_center?: BlueprintObjective[];
  organizational_map_engine?: BlueprintObjective[];
  dependency_intelligence?: BlueprintObjective[];
  simulation_workspace?: BlueprintSection;
  transformation_impact_model?: BlueprintObjective[];
  knowledge_network_engine?: BlueprintObjective[];
  resilience_visualization?: BlueprintObjective[];
  executive_digital_twin_companion?: BlueprintObjective[];
  companion_limitations?: BlueprintObjective[];
  self_love_connection?: BlueprintSection;
  memory_engine?: BlueprintSection;
  cross_links?: IntegrationLink[];
  limitation_principles?: BlueprintSection;
  companion_adaptation?: BlueprintSection;
  success_metrics?: BlueprintObjective[];
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: DigitalTwinEngagementSummary;
  privacy_note?: string;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type DigitalTwinEngagementSummary = {
  active_roles?: number;
  active_processes?: number;
  total_insights?: number;
  open_insights?: number;
  knowledge_owners?: number;
  metric_records?: number;
  twin_health_score?: number;
  companion_observations?: number;
  objective_count?: number;
  privacy_note?: string;
  objectives_count?: number;
  twin_center_capabilities?: number;
  map_engine_examples?: number;
  dependency_signals?: number;
  simulation_scenarios?: number;
  transformation_impacts?: number;
  knowledge_highlights?: number;
  resilience_displays?: number;
  executive_companion_supports?: number;
  cross_links_count?: number;
  success_metrics_count?: number;
  companion_limitations_count?: number;
  memory_captures?: number;
  awareness_center_capabilities?: number;
  interdependency_domains?: number;
  consequence_framework_items?: number;
  executive_review_themes?: number;
  systemic_companion_supports?: number;
  health_theme_count?: number;
  systemic_learning_links?: number;
  awareness_memory_captures?: number;
  dependency_maps?: number;
  systemic_reviews?: number;
  awareness_memory_entries?: number;
  health_snapshots?: number;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type DigitalTwinCard = {
  has_customer: boolean;
  twin_health_score?: number;
  open_insights?: number;
  philosophy?: string;
  privacy_note?: string;
  implementation_blueprint_phase77?: ImplementationBlueprintMeta;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  engagement_summary?: DigitalTwinEngagementSummary;
  blueprint_note?: string;
  understanding_note?: string;
  implementation_blueprint_phase124?: ImplementationBlueprintMeta;
  phase124_mission?: string;
  phase124_abos_principle?: string;
  phase124_engagement_summary?: DigitalTwinEngagementSummary;
  phase124_note?: string;
  implementation_blueprint_phase159?: ImplementationBlueprintMeta;
  phase159_mission?: string;
  phase159_abos_principle?: string;
  phase159_engagement_summary?: DigitalTwinEngagementSummary;
  phase159_note?: string;
};

export type DigitalTwinDashboard = {
  has_customer: boolean;
  twin_health_score?: number;
  process_coverage?: number;
  knowledge_owners?: number;
  low_confidence_count?: number;
  roles: DigitalTwinRole[];
  processes: DigitalTwinProcess[];
  knowledge_routing: DigitalTwinKnowledgeOwner[];
  insights: DigitalTwinInsight[];
  organization_units: DigitalTwinOrgUnit[];
  integrations?: Record<string, string>;
  implementation_blueprint_phase77?: ImplementationBlueprintMeta;
  organizational_digital_twin_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_objectives?: BlueprintObjective[];
  digital_twin_definition?: BlueprintSection;
  organizational_mapping?: BlueprintSection;
  companion_observations?: BlueprintSection;
  simulation_connection?: BlueprintSection;
  learning_organization_connection?: BlueprintSection;
  blueprint_self_love_connection?: BlueprintSection;
  blueprint_leadership_insights?: BlueprintSection;
  privacy_principles?: BlueprintSection;
  blueprint_trust_connection?: BlueprintSection;
  blueprint_dogfooding?: Record<string, unknown>;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: DigitalTwinEngagementSummary;
  blueprint_success_criteria?: AbosSuccessCriterion[];
  blueprint_vision_phrases?: string[];
  blueprint_privacy_note?: string;
  implementation_blueprint_phase124?: OrganizationalDigitalTwinPhase124Blueprint;
  organizational_digital_twin_phase124_note?: string;
  implementation_blueprint_phase159?: OrganizationalConsciousnessPhase159Blueprint;
  organizational_consciousness_phase159_note?: string;
};

export type KnowledgeRouteResult = {
  routed: boolean;
  topic?: string;
  role_key?: string;
  role_name?: string;
  confidence?: number;
  confidence_level?: string;
  requires_review?: boolean;
  explanation?: string;
  reason?: string;
};

export type EscalationResult = {
  resolved: boolean;
  process_key?: string;
  current_step?: number;
  role_key?: string;
  role_name?: string;
  next_role_key?: string;
  explanation?: string;
  reason?: string;
};

export type BottleneckResult = {
  bottlenecks_found: number;
  insights: DigitalTwinInsight[];
};

export type TwinHealthResult = {
  twin_health_score?: number;
  process_coverage?: number;
  role_count?: number;
  knowledge_owners?: number;
  low_confidence_count?: number;
};

export type ProcessDetail = {
  process: DigitalTwinProcess;
  steps: Array<{
    step_order: number;
    step_name: string;
    reviewer_role_id?: string | null;
    escalation_role_id?: string | null;
  }>;
  escalation_path: Array<{ path_order: number; role_key: string }>;
};
