/**
 * API Platform Engine helpers (Phase A.21).
 * Authoritative enforcement lives in Supabase RPCs (_api_*, _apdbp_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const API_PLATFORM_RATE_LIMIT_TIERS = ["standard", "elevated", "partner", "sandbox"] as const;
export type ApiPlatformRateLimitTier = (typeof API_PLATFORM_RATE_LIMIT_TIERS)[number];

export const API_PLATFORM_KEY_STATUSES = ["active", "revoked", "expired", "pending_approval"] as const;
export type ApiPlatformKeyStatus = (typeof API_PLATFORM_KEY_STATUSES)[number];

export const API_PLATFORM_WEBHOOK_STATUSES = ["active", "paused", "disabled", "pending_verification"] as const;
export type ApiPlatformWebhookStatus = (typeof API_PLATFORM_WEBHOOK_STATUSES)[number];

export const API_PLATFORM_PERMISSION_KEYS = [
  "api_platform.view",
  "api_platform.manage",
  "api_platform.keys",
] as const;
export type ApiPlatformPermissionKey = (typeof API_PLATFORM_PERMISSION_KEYS)[number];

export const API_PLATFORM_MODULE_KEY = "api_platform" as const;

export const API_PLATFORM_ENGINE_ROUTE = "/app/api-platform-engine" as const;
export const DEVELOPER_PORTAL_ROUTE = "/developers" as const;
export const DEVELOPER_SETTINGS_ROUTE = "/app/settings/developer" as const;

/** Elevated scopes require human approval before key activation. */
export const API_PLATFORM_ELEVATED_SCOPE_PREFIXES = ["write", "admin", "partner.", "commerce."] as const;

export async function getApiPlatformEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_api_platform_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getApiPlatformEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_api_platform_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function requiresElevatedScopeApproval(scopes: string[]): boolean {
  return scopes.some((scope) =>
    API_PLATFORM_ELEVATED_SCOPE_PREFIXES.some(
      (prefix) => scope.startsWith(prefix) || scope.includes(".write") || scope.includes(".manage")
    )
  );
}

export function createApiPlatformAuditEntry(
  action: string,
  metadata: Record<string, unknown> = {}
) {
  return { action, metadata, recorded_server_side: true as const };
}
