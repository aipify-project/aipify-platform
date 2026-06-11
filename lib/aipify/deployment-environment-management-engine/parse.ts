import type {
  DeploymentEnvironment,
  DeploymentEnvironmentManagementEngineCard,
  DeploymentEnvironmentManagementEngineDashboard,
  DeploymentRelease,
  DeploymentRollout,
  DeploymentSettings,
  DeploymentSummary,
  OrganizationFeatureFlag,
} from "./types";

export function parseDeploymentEnvironmentManagementEngineCard(
  data: unknown
): DeploymentEnvironmentManagementEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    active_environments: Number(d.active_environments ?? 0),
    rollback_ready: Number(d.rollback_ready ?? 0),
    enabled_flags: Number(d.enabled_flags ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

function parseEnvironment(item: unknown): DeploymentEnvironment {
  const e = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(e.id ?? ""),
    environment_key: typeof e.environment_key === "string" ? e.environment_key : undefined,
    environment_name: typeof e.environment_name === "string" ? e.environment_name : undefined,
    status: typeof e.status === "string" ? e.status : undefined,
    deployment_version: typeof e.deployment_version === "string" ? e.deployment_version : undefined,
    created_at: typeof e.created_at === "string" ? e.created_at : undefined,
    updated_at: typeof e.updated_at === "string" ? e.updated_at : undefined,
  };
}

function parseRelease(item: unknown): DeploymentRelease {
  const r = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    environment_id: typeof r.environment_id === "string" ? r.environment_id : undefined,
    environment_key: typeof r.environment_key === "string" ? r.environment_key : undefined,
    environment_name: typeof r.environment_name === "string" ? r.environment_name : undefined,
    release_version: String(r.release_version ?? ""),
    release_notes: typeof r.release_notes === "string" ? r.release_notes : null,
    deployed_at: typeof r.deployed_at === "string" ? r.deployed_at : null,
    outcome: typeof r.outcome === "string" ? r.outcome : undefined,
    rollback_available: Boolean(r.rollback_available),
    previous_version: typeof r.previous_version === "string" ? r.previous_version : null,
    created_at: typeof r.created_at === "string" ? r.created_at : undefined,
  };
}

function parseFeatureFlag(item: unknown): OrganizationFeatureFlag {
  const f = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(f.id ?? ""),
    feature_key: String(f.feature_key ?? ""),
    enabled: Boolean(f.enabled),
    environment: typeof f.environment === "string" ? f.environment : undefined,
    rollout_percentage: Number(f.rollout_percentage ?? 0),
    created_at: typeof f.created_at === "string" ? f.created_at : undefined,
    updated_at: typeof f.updated_at === "string" ? f.updated_at : undefined,
  };
}

function parseRollout(item: unknown): DeploymentRollout {
  const ro = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(ro.id ?? ""),
    feature_key: String(ro.feature_key ?? ""),
    strategy: typeof ro.strategy === "string" ? ro.strategy : undefined,
    target_config:
      typeof ro.target_config === "object" && ro.target_config
        ? (ro.target_config as Record<string, unknown>)
        : undefined,
    status: typeof ro.status === "string" ? ro.status : undefined,
    created_at: typeof ro.created_at === "string" ? ro.created_at : undefined,
  };
}

function parseSettings(data: unknown): DeploymentSettings | undefined {
  if (!data || typeof data !== "object") return undefined;
  const s = data as Record<string, unknown>;
  return {
    pilot_sequence: Array.isArray(s.pilot_sequence) ? (s.pilot_sequence as string[]) : undefined,
    rollback_threshold_minutes:
      typeof s.rollback_threshold_minutes === "number" ? s.rollback_threshold_minutes : undefined,
    auto_notify_on_deploy:
      typeof s.auto_notify_on_deploy === "boolean" ? s.auto_notify_on_deploy : undefined,
    auto_notify_on_rollback:
      typeof s.auto_notify_on_rollback === "boolean" ? s.auto_notify_on_rollback : undefined,
    maintenance_window_required:
      typeof s.maintenance_window_required === "boolean" ? s.maintenance_window_required : undefined,
    enterprise_hooks:
      typeof s.enterprise_hooks === "object" && s.enterprise_hooks
        ? (s.enterprise_hooks as Record<string, unknown>)
        : undefined,
  };
}

function parseSummary(data: unknown): DeploymentSummary | undefined {
  if (!data || typeof data !== "object") return undefined;
  const s = data as Record<string, unknown>;
  return {
    active_environments: Number(s.active_environments ?? 0),
    rollback_ready_releases: Number(s.rollback_ready_releases ?? 0),
    enabled_flags: Number(s.enabled_flags ?? 0),
    active_rollouts: Number(s.active_rollouts ?? 0),
  };
}

export function parseDeploymentEnvironmentManagementEngineDashboard(
  data: unknown
): DeploymentEnvironmentManagementEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    settings: parseSettings(d.settings),
    summary: parseSummary(d.summary),
    environments: Array.isArray(d.environments) ? d.environments.map(parseEnvironment) : [],
    deployment_history: Array.isArray(d.deployment_history)
      ? d.deployment_history.map(parseRelease)
      : [],
    feature_flags: Array.isArray(d.feature_flags) ? d.feature_flags.map(parseFeatureFlag) : [],
    rollouts: Array.isArray(d.rollouts) ? d.rollouts.map(parseRollout) : [],
    pilot_flow: Array.isArray(d.pilot_flow) ? (d.pilot_flow as string[]) : undefined,
    enterprise_hooks:
      typeof d.enterprise_hooks === "object" && d.enterprise_hooks
        ? (d.enterprise_hooks as Record<string, unknown>)
        : undefined,
    update_engine_integration:
      typeof d.update_engine_integration === "object" && d.update_engine_integration
        ? (d.update_engine_integration as Record<string, unknown>)
        : undefined,
  };
}

export function parseDeploymentStatus(data: unknown) {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    environments: Array.isArray(d.environments) ? d.environments.map(parseEnvironment) : [],
    recent_releases: Array.isArray(d.recent_releases) ? d.recent_releases.map(parseRelease) : [],
    feature_flags: Array.isArray(d.feature_flags) ? d.feature_flags.map(parseFeatureFlag) : [],
    rollouts: Array.isArray(d.rollouts) ? d.rollouts.map(parseRollout) : [],
    settings: parseSettings(d.settings),
    pilot_flow: Array.isArray(d.pilot_flow) ? (d.pilot_flow as string[]) : undefined,
    update_engine_note: typeof d.update_engine_note === "string" ? d.update_engine_note : undefined,
  };
}
