export type PolicyCategory =
  | "ai_autonomy"
  | "approval"
  | "support"
  | "access"
  | "knowledge_publishing"
  | "integration"
  | "retention";

export type PolicyStatus = "draft" | "active" | "archived";

export type AiAutonomyLevel =
  | "advisory_only"
  | "approval_required"
  | "limited_automation"
  | "organization_defined";

export type ViolationSeverity = "informational" | "moderate" | "high" | "critical";
export type ViolationStatus = "open" | "acknowledged" | "resolved" | "dismissed";
export type ReviewStatus = "scheduled" | "completed" | "overdue" | "cancelled";

export type OrganizationPolicy = {
  id: string;
  policy_key: string;
  policy_name: string;
  description?: string | null;
  category: PolicyCategory;
  status: PolicyStatus;
  configuration: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};

export type PolicyViolation = {
  id: string;
  policy_id: string;
  policy_name?: string;
  policy_key?: string;
  violation_type: string;
  severity: ViolationSeverity;
  description: string;
  status: ViolationStatus;
  detected_at?: string;
  acknowledged_at?: string | null;
};

export type PolicyReview = {
  id: string;
  policy_id: string;
  policy_name?: string;
  scheduled_at: string;
  owner_user_id?: string | null;
  status: ReviewStatus;
};

export type ApprovalRequirements = {
  requires_approval?: boolean;
  ai_prohibited?: boolean;
  required_approvers?: string;
  escalation_path?: string;
  autonomy_level?: AiAutonomyLevel;
  pending_approvals?: number;
};

export type GovernanceRecommendation = {
  key: string;
  title: string;
  priority?: number;
  reason?: string;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type CompanionExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type GovernancePrinciple = {
  key?: string;
  emoji?: string;
  label?: string;
};

export type BoardMeetingSupport = {
  principle?: string;
  support_types?: BlueprintObjective[];
  meeting_collaboration_route?: string;
  boundary_note?: string;
};

export type StrategicOversight = {
  principle?: string;
  oversight_areas?: BlueprintObjective[];
  balanced_oversight_note?: string;
  executive_companion_route?: string;
  org_health_route?: string;
  boundary_note?: string;
};

export type DecisionContinuity = {
  principle?: string;
  continuity_elements?: BlueprintObjective[];
  audit_route?: string;
  boundary_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  companion_patterns?: string[];
  governance_phrase?: string;
  self_love_route?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  what_informs_observations?: string[];
  assumptions?: string[];
  optional_insights?: string[];
  audit_note?: string;
};

export type DogfoodingBlueprint = {
  principle?: string;
  aipify_group?: Record<string, unknown>;
  unonight?: Record<string, unknown>;
};

export type GovernanceEngagementSummary = {
  active_policies?: number;
  open_violations?: number;
  scheduled_reviews?: number;
  overdue_reviews?: number;
  pending_approvals?: number;
  board_preparation_examples?: number;
  risk_awareness_examples?: number;
  governance_principles_documented?: number;
  privacy_note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type GovernancePolicyEngineCard = {
  has_organization: boolean;
  active_policies?: number;
  open_violations?: number;
  pending_approvals?: number;
  upcoming_reviews?: number;
  philosophy?: string;
  quality_guardian_blueprint_note?: string;
  implementation_blueprint_phase67?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: GovernanceEngagementSummary;
  blueprint_note?: string;
  governance_note?: string;
};

export type GovernancePolicyEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  settings?: {
    ai_autonomy_level?: AiAutonomyLevel;
    retention_defaults?: Record<string, number>;
    review_cadence_days?: number;
  };
  active_policies: OrganizationPolicy[];
  policy_violations: PolicyViolation[];
  upcoming_reviews: PolicyReview[];
  pending_approvals: Array<{
    id: string;
    action_key: string;
    risk_level: string;
    status: string;
    created_at?: string;
  }>;
  pending_approval_count?: number;
  approval_requirements?: {
    low?: ApprovalRequirements;
    medium?: ApprovalRequirements;
    high?: ApprovalRequirements;
  };
  governance_recommendations?: GovernanceRecommendation[];
  policy_categories?: PolicyCategory[];
  autonomy_levels?: AiAutonomyLevel[];
  integrates_with?: string[];
  implementation_blueprint_phase67?: ImplementationBlueprintMeta;
  board_governance_companion_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  vision?: string;
  blueprint_objectives?: BlueprintObjective[];
  board_preparation?: CompanionExample[];
  board_meeting_support?: BoardMeetingSupport;
  strategic_oversight?: StrategicOversight;
  risk_awareness?: CompanionExample[];
  blueprint_governance_principles?: GovernancePrinciple[];
  decision_continuity?: DecisionContinuity;
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: GovernanceEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  metadata_note?: string;
};
