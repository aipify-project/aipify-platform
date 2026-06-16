/** platform_support implements platform_admin in ABOS terminology. */
export const PLATFORM_PORTAL_ROLES = ["super_admin", "platform_support"] as const;

export type PlatformPortalRole = (typeof PLATFORM_PORTAL_ROLES)[number];

export const PLATFORM_PORTAL_HOME_ROUTE = "/platform";
