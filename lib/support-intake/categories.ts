/**
 * Shared support intake categories across APP / CSP / public web.
 * Storage keys stay stable; UI labels come from locales.
 * CSP-only category: partner_commission.
 */

export const SUPPORT_INTAKE_SHARED_CATEGORIES = [
  "billing",
  "product",
  "account",
  "technical",
  "other",
] as const;

export type SupportIntakeSharedCategory = (typeof SUPPORT_INTAKE_SHARED_CATEGORIES)[number];

export const SUPPORT_INTAKE_CSP_CATEGORIES = [
  ...SUPPORT_INTAKE_SHARED_CATEGORIES,
  "partner_commission",
] as const;

export type SupportIntakeCspCategory = (typeof SUPPORT_INTAKE_CSP_CATEGORIES)[number];

/** Customer-facing urgency signal — Platform may triage separately. */
export const SUPPORT_INTAKE_PRIORITIES = ["normal", "urgent", "critical"] as const;

export type SupportIntakePriority = (typeof SUPPORT_INTAKE_PRIORITIES)[number];

/** Map intake priority → APP Core priority enum used by create_app_portal_support_request. */
export function mapIntakePriorityToAppPriority(
  priority: SupportIntakePriority | string | null | undefined,
): "low" | "medium" | "high" | "urgent" {
  switch ((priority ?? "").toLowerCase()) {
    case "critical":
      return "urgent";
    case "urgent":
    case "high":
      return "high";
    case "low":
      return "low";
    case "normal":
    case "medium":
    default:
      return "medium";
  }
}

/** Map intake category → APP Core category enum. */
export function mapIntakeCategoryToAppCategory(
  category: string | null | undefined,
): string {
  switch ((category ?? "").toLowerCase()) {
    case "billing":
    case "invoice":
    case "payment":
      return "billing";
    case "product":
    case "module":
      return "business_packs";
    case "account":
    case "license":
      return "account";
    case "technical":
      return "technical";
    case "security":
      return "security";
    case "integrations":
      return "integrations";
    default:
      return "general";
  }
}

export function isSupportIntakeCspCategory(value: string): value is SupportIntakeCspCategory {
  return (SUPPORT_INTAKE_CSP_CATEGORIES as readonly string[]).includes(value);
}
