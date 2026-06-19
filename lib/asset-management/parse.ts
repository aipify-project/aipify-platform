import type { AssetManagementCenter, AssetRecord } from "./types";

function num(v: unknown): number | undefined {
  if (v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function parseAssetManagementCenter(data: unknown): AssetManagementCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const overview = row.overview as Record<string, unknown> | undefined;

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    overview: overview
      ? {
          total_assets: num(overview.total_assets),
          active: num(overview.active),
          maintenance_required: num(overview.maintenance_required),
          vehicles: num(overview.vehicles),
          software_licenses: num(overview.software_licenses),
          properties: num(overview.properties),
          it_equipment: num(overview.it_equipment),
          reserved: num(overview.reserved),
          warranty_expiring_30d: num(overview.warranty_expiring_30d),
        }
      : undefined,
    assets: Array.isArray(row.assets)
      ? (row.assets as Record<string, unknown>[]).map((a) => ({
          id: String(a.id ?? ""),
          asset_number: String(a.asset_number ?? ""),
          name: String(a.name ?? ""),
          category: String(a.category ?? ""),
          asset_type: String(a.asset_type ?? ""),
          status: String(a.status ?? "active"),
          department_id: typeof a.department_id === "string" ? a.department_id : null,
          department_name: typeof a.department_name === "string" ? a.department_name : undefined,
          assigned_employee_id: typeof a.assigned_employee_id === "string" ? a.assigned_employee_id : null,
          assigned_employee_name: typeof a.assigned_employee_name === "string" ? a.assigned_employee_name : undefined,
          domain: typeof a.domain === "string" ? a.domain : undefined,
          location_name: typeof a.location_name === "string" ? a.location_name : undefined,
          warranty_date: typeof a.warranty_date === "string" ? a.warranty_date : null,
          purchase_cost: a.purchase_cost == null ? null : num(a.purchase_cost),
          current_value: a.current_value == null ? null : num(a.current_value),
          is_reservable: a.is_reservable === true,
          metadata: a.metadata as Record<string, unknown> | undefined,
        }) satisfies AssetRecord)
      : [],
    maintenance: Array.isArray(row.maintenance) ? (row.maintenance as Record<string, unknown>[]) : [],
    reservations: Array.isArray(row.reservations) ? (row.reservations as Record<string, unknown>[]) : [],
    software_licenses: Array.isArray(row.software_licenses) ? (row.software_licenses as Record<string, unknown>[]) : [],
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    routes: row.routes as AssetManagementCenter["routes"],
  };
}
