import type {
  AssetAssignment,
  AssetAudit,
  AssetManagementCenter,
  AssetRecord,
  AssetVehicle,
} from "./types";

function num(v: unknown): number | undefined {
  if (v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function mapArr(arr: unknown) {
  return Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];
}

function parseAsset(a: Record<string, unknown>): AssetRecord {
  return {
    id: String(a.id ?? ""),
    asset_number: String(a.asset_number ?? ""),
    name: String(a.name ?? ""),
    description: typeof a.description === "string" ? a.description : undefined,
    category: String(a.category ?? ""),
    asset_type: String(a.asset_type ?? ""),
    status: String(a.status ?? "active"),
    serial_number: typeof a.serial_number === "string" ? a.serial_number : null,
    manufacturer: typeof a.manufacturer === "string" ? a.manufacturer : null,
    qr_code: typeof a.qr_code === "string" ? a.qr_code : null,
    barcode: typeof a.barcode === "string" ? a.barcode : null,
    department_id: typeof a.department_id === "string" ? a.department_id : null,
    department_name: typeof a.department_name === "string" ? a.department_name : undefined,
    assigned_employee_id: typeof a.assigned_employee_id === "string" ? a.assigned_employee_id : null,
    assigned_employee_name: typeof a.assigned_employee_name === "string" ? a.assigned_employee_name : undefined,
    domain: typeof a.domain === "string" ? a.domain : undefined,
    location_name: typeof a.location_name === "string" ? a.location_name : undefined,
    warranty_date: typeof a.warranty_date === "string" ? a.warranty_date : null,
    warranty_start: typeof a.warranty_start === "string" ? a.warranty_start : null,
    purchase_cost: a.purchase_cost == null ? null : num(a.purchase_cost) ?? null,
    current_value: a.current_value == null ? null : num(a.current_value) ?? null,
    is_reservable: a.is_reservable === true,
    deep_link: typeof a.deep_link === "string" ? a.deep_link : undefined,
    metadata: a.metadata as Record<string, unknown> | undefined,
  };
}

export function parseAssetManagementCenter(data: unknown): AssetManagementCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const overview = row.overview as Record<string, unknown> | undefined;

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    philosophy: typeof row.philosophy === "string" ? row.philosophy : undefined,
    overview: overview
      ? {
          total_assets: num(overview.total_assets),
          active: num(overview.active),
          assigned: num(overview.assigned),
          available: num(overview.available),
          maintenance_required: num(overview.maintenance_required),
          vehicles: num(overview.vehicles),
          software_licenses: num(overview.software_licenses),
          properties: num(overview.properties),
          it_equipment: num(overview.it_equipment),
          reserved: num(overview.reserved),
          warranty_expiring_30d: num(overview.warranty_expiring_30d),
          license_expiring_30d: num(overview.license_expiring_30d),
          audits_in_progress: num(overview.audits_in_progress),
          total_value: num(overview.total_value),
        }
      : undefined,
    assets: mapArr(row.assets).map(parseAsset),
    assignments: mapArr(row.assignments).map(
      (a): AssetAssignment => ({
        id: String(a.id ?? ""),
        asset_id: String(a.asset_id ?? ""),
        asset_name: typeof a.asset_name === "string" ? a.asset_name : undefined,
        asset_number: typeof a.asset_number === "string" ? a.asset_number : undefined,
        assignment_type: String(a.assignment_type ?? ""),
        assigned_label: typeof a.assigned_label === "string" ? a.assigned_label : null,
        assigned_at: typeof a.assigned_at === "string" ? a.assigned_at : null,
        returned_at: typeof a.returned_at === "string" ? a.returned_at : null,
        expected_return_at: typeof a.expected_return_at === "string" ? a.expected_return_at : null,
      }),
    ),
    vehicles: mapArr(row.vehicles).map(
      (v): AssetVehicle => ({
        asset_id: String(v.asset_id ?? ""),
        asset_number: typeof v.asset_number === "string" ? v.asset_number : undefined,
        name: String(v.name ?? ""),
        status: String(v.status ?? "active"),
        registration_number: typeof v.registration_number === "string" ? v.registration_number : null,
        mileage: v.mileage == null ? null : num(v.mileage) ?? null,
        next_service_date: typeof v.next_service_date === "string" ? v.next_service_date : null,
        insurance_expiry: typeof v.insurance_expiry === "string" ? v.insurance_expiry : null,
        assigned_employee_name: typeof v.assigned_employee_name === "string" ? v.assigned_employee_name : null,
      }),
    ),
    audits: mapArr(row.audits).map(
      (a): AssetAudit => ({
        id: String(a.id ?? ""),
        audit_number: typeof a.audit_number === "string" ? a.audit_number : null,
        audit_type: String(a.audit_type ?? "physical"),
        status: String(a.status ?? "in_progress"),
        summary: typeof a.summary === "string" ? a.summary : null,
        created_at: typeof a.created_at === "string" ? a.created_at : null,
        items_verified: num(a.items_verified),
      }),
    ),
    maintenance: mapArr(row.maintenance),
    reservations: mapArr(row.reservations),
    software_licenses: mapArr(row.software_licenses),
    warranties: mapArr(row.warranties),
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    sections: Array.isArray(row.sections) ? (row.sections as string[]) : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}
