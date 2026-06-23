import type { DirectoryPermissionContext } from "@/lib/integration-intelligence/directory/permissions";

export type CommunityMemberDirectoryPermissionContext = DirectoryPermissionContext & {
  can_view_community: boolean;
};

export function buildCommunityMemberDirectoryPermissionContext(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  app_suspended: boolean;
  provider_active: boolean;
  can_view_community?: boolean;
  rate_limit_ok?: boolean;
}): CommunityMemberDirectoryPermissionContext {
  const ownerOrAdmin = ["owner", "admin", "administrator", "support"].includes(
    input.user_role.toLowerCase(),
  );

  return {
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    app_suspended: input.app_suspended,
    provider_active: input.provider_active,
    field_access: ownerOrAdmin ? "directory.search.contact" : "directory.search.basic",
    rate_limit_ok: input.rate_limit_ok ?? true,
    can_view_community: input.can_view_community ?? true,
  };
}

export function assertCommunityMemberDirectoryAllowed(
  ctx: CommunityMemberDirectoryPermissionContext,
): string | null {
  if (!ctx.can_view_community) return "permission_denied";
  if (ctx.app_suspended) return "activation_pending";
  if (!ctx.provider_active) return "provider_missing";
  if (!ctx.rate_limit_ok) return "permission_denied";
  return null;
}

export function resolveCommunityMemberDirectoryPermissionScope(
  ctx: CommunityMemberDirectoryPermissionContext,
): "basic" | "contact" | "sensitive" {
  if (ctx.field_access === "directory.search.sensitive") return "sensitive";
  if (ctx.field_access === "directory.search.contact") return "contact";
  return "basic";
}
