/**
 * Aipify Install Engine helpers (Phase A.22).
 * Authoritative enforcement lives in Supabase RPCs (_ain_*).
 * Extends Install Engine (Phase 17) — lib/install/, /api/install/, /app/install.
 */

import { INSTALL_WORKFLOW_STEPS } from "@/lib/install/engine";

export const INSTALL_STEPS = [
  "welcome",
  "platform_detection",
  "domain_verification",
  "system_connection",
  "environment_discovery",
  "permission_review",
  "skill_recommendations",
  "activation_complete",
] as const;

export const INSTALLATION_STATUSES = [
  "pending",
  "in_progress",
  "completed",
  "failed",
  "cancelled",
] as const;

export type InstallStep = (typeof INSTALL_STEPS)[number];
export type InstallationStatus = (typeof INSTALLATION_STATUSES)[number];

type InstallRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isInstallComplete(
  completionPercentage?: number,
  status?: string
): boolean {
  return status === "completed" || (completionPercentage ?? 0) >= 100;
}

export function canManageInstall(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export async function startInstallation(
  supabase: InstallRpcClient,
  params?: { system_type?: string; domain?: string }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("start_installation", {
    p_system_type: params?.system_type ?? null,
    p_domain: params?.domain ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function advanceInstallStep(
  supabase: InstallRpcClient,
  step?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("advance_install_step", {
    p_step: step ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function runInstallDiscovery(
  supabase: InstallRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("run_install_discovery");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function approveInstallPermissions(
  supabase: InstallRpcClient,
  permissionKeys?: string[]
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("approve_install_permissions", {
    p_permission_keys: permissionKeys ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function acceptInstallRecommendations(
  supabase: InstallRpcClient,
  recommendationIds?: string[]
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("accept_install_recommendations", {
    p_recommendation_ids: recommendationIds ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function completeInstallation(
  supabase: InstallRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("complete_installation");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createInstallAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}

export const INSTALL_ENGINE_INTEGRATION = {
  workflow_steps: INSTALL_WORKFLOW_STEPS.map((s) => s.id),
  api_routes: ["/api/install/*", "/api/embed/*"],
  customer_route: "/app/install",
  learning_phase_days: 30,
} as const;
