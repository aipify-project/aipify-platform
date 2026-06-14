export type DeploymentEntry = {
  deployment_key: string;
  deployment_type: string;
  version_label: string;
  summary: string;
  pipeline_stage: string;
  status: string;
  risk_level: string;
  owner: string;
  rollback_ready: boolean;
  deployed_at: string | null;
  created_at: string | null;
};

export type ChecklistItem = {
  checklist_key: string;
  deployment_key: string | null;
  item_key: string;
  label: string;
  status: string;
  is_critical: boolean;
};

export type PostValidation = {
  validation_key: string;
  deployment_key: string | null;
  check_key: string;
  label: string;
  status: string;
};

export type RollbackPoint = {
  rollback_key: string;
  version_label: string;
  readiness_status: string;
  recovery_notes: string;
  risk_assessment: string;
};

export type DeploymentApproval = {
  approval_key: string;
  deployment_key: string;
  approval_level: number;
  approver_role: string;
  status: string;
  decided_at: string | null;
};

export type ReleaseNote = {
  note_key: string;
  deployment_key: string | null;
  audience: string;
  title: string;
  content: string;
  created_at: string | null;
};

export type DeploymentInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type DeploymentRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type DeploymentReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type DeploymentGovernanceCenter = {
  dashboard: {
    current_production_version: string;
    pending_deployments: number;
    failed_deployments: number;
    recent_releases: number;
    rollback_ready_count: number;
    deployment_health_score: number;
    deployment_health_band: string;
    deployment_success_rate: number;
    validation_completion_rate: number;
    mean_time_to_recovery_hours: number;
    operational_confidence: number;
    executive_trust_score: number;
  } | null;
  deployments: DeploymentEntry[];
  checklist_items: ChecklistItem[];
  post_validations: PostValidation[];
  rollback_points: RollbackPoint[];
  approvals: DeploymentApproval[];
  release_notes: ReleaseNote[];
  insights: DeploymentInsight[];
  recommendations: DeploymentRecommendation[];
  governance_reviews: DeploymentReview[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
