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
  [key: string]: unknown;
};
