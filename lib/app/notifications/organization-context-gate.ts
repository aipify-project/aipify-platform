import type { AppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

export function resolveNotificationOrganizationKey(
  context: AppOrganizationContext,
): string | null {
  return context.organization_id ?? context.customer_id ?? context.company_id ?? null;
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
