import type { AppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

export function resolveNotificationOrganizationKey(
  context: AppOrganizationContext,
): string | null {
  return context.organization_id ?? context.customer_id ?? context.company_id ?? null;
}

/** Stable primitive for preference/feed effects — never use whole context objects as deps. */
export function resolveStableNotificationRequestKey(
  context: AppOrganizationContext | null,
  userId: string | null,
): string | null {
  if (!context) return null;
  const organizationId = context.organization_id ?? "";
  const customerId = context.customer_id ?? "";
  const uid = userId ?? "";
  if (!organizationId && !customerId && !uid) return null;
  return `${organizationId}:${customerId}:${uid}`;
}

export function isNotificationOrganizationReady(
  context: AppOrganizationContext | null,
): boolean {
  return (
    context?.state === "ready" &&
    context.has_app_access === true &&
    context.has_customer === true
  );
}

/** Org+customer scope without user suffix — avoids reset when auth user id resolves later. */
export function organizationTenantScopeKey(stableKey: string | null): string | null {
  if (!stableKey) return null;
  const [organizationId = "", customerId = ""] = stableKey.split(":");
  if (!organizationId && !customerId) return null;
  return `${organizationId}:${customerId}`;
}
