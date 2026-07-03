/** Feature flag — default OFF; enable via NEXT_PUBLIC_CORE_HUMAN_APPROVAL_UI=true */
export const CORE_HUMAN_APPROVAL_UI_FLAG = "CORE_HUMAN_APPROVAL_UI" as const;

export const CORE_HUMAN_APPROVAL_UI_ENV_KEY = "NEXT_PUBLIC_CORE_HUMAN_APPROVAL_UI" as const;

export const HUMAN_APPROVAL_ROUTE = "/app/human-approval" as const;

export const HUMAN_APPROVAL_NAV_ID = "humanApproval" as const;

export type HumanApprovalNavItem = {
  id: typeof HUMAN_APPROVAL_NAV_ID;
  href: string;
  labelKey: string;
};

export const HUMAN_APPROVAL_NAV_LABEL_KEY = "customerApp.humanApproval.navLabel" as const;

export const HUMAN_APPROVAL_PILOT_ROLES = ["owner", "administrator"] as const;

const ORGANIZATION_ROLE_ALIASES: Record<string, string> = {
  organization_owner: "owner",
  organization_admin: "administrator",
  admin: "administrator",
};

export type CoreHumanApprovalUiOverrides = Partial<Record<typeof CORE_HUMAN_APPROVAL_UI_FLAG, boolean>>;

export function normalizeHumanApprovalRole(role: string | null | undefined): string | null {
  if (!role) return null;
  const trimmed = role.trim().toLowerCase();
  return ORGANIZATION_ROLE_ALIASES[trimmed] ?? trimmed;
}

export function isCoreHumanApprovalUiEnabled(
  overrides?: CoreHumanApprovalUiOverrides,
): boolean {
  if (overrides && CORE_HUMAN_APPROVAL_UI_FLAG in overrides) {
    return Boolean(overrides[CORE_HUMAN_APPROVAL_UI_FLAG]);
  }
  return process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY] === "true";
}

export function isHumanApprovalPilotRole(role: string | null | undefined): boolean {
  const normalized = normalizeHumanApprovalRole(role);
  if (!normalized) return false;
  return (HUMAN_APPROVAL_PILOT_ROLES as readonly string[]).includes(normalized);
}

export const HUMAN_APPROVAL_NAV_ITEM: HumanApprovalNavItem = {
  id: HUMAN_APPROVAL_NAV_ID,
  href: HUMAN_APPROVAL_ROUTE,
  labelKey: HUMAN_APPROVAL_NAV_LABEL_KEY,
};

export function filterHumanApprovalNavItems<T extends { id: string }>(items: T[]): T[] {
  if (isCoreHumanApprovalUiEnabled()) {
    return items;
  }
  return items.filter((item) => item.id !== HUMAN_APPROVAL_NAV_ID);
}

export type HumanApprovalAccessState =
  | "ready"
  | "feature_disabled"
  | "forbidden"
  | "unauthenticated";

export function resolveHumanApprovalAccessState(input: {
  authenticated: boolean;
  organizationRole: string | null;
  featureEnabled?: boolean;
}): HumanApprovalAccessState {
  if (!input.authenticated) return "unauthenticated";
  const enabled = input.featureEnabled ?? isCoreHumanApprovalUiEnabled();
  if (!enabled) return "feature_disabled";
  if (!isHumanApprovalPilotRole(input.organizationRole)) {
    return "forbidden";
  }
  return "ready";
}

export const HUMAN_APPROVAL_READ_ONLY_ACTIONS = ["view", "list", "detail"] as const;

export type HumanApprovalReadOnlyAction = (typeof HUMAN_APPROVAL_READ_ONLY_ACTIONS)[number];

export function isHumanApprovalReadOnlyAction(
  action: string,
): action is HumanApprovalReadOnlyAction {
  return (HUMAN_APPROVAL_READ_ONLY_ACTIONS as readonly string[]).includes(action);
}

export function rejectUnsafeHumanApprovalMethod(method: string): boolean {
  return method.toUpperCase() !== "GET";
}
