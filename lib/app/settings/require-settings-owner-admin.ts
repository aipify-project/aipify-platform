import type { SupabaseClient } from "@supabase/supabase-js";
import { isOrganizationOwnerAdminRole } from "@/lib/tenant/organization-role";
import {
  parseAppOrganizationContext,
  type AppOrganizationContext,
} from "@/lib/tenant/resolve-app-organization-context";

export type AppSettingsOwnerAdminDenialReason =
  | "unauthenticated"
  | "organization_not_ready"
  | "unauthorized_role";

export type AppSettingsOwnerAdminAccessResult =
  | {
      ok: true;
      context: AppOrganizationContext;
      role: string;
      organizationId: string;
    }
  | {
      ok: false;
      reason: AppSettingsOwnerAdminDenialReason;
      role: string | null;
      organizationId: string | null;
    };

/**
 * Server-side owner/admin gate for `/app/settings`.
 * Organization and role come only from trusted session RPCs — never from the client.
 */
export async function requireAppSettingsOwnerAdminAccess(
  supabase: SupabaseClient
): Promise<AppSettingsOwnerAdminAccessResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      reason: "unauthenticated",
      role: null,
      organizationId: null,
    };
  }

  const { data, error } = await supabase.rpc("get_app_organization_context");
  if (error) {
    return {
      ok: false,
      reason: "organization_not_ready",
      role: null,
      organizationId: null,
    };
  }

  const context = parseAppOrganizationContext(data);
  const organizationId = context.organization_id ?? context.company_id ?? null;
  const role = context.organization_role ?? context.user_role ?? null;

  if (context.state !== "ready" || !organizationId) {
    return {
      ok: false,
      reason: "organization_not_ready",
      role,
      organizationId,
    };
  }

  if (!isOrganizationOwnerAdminRole(role)) {
    return {
      ok: false,
      reason: "unauthorized_role",
      role,
      organizationId,
    };
  }

  return {
    ok: true,
    context,
    role: role ?? "",
    organizationId,
  };
}

/** Pure helper for tests — evaluates a trusted context snapshot. */
export function evaluateAppSettingsOwnerAdminAccess(input: {
  authenticated: boolean;
  context: AppOrganizationContext | null;
}): AppSettingsOwnerAdminAccessResult {
  if (!input.authenticated) {
    return {
      ok: false,
      reason: "unauthenticated",
      role: null,
      organizationId: null,
    };
  }
  if (!input.context || input.context.state !== "ready") {
    return {
      ok: false,
      reason: "organization_not_ready",
      role: input.context?.organization_role ?? input.context?.user_role ?? null,
      organizationId: input.context?.organization_id ?? input.context?.company_id ?? null,
    };
  }
  const organizationId = input.context.organization_id ?? input.context.company_id ?? null;
  const role = input.context.organization_role ?? input.context.user_role ?? null;
  if (!organizationId) {
    return {
      ok: false,
      reason: "organization_not_ready",
      role,
      organizationId: null,
    };
  }
  if (!isOrganizationOwnerAdminRole(role)) {
    return {
      ok: false,
      reason: "unauthorized_role",
      role,
      organizationId,
    };
  }
  return {
    ok: true,
    context: input.context,
    role: role ?? "",
    organizationId,
  };
}
