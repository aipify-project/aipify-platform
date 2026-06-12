export const WORKFLOW_STATUSES = ["draft", "active", "paused", "archived"] as const;
export const WORKFLOW_TRUST_LEVELS = ["advisory", "standard", "elevated", "delegated"] as const;
export const WORKFLOW_TRIGGER_TYPES = [
  "support_case_created",
  "approval_requested",
  "incident_detected",
  "kc_article_updated",
  "customer_health_decline",
  "overdue_task",
  "manual",
] as const;
export const WORKFLOW_ACTION_TYPES = [
  "create_task",
  "send_notification",
  "generate_draft",
  "request_approval",
  "escalate",
  "update_status",
] as const;
export const WORKFLOW_EXECUTION_OUTCOMES = [
  "completed",
  "failed",
  "partial",
  "awaiting_approval",
  "cancelled",
] as const;

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type BlueprintIntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type WorkflowExampleCategory = {
  category?: string;
  label?: string;
  examples?: string[];
  route?: string;
};

export type ApprovalLevel = {
  key?: string;
  label?: string;
  trust_action_level?: number;
  description?: string;
  examples?: string[];
};

export type ApprovalPrinciples = {
  principle?: string;
  levels?: ApprovalLevel[];
  trust_action_route?: string;
  human_oversight_route?: string;
  boundary?: string;
};

export type ExplainabilityPrinciples = {
  principle?: string;
  required_elements?: BlueprintObjective[];
  audit_note?: string;
};

export type MarketplaceConnection = {
  principle?: string;
  sources?: BlueprintObjective[];
  business_packs_route?: string;
  marketplace_route?: string;
  boundary?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  connections?: string[];
  self_love_route?: string;
  boundary?: string;
};

export type DogfoodingEntry = {
  slug?: string;
  role?: string;
  focus?: string[];
};

export type WorkflowDogfooding = {
  principle?: string;
  aipify_group?: DogfoodingEntry;
  unonight?: DogfoodingEntry;
};

export type OrchestrationSummary = {
  active_workflows?: number;
  paused_workflows?: number;
  draft_workflows?: number;
  total_executions?: number;
  failed_executions?: number;
  awaiting_approval?: number;
  approval_bottlenecks?: number;
  template_count?: number;
  orchestration_health?: string;
  privacy_note?: string;
};

export type ImplementationBlueprintPhase40 = {
  phase?: number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type WorkflowOrchestrationEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_workflows?: number;
  approval_bottlenecks?: number;
  implementation_blueprint_phase40?: ImplementationBlueprintPhase40;
  autonomous_workflow_phase?: number;
  workflow_abos_principle?: string;
  workflow_orchestration_summary?: OrchestrationSummary;
  blueprint_note?: string;
  autonomous_operations_orchestration?: ImplementationBlueprintPhase86;
  implementation_blueprint_phase133?: ImplementationBlueprintPhase133;
  awobp133_mission?: string;
  awobp133_abos_principle?: string;
  awobp133_engagement_summary?: Phase133EngagementSummary;
  awobp133_note?: string;
  autonomous_workflow_orchestration_blueprint?: ImplementationBlueprintPhase133;
  [key: string]: unknown;
};

export type AutonomyLevel = {
  level?: number;
  key?: string;
  label?: string;
  approval_required?: boolean;
  description?: string;
  examples?: string[];
};

export type OperationalStep = {
  order?: number;
  action?: string;
  system?: string;
  approval?: string;
  note?: string;
};

export type OperationalExample = {
  key?: string;
  label?: string;
  category?: string;
  route?: string;
  autonomy_level?: number;
  description?: string;
  steps?: OperationalStep[];
};

export type HumanApprovalCategory = {
  key?: string;
  label?: string;
  description?: string;
  trust_action_level?: number;
  route?: string;
};

