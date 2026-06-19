import type {
  InventoryItem,
  InventoryOperationsCenter,
  InventoryProduct,
  InventoryWarehouse,
} from "./types";

function parseProduct(row: Record<string, unknown>): InventoryProduct {
  return {
    id: String(row.id ?? ""),
    sku: String(row.sku ?? ""),
    name: String(row.name ?? ""),
    description: typeof row.description === "string" ? row.description : null,
    category_key: typeof row.category_key === "string" ? row.category_key : null,
    supplier_name: typeof row.supplier_name === "string" ? row.supplier_name : null,
    unit_cost: Number(row.unit_cost ?? 0),
    currency: String(row.currency ?? "NOK"),
    min_level: Number(row.min_level ?? 0),
    max_level: row.max_level != null ? Number(row.max_level) : null,
    status: String(row.status ?? "active"),
    asset_eligible: row.asset_eligible === true,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    domain_name: typeof row.domain_name === "string" ? row.domain_name : null,
    total_quantity: Number(row.total_quantity ?? 0),
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseItem(row: Record<string, unknown>): InventoryItem {
  return {
    id: String(row.id ?? ""),
    product_id: String(row.product_id ?? ""),
    sku: typeof row.sku === "string" ? row.sku : null,
    product_name: typeof row.product_name === "string" ? row.product_name : null,
    warehouse_name: typeof row.warehouse_name === "string" ? row.warehouse_name : null,
    location_name: typeof row.location_name === "string" ? row.location_name : null,
    quantity: Number(row.quantity ?? 0),
    available_quantity: Number(row.available_quantity ?? 0),
    reserved_quantity: Number(row.reserved_quantity ?? 0),
    incoming_quantity: Number(row.incoming_quantity ?? 0),
    stock_status: String(row.stock_status ?? "in_stock"),
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseWarehouse(row: Record<string, unknown>): InventoryWarehouse {
  return {
    id: String(row.id ?? ""),
    warehouse_number: typeof row.warehouse_number === "string" ? row.warehouse_number : null,
    name: String(row.name ?? ""),
    location: typeof row.location === "string" ? row.location : null,
    warehouse_type: String(row.warehouse_type ?? "main"),
    manager_name: typeof row.manager_name === "string" ? row.manager_name : null,
    capacity: row.capacity != null ? Number(row.capacity) : null,
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    domain_name: typeof row.domain_name === "string" ? row.domain_name : null,
    status: String(row.status ?? "active"),
    inventory_count: Number(row.inventory_count ?? 0),
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

export function parseInventoryOperationsCenter(data: unknown): InventoryOperationsCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const mapArr = (arr: unknown) => (Array.isArray(arr) ? (arr as Record<string, unknown>[]) : []);

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    products: mapArr(row.products).map(parseProduct),
    inventory_items: mapArr(row.inventory_items).map(parseItem),
    low_stock_items: mapArr(row.low_stock_items).map(parseItem),
    warehouses: mapArr(row.warehouses).map(parseWarehouse),
    movements: mapArr(row.movements),
    receiving: mapArr(row.receiving),
    transfers: mapArr(row.transfers),
    reservations: mapArr(row.reservations),
    adjustments: mapArr(row.adjustments),
    reorder_recommendations: mapArr(row.reorder_recommendations),
    categories: mapArr(row.categories).map((c) => ({
      id: String(c.id ?? ""),
      category_key: String(c.category_key ?? ""),
      name: String(c.name ?? ""),
    })),
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}
