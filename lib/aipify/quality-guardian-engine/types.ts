export type QualityCheckCategory =
  | "support_quality"
  | "knowledge_quality"
  | "ai_recommendation_quality"
  | "approval_workflow"
  | "integration_reliability"
  | "onboarding_effectiveness"
  | "operational_responsiveness";

export type QualityAlertType =
  | "outdated_knowledge"
  | "repeated_support_failures"
  | "approval_bottleneck"
  | "integration_instability"
  | "low_customer_satisfaction"
  | "excessive_escalations"
  | "unanswered_conversations"
  | "unpublished_drafts"
  | "missing_documentation"
  | "ai_rejection_spike"
  | "failed_ai_executions"
  | "onboarding_stalled"
  | "slow_response_times"
  | "duplicate_content";

export type QualitySeverity = "low" | "medium" | "high" | "critical";
export type QualityCheckStatus = "open" | "investigating" | "resolved" | "ignored";
export type RecommendationUrgency = "low" | "moderate" | "high" | "critical";
export type RecommendationConfidence = "low" | "moderate" | "high";
export type RecommendationStatus = "pending" | "accepted" | "rejected" | "dismissed";

export type QualityCheck = {
  id: string;
  check_key?: string;
  category?: QualityCheckCategory | string;
  alert_type?: QualityAlertType | string;
  severity?: QualitySeverity | string;
  title: string;
  description?: string | null;
  status?: QualityCheckStatus | string;
  signal_count?: number;
  detected_at?: string;
  metadata?: Record<string, unknown>;
};

export type QualityRecommendation = {
  id: string;
  quality_check_id?: string | null;
  issue_summary: string;
  business_impact?: string | null;
  suggested_resolution: string;
  urgency?: RecommendationUrgency | string;
  confidence?: RecommendationConfidence | string;
  status?: RecommendationStatus | string;
  created_at?: string;
};

export type QualityTrends = {
  open_checks?: number;
  resolved_last_7_days?: number;
  ignored_last_7_days?: number;
  critical_open?: number;
};

export type HighRiskArea = {
  category?: string;
  open_count?: number;
  max_severity?: string;
};

export type ResolvedCheck = {
  id: string;
  title: string;
  category?: string;
  severity?: string;
  resolved_at?: string | null;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type QualityObjective = {
  key?: string;
  label?: string;
};

export type GovernanceObjective = {
  key?: string;
  label?: string;
};

export type QgCapability = {
  key?: string;
  label?: string;
};

export type CompanionQualityPrinciple = {
  key?: string;
  emoji?: string;
  label?: string;
};

export type GovernanceSummary = {
  active_policies?: number;
  open_violations?: number;
  pending_approvals?: number;
  review_cadence_days?: number;
  ai_autonomy_level?: string;
  governance_route?: string;
  note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  patterns?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  qualities?: string[];
  metadata_only?: boolean;
  audit_note?: string;
};

export type VisionPhrase = {
  emoji?: string;
  phrase?: string;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  integrated_engine?: string;
  route?: string;
  mapping_note?: string;
};

export type DogfoodingInfo = {
  principle?: string;
  aipify_group?: Record<string, unknown>;
  unonight?: Record<string, unknown>;
};

export type QualityGuardianEngineCard = {
  has_organization: boolean;
  open_checks?: number;
  critical_checks?: number;
  pending_recommendations?: number;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  implementation_blueprint?: ImplementationBlueprint;
  quality_guardian_engine_note?: string;
};

export type QualityGuardianEngineDashboard = {
  has_organization: boolean;
  implementation_blueprint?: ImplementationBlueprint;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  quality_guardian_engine_note?: string;
  distinction_note?: string;
  quality_objectives?: QualityObjective[];
  governance_objectives?: GovernanceObjective[];
  qg_capabilities?: QgCapability[];
  companion_quality_principles?: CompanionQualityPrinciple[];
  self_love_connection?: SelfLoveConnection;
  self_love_note?: string;
  trust_connection?: TrustConnection;
  governance_summary?: GovernanceSummary;
  dogfooding?: DogfoodingInfo;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: VisionPhrase[];
  integration_links?: IntegrationLink[];
  safety_note?: string;
  principles?: string[];
  settings?: Record<string, unknown>;
  last_scan?: Record<string, unknown>;
  trends?: QualityTrends;
  high_risk_areas: HighRiskArea[];
  active_checks: QualityCheck[];
  recommendations: QualityRecommendation[];
  recently_resolved: ResolvedCheck[];
};
