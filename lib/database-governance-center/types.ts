export type MigrationRegistryEntry = {
  migration_key: string;
  migration_id: string;
  migration_name: string;
  environment: string;
  author: string;
  reviewer: string | null;
  status: string;
  risk_level: string;
  rollback_notes: string | null;
  recovery_notes: string | null;
  validation_guidance: string | null;
  created_at: string | null;
  applied_at: string | null;
};

export type ValidationFinding = {
  finding_key: string;
  finding_type: string;
  object_name: string;
  message: string;
  severity: string;
};

export type DriftEvent = {
  drift_key: string;
  environment: string;
  message: string;
  severity: string;
  status: string;
};

export type GovernanceInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type GovernanceRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type EnvironmentComparison = {
  comparison_key: string;
  environment_a: string;
  environment_b: string;
  migration_parity: string;
  schema_consistency: string;
  version_alignment: string;
  summary: string;
};

export type GovernanceReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  scheduled_for: string | null;
  completed_at: string | null;
};

export type DatabaseGovernanceCenter = {
  dashboard: {
    pending_migrations: number;
    failed_migrations: number;
    applied_migrations: number;
    last_successful_migration: string | null;
    open_validation_findings: number;
    open_drift_events: number;
    environment_consistency_score: number;
    database_health_score: number;
    database_health_band: string;
    migration_success_rate: number;
    deployment_confidence: number;
  } | null;
  migrations: MigrationRegistryEntry[];
  validation_findings: ValidationFinding[];
  drift_events: DriftEvent[];
  insights: GovernanceInsight[];
  recommendations: GovernanceRecommendation[];
  environment_comparisons: EnvironmentComparison[];
  governance_reviews: GovernanceReview[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
