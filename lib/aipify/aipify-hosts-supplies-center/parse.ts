import type {
  HostsInventoryItemRow,
  HostsInventoryTaskRow,
  HostsPropertyInventoryRow,
  HostsPropertyOption,
  HostsPurchaseRow,
  HostsSuppliesCenterActionResult,
  HostsSuppliesCenterDashboard,
  HostsSuppliesStats,
  HostsSupplierRow,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseItems(data: unknown): HostsInventoryItemRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        item_key: typeof d.item_key === "string" ? d.item_key : "",
        item_name: typeof d.item_name === "string" ? d.item_name : "",
        category: typeof d.category === "string" ? d.category : "",
        property: typeof d.property === "string" ? d.property : "—",
        property_id: d.property_id != null ? String(d.property_id) : null,
        current_quantity: Number(d.current_quantity ?? 0),
        minimum_quantity: Number(d.minimum_quantity ?? 0),
        unit_type: typeof d.unit_type === "string" ? d.unit_type : "units",
        status: typeof d.status === "string" ? d.status : "",
        updated_at: typeof d.updated_at === "string" ? d.updated_at : "",
      };
    })
    .filter((r): r is HostsInventoryItemRow => r !== null);
}

function parsePropertyInventory(data: unknown): HostsPropertyInventoryRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.property_id) return null;
      return {
        property_id: String(d.property_id),
        property_name: typeof d.property_name === "string" ? d.property_name : "",
        inventory_health: typeof d.inventory_health === "string" ? d.inventory_health : "healthy",
        low_stock_count: Number(d.low_stock_count ?? 0),
        outstanding_orders: Number(d.outstanding_orders ?? 0),
        total_items: Number(d.total_items ?? 0),
      };
    })
    .filter((r): r is HostsPropertyInventoryRow => r !== null);
}

function parsePurchases(data: unknown): HostsPurchaseRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        supplier: typeof d.supplier === "string" ? d.supplier : "",
        property: typeof d.property === "string" ? d.property : "—",
        property_id: d.property_id != null ? String(d.property_id) : null,
        purchase_date: typeof d.purchase_date === "string" ? d.purchase_date : "",
        quantity: Number(d.quantity ?? 0),
        cost: d.cost != null ? Number(d.cost) : null,
        status: typeof d.status === "string" ? d.status : "",
        item_id: d.item_id != null ? String(d.item_id) : null,
      };
    })
    .filter((r): r is HostsPurchaseRow => r !== null);
}

function parseSuppliers(data: unknown): HostsSupplierRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        supplier_key: typeof d.supplier_key === "string" ? d.supplier_key : "",
        supplier_name: typeof d.supplier_name === "string" ? d.supplier_name : "",
        contact_information: typeof d.contact_information === "string" ? d.contact_information : null,
        category: typeof d.category === "string" ? d.category : "",
        preferred_supplier: Boolean(d.preferred_supplier),
      };
    })
    .filter((r): r is HostsSupplierRow => r !== null);
}

function parseTasks(data: unknown): HostsInventoryTaskRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        task_type: typeof d.task_type === "string" ? d.task_type : "",
        task_summary: typeof d.task_summary === "string" ? d.task_summary : "",
        assigned_to: typeof d.assigned_to === "string" ? d.assigned_to : null,
        due_date: typeof d.due_date === "string" ? d.due_date : null,
        task_status: typeof d.task_status === "string" ? d.task_status : "",
        inventory_item_id: d.inventory_item_id != null ? String(d.inventory_item_id) : null,
      };
    })
    .filter((r): r is HostsInventoryTaskRow => r !== null);
}

function parseProperties(data: unknown): HostsPropertyOption[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return { id: String(d.id), display_name: typeof d.display_name === "string" ? d.display_name : "" };
    })
    .filter((r): r is HostsPropertyOption => r !== null);
}

function parseStats(data: unknown): HostsSuppliesStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    total_items: Number(d.total_items ?? 0),
    low_stock_count: Number(d.low_stock_count ?? 0),
    out_of_stock_count: Number(d.out_of_stock_count ?? 0),
    pending_orders: Number(d.pending_orders ?? 0),
    supplier_count: Number(d.supplier_count ?? 0),
  };
}

export function parseAipifyHostsSuppliesCenterDashboard(data: unknown): HostsSuppliesCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "inventory_overview",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    inventory_categories: asArray<string>(d.inventory_categories),
    inventory_statuses: asArray<string>(d.inventory_statuses),
    stats: parseStats(d.stats),
    property_inventory: parsePropertyInventory(d.property_inventory),
    inventory_overview: parseItems(d.inventory_overview),
    property_supplies: parseItems(d.property_supplies),
    low_stock_alerts: parseItems(d.low_stock_alerts),
    purchase_history: parsePurchases(d.purchase_history),
    suppliers: parseSuppliers(d.suppliers),
    inventory_tasks: parseTasks(d.inventory_tasks),
    properties: parseProperties(d.properties),
  };
}

export function parseAipifyHostsSuppliesCenterActionResult(data: unknown): HostsSuppliesCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    item_id: d.item_id != null ? String(d.item_id) : undefined,
    purchase_id: d.purchase_id != null ? String(d.purchase_id) : undefined,
    supplier_id: d.supplier_id != null ? String(d.supplier_id) : undefined,
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
  };
}
