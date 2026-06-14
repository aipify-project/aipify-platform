import type { SuperAdminControlCenter } from "./types";

export function parseSuperAdminControlCenter(payload: unknown): SuperAdminControlCenter | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  if (data.has_access !== true) return null;

  return {
    has_access: true,
    admin_role: typeof data.admin_role === "string" ? data.admin_role : undefined,
    display_name: typeof data.display_name === "string" ? data.display_name : undefined,
    platform_health_score:
      typeof data.platform_health_score === "number" ? data.platform_health_score : undefined,
    active_organizations:
      typeof data.active_organizations === "number" ? data.active_organizations : undefined,
    growth_partner_applications_pending:
      typeof data.growth_partner_applications_pending === "number"
        ? data.growth_partner_applications_pending
        : undefined,
    marketplace_reviews_pending:
      typeof data.marketplace_reviews_pending === "number"
        ? data.marketplace_reviews_pending
        : undefined,
    critical_incidents:
      typeof data.critical_incidents === "number" ? data.critical_incidents : undefined,
    privacy_note: typeof data.privacy_note === "string" ? data.privacy_note : undefined,
  };
}
