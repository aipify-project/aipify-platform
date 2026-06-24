import type { OrganizationRole } from "@/lib/core/organization";
import { isAdministrator } from "@/lib/core/permissions";
import type { OrganizationProviderScopeDefinition } from "./types";

export type OrganizationAccessActorContext = {
  role: OrganizationRole | string | null;
  effective_permissions: readonly string[];
};

export function canApproveOrganizationAccess(actor: OrganizationAccessActorContext): boolean {
  if (isAdministrator(actor.role as OrganizationRole)) return true;
  return (
    actor.effective_permissions.includes("integrations.manage") ||
    actor.effective_permissions.includes("governance.approve")
  );
}

export function canApproveRequestedScopes(
  actor: OrganizationAccessActorContext,
  scopeDefinitions: readonly OrganizationProviderScopeDefinition[],
): boolean {
  if (isAdministrator(actor.role as OrganizationRole)) return true;

  const isDelegated =
    actor.effective_permissions.includes("integrations.manage") ||
    actor.effective_permissions.includes("governance.approve");

  if (!isDelegated) return false;

  return scopeDefinitions.every((scope) =>
    actor.effective_permissions.includes(scope.permission_key),
  );
}

export function canSubmitOrganizationAccessRequest(actor: OrganizationAccessActorContext): boolean {
  return Boolean(actor.role);
}

/** Employees may request; only owners/admins/delegated approvers may approve org access. */
export function isOrganizationAccessApprover(actor: OrganizationAccessActorContext): boolean {
  return canApproveOrganizationAccess(actor);
}
