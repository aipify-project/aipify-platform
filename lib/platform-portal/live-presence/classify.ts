import type { PlatformLivePresencePortal } from "./constants";

/**
 * Role classification for live presence aggregates.
 * signed_in uses distinct auth users across portals — never sum overlapping roles.
 */
export type LivePresenceRoleFlags = {
  isPlatformAdmin: boolean;
  isSeller: boolean;
  isAppCustomer: boolean;
};

export function classifyLivePresencePortal(
  flags: LivePresenceRoleFlags,
): PlatformLivePresencePortal | null {
  // Prefer the portal the caller claims only when server flags allow it.
  // Platform admin wins over seller/customer for the same auth user when both apply.
  if (flags.isPlatformAdmin) return "platform_admin";
  if (flags.isSeller) return "seller";
  if (flags.isAppCustomer) return "app_customer";
  return null;
}

export function assertClaimedPortalAllowed(
  claimed: PlatformLivePresencePortal,
  flags: LivePresenceRoleFlags,
): boolean {
  const allowed = classifyLivePresencePortal(flags);
  if (!allowed) return false;
  if (claimed === "platform_admin") return flags.isPlatformAdmin;
  if (claimed === "seller") return flags.isSeller;
  if (claimed === "app_customer") return flags.isAppCustomer;
  return false;
}

/** Distinct union size — never sum category counts. */
export function distinctSignedInCount(input: {
  appCustomerUserIds: readonly string[];
  sellerUserIds: readonly string[];
  platformAdminUserIds: readonly string[];
}): number {
  const set = new Set<string>();
  for (const id of input.appCustomerUserIds) {
    if (id) set.add(id);
  }
  for (const id of input.sellerUserIds) {
    if (id) set.add(id);
  }
  for (const id of input.platformAdminUserIds) {
    if (id) set.add(id);
  }
  return set.size;
}
