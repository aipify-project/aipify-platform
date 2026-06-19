export type InventoryOperationsCenter = {
  found: boolean;
  error?: string;
  section?: string;
  engine?: string;
  principle?: string;
  privacy_note?: string;
  companion_identity?: string;
  section_count?: number;
  overview?: Record<string, unknown>;
  stats?: Record<string, number | string | boolean>;
  rows?: Record<string, unknown>[];
  products?: Record<string, unknown>[];
  consumables?: Record<string, unknown>[];
  stock?: Record<string, unknown>[];
  locations?: Record<string, unknown>[];
  reservations?: Record<string, unknown>[];
  purchase_requests?: Record<string, unknown>[];
  purchase_orders?: Record<string, unknown>[];
  suppliers?: Record<string, unknown>[];
  receiving?: Record<string, unknown>[];
  transfers?: Record<string, unknown>[];
  stock_counts?: Record<string, unknown>[];
  adjustments?: Record<string, unknown>[];
  waste?: Record<string, unknown>[];
  returns?: Record<string, unknown>[];
  equipment?: Record<string, unknown>[];
  forecasting?: Record<string, unknown>[];
  policies?: Record<string, unknown>[];
  low_stock_alerts?: Record<string, unknown>[];
  reorder_suggestions?: Record<string, unknown>[];
  stock_status_defs?: Record<string, unknown>[];
  sections_registry?: Record<string, unknown>[];
  companion_recommendations?: Record<string, unknown>[];
  integrations?: Record<string, unknown>;
  since_last_login?: Record<string, unknown>;
  audit_recent?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
};

function arr(row: unknown, key: string): Record<string, unknown>[] {
  const v = (row as Record<string, unknown>)?.[key];
  return Array.isArray(v) ? (v as Record<string, unknown>[]) : [];
}

function obj(row: unknown, key: string): Record<string, unknown> {
  const v = (row as Record<string, unknown>)?.[key];
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

export function parseInventoryOperationsCenter(raw: unknown): InventoryOperationsCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  const overview = obj(row, "overview");
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    engine: typeof row.engine === "string" ? row.engine : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    companion_identity:
      typeof row.companion_identity === "string" ? row.companion_identity : undefined,
    section_count: typeof row.section_count === "number" ? row.section_count : undefined,
    overview,
    stats: overview as Record<string, number | string | boolean>,
    rows: arr(row, "rows"),
    products: arr(row, "products"),
    consumables: arr(row, "consumables"),
    stock: arr(row, "stock"),
    locations: arr(row, "locations"),
    reservations: arr(row, "reservations"),
    purchase_requests: arr(row, "purchase_requests"),
    purchase_orders: arr(row, "purchase_orders"),
    suppliers: arr(row, "suppliers"),
    receiving: arr(row, "receiving"),
    transfers: arr(row, "transfers"),
    stock_counts: arr(row, "stock_counts"),
    adjustments: arr(row, "adjustments"),
    waste: arr(row, "waste"),
    returns: arr(row, "returns"),
    equipment: arr(row, "equipment"),
    forecasting: arr(row, "forecasting"),
    policies: arr(row, "policies"),
    low_stock_alerts: arr(row, "low_stock_alerts"),
    reorder_suggestions: arr(row, "reorder_suggestions"),
    stock_status_defs: arr(row, "stock_status_defs"),
    sections_registry: arr(row, "sections_registry"),
    companion_recommendations: arr(row, "companion_recommendations"),
    integrations: obj(row, "integrations"),
    since_last_login: obj(row, "since_last_login"),
    audit_recent: arr(row, "audit_recent"),
    reports: obj(row, "reports"),
  };
}
