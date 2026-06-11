/**
 * Deployment & Environment Management Engine helpers (Phase A.20).
 * Authoritative enforcement lives in Supabase RPCs (_dem_*).
 * Integrates with Update Engine (Phase 18) — updates only change Aipify software.
 */

import { UPDATE_CORE_PRINCIPLE, UPDATE_ROLLOUT_ORDER } from "@/lib/update/engine";

export const ENVIRONMENT_KEYS = [
  "local",
  "development",
  "staging",
  "pilot",
  "production",
  "enterprise",
] as const;

export const ENVIRONMENT_STATUSES = ["active", "maintenance", "deprecated", "archived"] as const;

export const RELEASE_OUTCOMES = [
  "scheduled",
  "in_progress",
  "completed",
  "failed",
  "rolled_back",
] as const;

export const ROLLOUT_STRATEGIES = [
  "internal_only",
  "pilot_only",
  "tenant_specific",
  "percentage",
  "global",
] as const;

/** Pilot deployment flow per spec. */
export const PILOT_DEPLOYMENT_FLOW = [
  "development",
  "staging",
  "internal",
  "pilot",
  "production",
] as const;

export const PILOT_DEPLOYMENT_FLOW_LABEL =
  "Development → Staging → Aipify Internal → Unonight Pilot → General Availability";

export type EnvironmentKey = (typeof ENVIRONMENT_KEYS)[number];
export type EnvironmentStatus = (typeof ENVIRONMENT_STATUSES)[number];
export type ReleaseOutcome = (typeof RELEASE_OUTCOMES)[number];
export type RolloutStrategy = (typeof ROLLOUT_STRATEGIES)[number];

type DeploymentRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isRollbackReady(release?: {
  rollback_available?: boolean;
  outcome?: string;
}): boolean {
  return Boolean(release?.rollback_available && release?.outcome === "completed");
}

export function canManageDeployments(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canExecuteRollback(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canManageFeatureFlags(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export async function scheduleDeployment(
  supabase: DeploymentRpcClient,
  params: {
    environment_key: string;
    release_version: string;
    release_notes?: string | null;
    scheduled_at?: string | null;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("schedule_deployment", {
    p_environment_key: params.environment_key,
    p_release_version: params.release_version,
    p_release_notes: params.release_notes ?? null,
    p_scheduled_at: params.scheduled_at ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function deployRelease(
  supabase: DeploymentRpcClient,
  releaseId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("deploy_release", {
    p_release_id: releaseId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function rollbackRelease(
  supabase: DeploymentRpcClient,
  releaseId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("rollback_release", {
    p_release_id: releaseId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function toggleFeatureFlag(
  supabase: DeploymentRpcClient,
  params: {
    feature_key: string;
    enabled: boolean;
    environment?: string;
    rollout_percentage?: number | null;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("toggle_feature_flag", {
    p_feature_key: params.feature_key,
    p_enabled: params.enabled,
    p_environment: params.environment ?? "production",
    p_rollout_percentage: params.rollout_percentage ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getDeploymentStatus(
  supabase: DeploymentRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_deployment_status");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createDeploymentAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}

/** Maps Update Engine channels to deployment environment keys. */
export function mapUpdateChannelToEnvironment(channel: string): EnvironmentKey {
  switch (channel) {
    case "internal":
      return "development";
    case "pilot":
      return "pilot";
    case "enterprise":
      return "enterprise";
    default:
      return "production";
  }
}

export const UPDATE_ENGINE_INTEGRATION = {
  core_principle: UPDATE_CORE_PRINCIPLE,
  rollout_order: UPDATE_ROLLOUT_ORDER,
  platform_updates_table: "platform_updates",
} as const;

/** Enterprise readiness hooks — scaffold only. */
export const ENTERPRISE_DEPLOYMENT_HOOKS = {
  dedicated: false,
  hybrid: false,
  on_prem: false,
} as const;
