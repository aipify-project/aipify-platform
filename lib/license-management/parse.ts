import type {
  AppLicenseSummary,
  CapacitySummary,
  DomainLicenseSummary,
  DomainPackInstallation,
  LicenseOverview,
  LicenseSubscriptionCenter,
} from "./types";

function num(value: unknown): number | undefined {
  if (value == null) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function parseLicenseSubscriptionCenter(data: unknown): LicenseSubscriptionCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const app = row.app_license as Record<string, unknown> | undefined;
  const dom = row.domain_licenses as Record<string, unknown> | undefined;
  const cap = row.capacity as Record<string, unknown> | undefined;
  const overview = row.overview as Record<string, unknown> | undefined;

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    commercial_principle: typeof row.commercial_principle === "string" ? row.commercial_principle : undefined,
    app_license: app
      ? ({
          license_type: String(app.license_type ?? "app"),
          status: String(app.status ?? "active"),
          renewal_date: typeof app.renewal_date === "string" ? app.renewal_date : null,
          plan_key: typeof app.plan_key === "string" ? app.plan_key : undefined,
          includes: Array.isArray(app.includes) ? (app.includes as string[]) : [],
          access_blocked: app.access_blocked === true,
        } satisfies AppLicenseSummary)
      : undefined,
    domain_licenses: dom
      ? ({
          purchased: num(dom.purchased),
          used: num(dom.used),
          available: num(dom.available),
          included: num(dom.included),
          purchased_additional: num(dom.purchased_additional),
        } satisfies DomainLicenseSummary)
      : undefined,
    domains: Array.isArray(row.domains)
      ? (row.domains as Record<string, unknown>[]).map((d) => ({
          id: String(d.id ?? ""),
          domain: String(d.domain ?? ""),
          display_name: typeof d.display_name === "string" ? d.display_name : undefined,
          is_primary: d.is_primary === true,
        }))
      : [],
    capacity: cap
      ? ({
          included_capacity: cap.included_capacity == null ? null : num(cap.included_capacity),
          purchased_capacity: num(cap.purchased_capacity),
          total_capacity: cap.total_capacity == null ? null : num(cap.total_capacity),
          active_employees: num(cap.active_employees),
          pending_invitations: num(cap.pending_invitations),
          used: num(cap.used),
          available: cap.available == null ? null : num(cap.available),
          capacity_status: typeof cap.capacity_status === "string" ? cap.capacity_status : undefined,
        } satisfies CapacitySummary)
      : undefined,
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    domain_pack_installations: Array.isArray(row.domain_pack_installations)
      ? (row.domain_pack_installations as Record<string, unknown>[]).map(
          (i) =>
            ({
              domain_id: typeof i.domain_id === "string" ? i.domain_id : undefined,
              domain: typeof i.domain === "string" ? i.domain : undefined,
              pack_key: String(i.pack_key ?? ""),
              license_status: typeof i.license_status === "string" ? i.license_status : undefined,
              installed_at: typeof i.installed_at === "string" ? i.installed_at : undefined,
            }) satisfies DomainPackInstallation,
        )
      : [],
    overview: overview
      ? ({
          domains_used: num(overview.domains_used),
          domains_purchased: num(overview.domains_purchased),
          employees_active: num(overview.employees_active),
          employees_capacity: overview.employees_capacity == null ? null : num(overview.employees_capacity),
          business_pack_count: num(overview.business_pack_count),
          renewal_date: typeof overview.renewal_date === "string" ? overview.renewal_date : null,
        } satisfies LicenseOverview)
      : undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    upgrade_center: row.upgrade_center as LicenseSubscriptionCenter["upgrade_center"],
    routes: row.routes as LicenseSubscriptionCenter["routes"],
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
  };
}
