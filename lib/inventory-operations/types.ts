export type InventoryProduct = {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  category_key?: string | null;
  supplier_name?: string | null;
  unit_cost: number;
  currency: string;
  min_level: number;
  max_level?: number | null;
  status: string;
  asset_eligible: boolean;
  business_pack_key?: string | null;
  domain_name?: string | null;
  total_quantity?: number;
  updated_at?: string | null;
};

export type InventoryItem = {
  id: string;
  product_id: string;
  sku?: string | null;
  product_name?: string | null;
  warehouse_name?: string | null;
  location_name?: string | null;
  quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  incoming_quantity: number;
  stock_status: string;
  updated_at?: string | null;
};

export type InventoryWarehouse = {
  id: string;
  warehouse_number?: string | null;
  name: string;
  location?: string | null;
  warehouse_type: string;
  manager_name?: string | null;
  capacity?: number | null;
  department_name?: string | null;
  domain_name?: string | null;
  status: string;
  inventory_count?: number;
  updated_at?: string | null;
};

export type InventoryOperationsCenter = {
  found: boolean;
  principle?: string;
  overview?: Record<string, unknown>;
  products?: InventoryProduct[];
  inventory_items?: InventoryItem[];
  low_stock_items?: InventoryItem[];
  warehouses?: InventoryWarehouse[];
  movements?: Record<string, unknown>[];
  receiving?: Record<string, unknown>[];
  transfers?: Record<string, unknown>[];
  reservations?: Record<string, unknown>[];
  adjustments?: Record<string, unknown>[];
  reorder_recommendations?: Record<string, unknown>[];
  categories?: { id: string; category_key: string; name: string }[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: Record<string, string>;
};
