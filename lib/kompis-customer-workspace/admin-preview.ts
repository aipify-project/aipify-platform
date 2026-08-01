import { resolveKompisWorkspacePermissions } from "./permissions";
import type { KompisCustomerWorkspaceContract, KompisWorkspacePermissions } from "./types";
import type { KompisWorkspaceSurface } from "./enums";

/**
 * Typed admin control surface — read-only effective policy preview.
 * Full customer admin UI is a follow-up task; this is not a raw JSON editor.
 */
export function previewKompisWorkspaceEffectiveAccess(opts: {
  contract: KompisCustomerWorkspaceContract;
  surface: KompisWorkspaceSurface;
  route: string;
  module: string;
  user_role: string;
  access_tier: string;
  user_groups?: string[];
}): {
  preview_only: true;
  permissions: KompisWorkspacePermissions;
  ui_followup: "AIPIFY.KOMPIS.CUSTOMER.ADMIN.CONTROL.PANEL.V1";
} {
  return {
    preview_only: true,
    permissions: resolveKompisWorkspacePermissions({
      contract: opts.contract,
      context: {
        surface: opts.surface,
        route: opts.route,
        module: opts.module,
        user_role: opts.user_role,
        access_tier: opts.access_tier,
        entity_type: null,
      },
      user_groups: opts.user_groups,
    }),
    ui_followup: "AIPIFY.KOMPIS.CUSTOMER.ADMIN.CONTROL.PANEL.V1",
  };
}
