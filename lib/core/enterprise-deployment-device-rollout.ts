/**
 * Enterprise Deployment & Device Rollout Engine helpers (Phase A.39).
 * Authoritative enforcement lives in Supabase RPCs (_edd_*).
 */

import type { DeploymentMethod } from "@/lib/aipify/enterprise-deployment-device-rollout-engine";

type EddRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function canViewDeployment(role: string): boolean {
  return ["owner", "administrator", "manager", "viewer"].includes(role);
}

export function canManageDeployment(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canEnrollDevices(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canRevokeDeployment(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canManageLicenses(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canManageDevices(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export async function getEnterpriseDeploymentDeviceRolloutEngineDashboard(
  supabase: EddRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc(
    "get_enterprise_deployment_device_rollout_engine_dashboard"
  );
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createOrganizationLicense(
  supabase: EddRpcClient,
  params: { license_type?: string; seat_limit?: number; expires_at?: string | null }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_organization_license", {
    p_license_type: params.license_type ?? "enterprise",
    p_seat_limit: params.seat_limit ?? 25,
    p_expires_at: params.expires_at ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function activateLicenseKey(
  supabase: EddRpcClient,
  licenseKey: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("activate_license_key", {
    p_license_key: licenseKey,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createDeploymentEnrollmentToken(
  supabase: EddRpcClient,
  params: {
    token_name: string;
    allowed_domains?: string[];
    max_uses?: number;
    expires_at?: string | null;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_deployment_enrollment_token", {
    p_token_name: params.token_name,
    p_allowed_domains: params.allowed_domains ?? [],
    p_max_uses: params.max_uses ?? 1,
    p_expires_at: params.expires_at ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function registerDevice(
  supabase: EddRpcClient,
  params: {
    device_name: string;
    device_type?: string;
    os?: string | null;
    companion_version?: string | null;
    device_identifier?: string | null;
    enrollment_method?: DeploymentMethod;
    enrollment_token?: string | null;
    metadata?: Record<string, unknown>;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("register_device", {
    p_device_name: params.device_name,
    p_device_type: params.device_type ?? "desktop",
    p_os: params.os ?? null,
    p_companion_version: params.companion_version ?? null,
    p_device_identifier: params.device_identifier ?? null,
    p_enrollment_method: params.enrollment_method ?? "enrollment_token",
    p_enrollment_token: params.enrollment_token ?? null,
    p_metadata: params.metadata ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function sendDeploymentEmailInvite(
  supabase: EddRpcClient,
  email: string,
  expiresAt?: string | null
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("send_deployment_email_invite", {
    p_email: email,
    p_expires_at: expiresAt ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createEnterpriseDeploymentAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
