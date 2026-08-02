/** Bump when capability id semantics or visibility rules change. */
export const APP_MENU_CAPABILITY_CONTRACT_VERSION = "1.0.0" as const;

/**
 * Cache / refresh identity for capability bundles.
 * Layout is force-dynamic — each authenticated request regenerates.
 * Keys must include org + user + version so org-switch never reuses stale allowlists.
 */
export function buildAppMenuCapabilityCacheKey(input: {
  organizationId: string;
  userId: string;
  version?: string;
}): string {
  return [
    "app-menu-capability",
    input.version ?? APP_MENU_CAPABILITY_CONTRACT_VERSION,
    input.organizationId,
    input.userId,
  ].join(":");
}
