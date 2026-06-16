export type WarehouseInventoryItem = {
  id?: string;
  sku?: string;
  product_name?: string;
  aisle?: string;
  shelf?: string;
  bin?: string;
  location_label?: string;
  quantity_on_hand?: number;
  quantity_reserved?: number;
  quantity_available?: number;
  reorder_threshold?: number;
  below_reorder?: boolean;
  unit_price?: number | null;
  currency?: string;
};

export type WarehouseFulfillmentOrder = {
  id?: string;
  order_key?: string;
  customer_label?: string;
  external_source?: string;
  fulfillment_status?: string;
  priority?: number;
  due_at?: string | null;
  packaging_instructions?: string;
  shipping_requirements?: string;
};

export type WarehousePickingTask = {
  id?: string;
  order_id?: string;
  sku?: string;
  product_name?: string;
  pick_location?: string;
  quantity_to_pick?: number;
  sequence_no?: number;
  task_status?: string;
};

export type WarehousePickupSchedule = {
  id?: string;
  carrier?: string;
  shipment_status?: string;
  pickup_window_start?: string | null;
  pickup_window_end?: string | null;
  order_key?: string;
};

export type WarehousePrintJob = {
  id?: string;
  document_type?: string;
  print_status?: string;
  reference_key?: string;
  created_at?: string;
};

export type WarehousePendingApproval = {
  id?: string;
  approval_type?: string;
  summary?: string;
  approval_status?: string;
  created_at?: string;
};

export type WarehouseCapability = {
  key?: string;
  label?: string;
};

export type WarehouseIntegration = {
  key?: string;
  label?: string;
  status?: string;
};

export type WarehouseOperationsSettings = {
  enabled?: boolean;
  voice_interaction_enabled?: boolean;
  printer_integration_enabled?: boolean;
  auto_fulfillment_enabled?: boolean;
  integration_channels?: string[];
};

export type WarehouseOperationsMetrics = {
  orders_awaiting_fulfillment?: number;
  delayed_shipments?: number;
  inventory_shortages?: number;
  pickups_scheduled?: number;
  picks_completed_today?: number;
};

export type AipifyWarehouseOperationsDashboard = {
  has_tenant?: boolean;
  principle?: string;
  vision?: string;
  settings?: WarehouseOperationsSettings;
  capabilities?: WarehouseCapability[];
  voice_examples?: string[];
  workflow_steps?: string[];
  metrics?: WarehouseOperationsMetrics;
  orders_awaiting?: WarehouseFulfillmentOrder[];
  picking_tasks?: WarehousePickingTask[];
  inventory_shortages?: WarehouseInventoryItem[];
  pickup_schedules?: WarehousePickupSchedule[];
  recent_print_jobs?: WarehousePrintJob[];
  pending_approvals?: WarehousePendingApproval[];
  approval_rules?: WarehouseCapability[];
  integrations?: WarehouseIntegration[];
  success_criteria?: string[];
  workspace_route?: string;
  marketplace_route?: string;
};

export type AipifyWarehouseOperationsCard = {
  has_tenant?: boolean;
  principle?: string;
  orders_awaiting?: number;
  inventory_shortages?: number;
  pending_approvals?: number;
};

export type WarehouseInventorySearchResult = {
  query?: string;
  results?: WarehouseInventoryItem[];
};
