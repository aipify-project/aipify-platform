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

export type QualityGuardianEngineCard = {
  has_organization: boolean;
  open_checks?: number;
  critical_checks?: number;
  pending_recommendations?: number;
  philosophy?: string;
};

export type QualityGuardianEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
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
