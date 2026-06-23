import { hasPermission } from "@/lib/core/permissions";
import { mapLegacyUserRoleToOrganizationRole } from "@/lib/tenant/support-route-access";
import type { UserRole } from "@/lib/tenant/types";
import { CANVA_HANDOFF_READINESS, resolveCanvaHandoffAction } from "./connect-capabilities-audit";

export const CANVA_ARTIFACT_HANDOFF_REQUIRED_PERMISSION = "aipify_studio_creative_intelligence.view" as const;

export function assertCanvaHandoffPermission(effectivePermissions: readonly string[]): boolean {
  return effectivePermissions.includes(CANVA_ARTIFACT_HANDOFF_REQUIRED_PERMISSION);
}

export function assertCanvaHandoffPermissionForRole(role: UserRole): boolean {
  return hasPermission(
    mapLegacyUserRoleToOrganizationRole(role),
    CANVA_ARTIFACT_HANDOFF_REQUIRED_PERMISSION,
  );
}

export function canvaHandoffRequiresConsent(): true {
  return true;
}

export { CANVA_HANDOFF_READINESS, resolveCanvaHandoffAction };
