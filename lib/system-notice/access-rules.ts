import type { SystemNoticeStatus } from "./types";

/** Dynamic access rule — title, description, and CTA vary; card design stays identical. */
export type AccessRequiredRule =
  | "growth_partner"
  | "business_pack"
  | "professional_plan"
  | "enterprise"
  | "administrator"
  | "executive"
  | "role_restricted";

export const ACCESS_RULE_TO_STATUS: Record<AccessRequiredRule, SystemNoticeStatus> = {
  growth_partner: "growth_partner_required",
  business_pack: "business_pack_required",
  professional_plan: "professional_plan_required",
  enterprise: "enterprise_access_required",
  administrator: "administrator_access_required",
  executive: "executive_access_required",
  role_restricted: "administrator_access_required",
};

export function resolveAccessRequiredStatus(rule: AccessRequiredRule): SystemNoticeStatus {
  return ACCESS_RULE_TO_STATUS[rule];
}
