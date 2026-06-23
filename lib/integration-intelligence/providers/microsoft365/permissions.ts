import { hasPermission } from "@/lib/core/permissions";
import { mapLegacyUserRoleToOrganizationRole } from "@/lib/tenant/support-route-access";
import type { UserRole } from "@/lib/tenant/types";
import {
  MICROSOFT365_HANDOFF_READINESS,
  resolveMicrosoft365HandoffAction,
  type Microsoft365ApplicationKey,
} from "./connect-capabilities-audit";

export const MICROSOFT365_HANDOFF_REQUIRED_PERMISSION =
  "aipify_studio_creative_intelligence.view" as const;

export function assertMicrosoft365HandoffPermission(effectivePermissions: readonly string[]): boolean {
  return effectivePermissions.includes(MICROSOFT365_HANDOFF_REQUIRED_PERMISSION);
}

export function assertMicrosoft365HandoffPermissionForRole(role: UserRole): boolean {
  return hasPermission(
    mapLegacyUserRoleToOrganizationRole(role),
    MICROSOFT365_HANDOFF_REQUIRED_PERMISSION,
  );
}

export function microsoft365HandoffRequiresConsent(): true {
  return true;
}

export { MICROSOFT365_HANDOFF_READINESS, resolveMicrosoft365HandoffAction };
export type { Microsoft365ApplicationKey };
