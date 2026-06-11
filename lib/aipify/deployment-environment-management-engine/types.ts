export type EnvironmentKey =
  | "local"
  | "development"
  | "staging"
  | "pilot"
  | "production"
  | "enterprise";

export type EnvironmentStatus = "active" | "maintenance" | "deprecated" | "archived";

export type ReleaseOutcome =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "failed"
  | "rolled_back";

export type RolloutStrategy =
  | "internal_only"
  | "pilot_only"
  | "tenant_specific"
  | "percentage"
  | "global";

export type RolloutStatus = "draft" | "active" | "paused" | "completed" | "cancelled";

export type DeploymentEnvironment = {
  id: string;
  environment_key?: EnvironmentKey | string;
  environment_name?: string;
  status?: EnvironmentStatus | string;
  deployment_version?: string;
  created_at?: string;
  updated_at?: string;
};

export type DeploymentRelease = {
  id: string;
  environment_id?: string;
  environment_key?: string;
  environment_name?: string;
  release_version: string;
  release_notes?: string | null;
  deployed_at?: string | null;
  outcome?: ReleaseOutcome | string;
  rollback_available?: boolean;
  previous_version?: string | null;
  created_at?: string;
};

export type OrganizationFeatureFlag = {
  id: string;
  feature_key: string;
  enabled: boolean;
  environment?: EnvironmentKey | string;
  rollout_percentage?: number;
  created_at?: string;
  updated_at?: string;
};

export type DeploymentRollout = {
  id: string;
  feature_key: string;
  strategy?: RolloutStrategy | string;
  target_config?: Record<string, unknown>;
  status?: RolloutStatus | string;
  created_at?: string;
};

export type DeploymentSettings = {
  pilot_sequence?: string[];
  rollback_threshold_minutes?: number;
  auto_notify_on_deploy?: boolean;
  auto_notify_on_rollback?: boolean;
  maintenance_window_required?: boolean;
  enterprise_hooks?: Record<string, unknown>;
};

export type DeploymentSummary = {
  active_environments?: number;
  rollback_ready_releases?: number;
  enabled_flags?: number;
  active_rollouts?: number;
};

export type DeploymentEnvironmentManagementEngineCard = {
  has_organization: boolean;
  active_environments?: number;
  rollback_ready?: number;
  enabled_flags?: number;
  philosophy?: string;
};

export type DeploymentEnvironmentManagementEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  settings?: DeploymentSettings;
  summary?: DeploymentSummary;
  environments: DeploymentEnvironment[];
  deployment_history: DeploymentRelease[];
  feature_flags: OrganizationFeatureFlag[];
  rollouts: DeploymentRollout[];
  pilot_flow?: string[];
  enterprise_hooks?: Record<string, unknown>;
  update_engine_integration?: Record<string, unknown>;
};