export type HumanApprovalPrinciple = {
  principle?: string;
  categories?: HumanApprovalCategory[];
  human_oversight_route?: string;
  delegated_trust_route?: string;
  boundary?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  cue?: string;
  example?: string;
};

export type CompanionGuidance = {
  principle?: string;
  examples?: CompanionGuidanceExample[];
  boundary?: string;
};

export type AuditTransparency = {
  principle?: string;
  required_fields?: BlueprintObjective[];
  audit_routes?: Record<string, string>;
  privacy_note?: string;
};

export type TrustConnection = {
  principle?: string;
  connections?: string[];
  approvals_route?: string;
  action_center_route?: string;
  actions_route?: string;
  boundary?: string;
};

export type SafetyAvoidItem = {
  key?: string;
  label?: string;
  description?: string;
};

export type SafetyPrinciples = {
  principle?: string;
  avoid?: SafetyAvoidItem[];
  safety_note?: string;
};

export type AutonomousOperationsDogfooding = {
  principle?: string;
  focus_areas?: string[];
  aipify_group?: DogfoodingEntry;
  unonight?: DogfoodingEntry;
};

export type ImplementationBlueprintPhase86 = {
  phase?: number;
  title?: string;
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
  autonomy_levels?: AutonomyLevel[];
  operational_examples?: OperationalExample[];
  human_approval_principle?: HumanApprovalPrinciple;
  companion_guidance?: CompanionGuidance;
  audit_transparency?: AuditTransparency;
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  safety_principles?: SafetyPrinciples;
  dogfooding?: AutonomousOperationsDogfooding;
  integration_links?: BlueprintIntegrationLink[];
  success_criteria?: BlueprintSuccessCriterion[];
  orchestration_summary?: OrchestrationSummary;
};

export type WorkflowTypeEntry = {
  key?: string;
  label?: string;
  route?: string;
  description?: string;
  category?: string;
};

export type BuilderElement = {
  key?: string;
  label?: string;
  description?: string;
};

export type VisualWorkflowBuilder = {
  principle?: string;
  elements?: BuilderElement[];
  scaffold_note?: string;
};

export type ApprovalGateType = {
  key?: string;
  label?: string;
  description?: string;
};

export type ApprovalFramework = {
  principle?: string;
  gate_types?: ApprovalGateType[];
  trust_action_route?: string;
  human_oversight_route?: string;
  boundary?: string;
};

export type CompanionCapability = {
  key?: string;
  label?: string;
  description?: string;
};

export type CompanionParticipation = {
  principle?: string;
  capabilities?: CompanionCapability[];
  companion_workforce_route?: string;
  boundary?: string;
};

export type ExceptionAction = {
  key?: string;
  label?: string;
  description?: string;
};

export type ExceptionManagement = {
  principle?: string;
  actions?: ExceptionAction[];
  operations_center_route?: string;
  boundary?: string;
};

export type WorkflowMetric = {
  key?: string;
  label?: string;
  description?: string;
};

export type WorkflowAnalytics = {
  principle?: string;
  metrics?: WorkflowMetric[];
  privacy_note?: string;
};

export type TemplateLibraryEntry = {
  key?: string;
  label?: string;
  category?: string;
  description?: string;
};

export type CompanionLimitation = {
  key?: string;
  label?: string;
  description?: string;
};

export type SecurityRequirement = {
  key?: string;
  label?: string;
  description?: string;
};

export type SecurityRequirements = {
  principle?: string;
  requirements?: SecurityRequirement[];
  two_factor_route?: string;
  security_route?: string;
  boundary?: string;
};

export type OrchestrationCenter = {
  principle?: string;
  capabilities?: BlueprintObjective[];
  boundary_note?: string;
};

export type Phase133EngagementSummary = OrchestrationSummary & {
  supported_workflow_types?: number;
  template_library_count?: number;
};

