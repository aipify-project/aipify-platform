import type {
  CommandBarItem,
  CommandBarRoleContext,
  CustomerRole,
  PlatformRole,
} from "./types";

const CUSTOMER_ROLE_RANK: Record<CustomerRole, number> = {
  read_only: 1,
  staff: 2,
  support: 3,
  admin: 4,
  owner: 5,
};

const PLATFORM_ROLE_RANK: Record<PlatformRole, number> = {
  platform_support: 1,
  super_admin: 2,
};

function customerRoleMeetsMinimum(
  role: CustomerRole | undefined,
  minimum: CustomerRole[] | undefined
): boolean {
  if (!minimum?.length) return true;
  if (!role) return false;
  const rank = CUSTOMER_ROLE_RANK[role] ?? 0;
  return minimum.some((required) => rank >= CUSTOMER_ROLE_RANK[required]);
}

function platformRoleMeetsMinimum(
  role: PlatformRole | undefined,
  minimum: PlatformRole | undefined
): boolean {
  if (!minimum) return true;
  if (!role) return false;
  return (PLATFORM_ROLE_RANK[role] ?? 0) >= PLATFORM_ROLE_RANK[minimum];
}

export function isCommandAllowed(
  item: CommandBarItem,
  context: CommandBarRoleContext
): boolean {
  if (item.superAdminOnly) {
    if (context.portal === "super_admin") {
      return context.platformRole === "super_admin";
    }
    return context.platformRole === "super_admin";
  }

  if (context.portal === "customer") {
    return customerRoleMeetsMinimum(context.customerRole, item.minCustomerRoles);
  }

  if (context.portal === "platform" || context.portal === "super_admin") {
    if (item.minCustomerRoles?.length) return false;
    return platformRoleMeetsMinimum(context.platformRole, item.minPlatformRole);
  }

  return true;
}

export function filterCommandsByRole(
  items: CommandBarItem[],
  context: CommandBarRoleContext
): CommandBarItem[] {
  return items.filter((item) => isCommandAllowed(item, context));
}
