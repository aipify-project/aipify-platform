import { hasPermission } from "@/lib/core/permissions";
import { mapLegacyUserRoleToOrganizationRole } from "@/lib/tenant/support-route-access";
import type { UserRole } from "@/lib/tenant/types";
import { listExternalApplicationManifests } from "./manifest-registry";

const DEFAULT_EXTERNAL_APPLICATION_PERMISSION = "aipify_studio_creative_intelligence.view";

export function buildExternalApplicationPermissionMap(role: UserRole): Record<string, boolean> {
  const organizationRole = mapLegacyUserRoleToOrganizationRole(role);
  const defaultGranted = hasPermission(organizationRole, DEFAULT_EXTERNAL_APPLICATION_PERMISSION);

  return Object.fromEntries(
    listExternalApplicationManifests().map((manifest) => {
      const required =
        manifest.capabilities.find((capability) => capability.required_permission)?.required_permission ??
        DEFAULT_EXTERNAL_APPLICATION_PERMISSION;
      return [
        manifest.application_key,
        required
          ? hasPermission(
              organizationRole,
              required as Parameters<typeof hasPermission>[1],
            )
          : defaultGranted,
      ];
    }),
  );
}