export type ImplementationBlueprintPhase133 = {
  phase?: number;
  title?: string;
  doc?: string;
  spec_doc?: string;
  engine_phase?: string;
  era?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  workflow_orchestration_center?: OrchestrationCenter;
  supported_workflow_types?: WorkflowTypeEntry[];
  visual_workflow_builder?: VisualWorkflowBuilder;
  workflow_triggers?: WorkflowTypeEntry[];
  approval_framework?: ApprovalFramework;
  companion_participation?: CompanionParticipation;
  exception_management?: ExceptionManagement;
  workflow_analytics?: WorkflowAnalytics;
  template_library?: TemplateLibraryEntry[];
  companion_limitations?: CompanionLimitation[];
  self_love_connection?: SelfLoveConnection;
  security_requirements?: SecurityRequirements;
  dogfooding?: AutonomousOperationsDogfooding;
  integration_links?: BlueprintIntegrationLink[];
  vision_phrases?: string[];
  privacy_note?: string;
  era_capstone_note?: string;
  success_criteria?: BlueprintSuccessCriterion[];
  engagement_summary?: Phase133EngagementSummary;
};

export type WorkflowOrchestrationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  workflows?: unknown[];
  templates?: unknown[];
  recent_executions?: unknown[];
  integration_links?: Record<string, string>;
  implementation_blueprint_phase40?: ImplementationBlueprintPhase40;
  autonomous_workflow_mission?: string;
  autonomous_workflow_philosophy?: string;
  workflow_objectives?: BlueprintObjective[];
  workflow_examples?: WorkflowExampleCategory[];
  approval_principles?: ApprovalPrinciples;
  explainability_principles?: ExplainabilityPrinciples;
  workflow_marketplace_connection?: MarketplaceConnection;
  workflow_self_love_connection?: SelfLoveConnection;
  workflow_dogfooding?: WorkflowDogfooding;
  workflow_orchestration_summary?: OrchestrationSummary;
  workflow_success_criteria?: BlueprintSuccessCriterion[];
  workflow_vision_phrases?: string[];
  workflow_abos_principle?: string;
  workflow_distinction_note?: string;
  workflow_integration_links?: BlueprintIntegrationLink[];
  autonomous_operations_orchestration?: ImplementationBlueprintPhase86;
  implementation_blueprint_phase133?: ImplementationBlueprintPhase133;
  autonomous_workflow_orchestration_engine_note?: string;
  autonomous_organization_era_note?: string;
  awobp133_distinction_note?: string;
  awobp133_mission?: string;
  awobp133_philosophy?: string;
  awobp133_abos_principle?: string;
  awobp133_vision?: string;
  awobp133_objectives?: BlueprintObjective[];
  awobp133_workflow_orchestration_center?: OrchestrationCenter;
  awobp133_supported_workflow_types?: WorkflowTypeEntry[];
  awobp133_visual_workflow_builder?: VisualWorkflowBuilder;
  awobp133_workflow_triggers?: WorkflowTypeEntry[];
  awobp133_approval_framework?: ApprovalFramework;
  awobp133_companion_participation?: CompanionParticipation;
  awobp133_exception_management?: ExceptionManagement;
  awobp133_workflow_analytics?: WorkflowAnalytics;
  awobp133_template_library?: TemplateLibraryEntry[];
  awobp133_companion_limitations?: CompanionLimitation[];
  awobp133_self_love_connection?: SelfLoveConnection;
  awobp133_security_requirements?: SecurityRequirements;
  awobp133_integration_links?: BlueprintIntegrationLink[];
  awobp133_dogfooding?: AutonomousOperationsDogfooding;
  awobp133_engagement_summary?: Phase133EngagementSummary;
  awobp133_success_criteria?: BlueprintSuccessCriterion[];
  awobp133_vision_phrases?: string[];
  awobp133_privacy_note?: string;
  autonomous_workflow_orchestration_blueprint?: ImplementationBlueprintPhase133;
  [key: string]: unknown;
};
