import type { SupabaseClient } from "@supabase/supabase-js";

export type AppOrganizationContextState =
  | "ready"
  | "unauthenticated"
  | "user_not_provisioned"
  | "organization_missing"
  | "membership_missing"
  | "subscription_inactive"
  | "entitlement_missing"
  | "access_denied";

export type AppOrganizationContext = {
  authenticated: boolean;
  state: AppOrganizationContextState;
  user_role: string | null;
  organization_role: string | null;
  company_id: string | null;
  customer_id: string | null;
  organization_id: string | null;
  workspace_name: string | null;
  licensed_to: string | null;
  plan_name: string | null;
  license_status: string | null;
  has_customer: boolean;
  has_organization_membership: boolean;
  has_app_access: boolean;
  can_access_self_support: boolean;
};

const CONTEXT_STATES = new Set<AppOrganizationContextState>([
  "ready",
  "unauthenticated",
  "user_not_provisioned",
  "organization_missing",
  "membership_missing",
  "subscription_inactive",
  "entitlement_missing",
  "access_denied",
]);

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function bool(value: unknown): boolean {
  return value === true;
}

export function parseAppOrganizationContext(data: unknown): AppOrganizationContext {
  const record = (data ?? {}) as Record<string, unknown>;
  const rawState = str(record.state) ?? "access_denied";
  const state = CONTEXT_STATES.has(rawState as AppOrganizationContextState)
    ? (rawState as AppOrganizationContextState)
    : "access_denied";

  return {
    authenticated: bool(record.authenticated),
    state,
    user_role: str(record.user_role),
    organization_role: str(record.organization_role),
    company_id: str(record.company_id),
    customer_id: str(record.customer_id),
    organization_id: str(record.organization_id),
    workspace_name: str(record.workspace_name),
    licensed_to: str(record.licensed_to),
    plan_name: str(record.plan_name),
    license_status: str(record.license_status),
    has_customer: bool(record.has_customer),
    has_organization_membership: bool(record.has_organization_membership),
    has_app_access: bool(record.has_app_access),
    can_access_self_support: bool(record.can_access_self_support),
  };
}

export function classifyAppPortalError(message: string): AppOrganizationContextState {
  const lower = message.toLowerCase();
  if (lower.includes("organization context required") || lower.includes("company not found")) {
    return "organization_missing";
  }
  if (lower.includes("active subscription required")) {
    return "subscription_inactive";
  }
  if (lower.includes("access denied for organization")) {
    return "membership_missing";
  }
  if (lower.includes("permission denied") || lower.includes("permission missing")) {
    return "access_denied";
  }
  if (
    lower.includes("entitlement") ||
    lower.includes("business pack") ||
    lower.includes("module not") ||
    lower.includes("not included")
  ) {
    return "entitlement_missing";
  }
  if (lower.includes("app portal access denied") || lower.includes("unauthorized")) {
    return "access_denied";
  }
  return "access_denied";
}

export async function resolveAppOrganizationContext(
  supabase: SupabaseClient
): Promise<AppOrganizationContext> {
  const { data, error } = await supabase.rpc("get_app_organization_context");
  if (error) {
    throw new Error(error.message);
  }
  return parseAppOrganizationContext(data);
}

export async function ensureAppOrganizationContext(
  supabase: SupabaseClient
): Promise<AppOrganizationContext> {
  const context = await resolveAppOrganizationContext(supabase);
  if (context.state === "ready") {
    return context;
  }
  return context;
}
