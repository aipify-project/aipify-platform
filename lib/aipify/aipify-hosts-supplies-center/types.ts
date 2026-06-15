export type HostsSuppliesCenterSectionKey =
  | "inventory_overview"
  | "property_supplies"
  | "low_stock_alerts"
  | "purchase_history"
  | "suppliers";

export type HostsInventoryItemRow = {
  id: string;
  item_key: string;
  item_name: string;
  category: string;
  property: string;
  property_id: string | null;
  current_quantity: number;
  minimum_quantity: number;
  unit_type: string;
  status: string;
  updated_at: string;
};

export type HostsPropertyInventoryRow = {
  property_id: string;
  property_name: string;
  inventory_health: string;
  low_stock_count: number;
  outstanding_orders: number;
  total_items: number;
};

export type HostsPurchaseRow = {
  id: string;
  supplier: string;
  property: string;
  property_id: string | null;
  purchase_date: string;
  quantity: number;
  cost: number | null;
  status: string;
  item_id: string | null;
};

export type HostsSupplierRow = {
  id: string;
  supplier_key: string;
  supplier_name: string;
  contact_information: string | null;
  category: string;
  preferred_supplier: boolean;
};

export type HostsInventoryTaskRow = {
  id: string;
  task_type: string;
  task_summary: string;
  assigned_to: string | null;
  due_date: string | null;
  task_status: string;
  inventory_item_id: string | null;
};

export type HostsSuppliesStats = {
  total_items: number;
  low_stock_count: number;
  out_of_stock_count: number;
  pending_orders: number;
  supplier_count: number;
};

export type HostsPropertyOption = {
  id: string;
  display_name: string;
};

export type HostsSuppliesCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  inventory_categories: string[];
  inventory_statuses: string[];
  stats: HostsSuppliesStats;
  property_inventory: HostsPropertyInventoryRow[];
  inventory_overview: HostsInventoryItemRow[];
  property_supplies: HostsInventoryItemRow[];
  low_stock_alerts: HostsInventoryItemRow[];
  purchase_history: HostsPurchaseRow[];
  suppliers: HostsSupplierRow[];
  inventory_tasks: HostsInventoryTaskRow[];
  properties: HostsPropertyOption[];
};

export type HostsSuppliesCenterActionResult = {
  success: boolean;
  item_id?: string;
  purchase_id?: string;
  supplier_id?: string;
  action_type?: string;
};
