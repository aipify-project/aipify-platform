import type {
  AipifyWarehouseOperationsCard,
  AipifyWarehouseOperationsDashboard,
  WarehouseCapability,
  WarehouseFulfillmentOrder,
  WarehouseIntegration,
  WarehouseInventoryItem,
  WarehouseInventorySearchResult,
  WarehouseOperationsMetrics,
  WarehouseOperationsSettings,
  WarehousePendingApproval,
  WarehousePickingTask,
  WarehousePickupSchedule,
  WarehousePrintJob,
} from "./types";

function parseInventoryItem(value: unknown): WarehouseInventoryItem {
  const i = (value ?? {}) as Record<string, unknown>;
  return {
    id: typeof i.id === "string" ? i.id : undefined,
    sku: typeof i.sku === "string" ? i.sku : undefined,
    product_name: typeof i.product_name === "string" ? i.product_name : undefined,
    aisle: typeof i.aisle === "string" ? i.aisle : undefined,
    shelf: typeof i.shelf === "string" ? i.shelf : undefined,
    bin: typeof i.bin === "string" ? i.bin : undefined,
    location_label: typeof i.location_label === "string" ? i.location_label : undefined,
    quantity_on_hand: typeof i.quantity_on_hand === "number" ? i.quantity_on_hand : undefined,
    quantity_reserved: typeof i.quantity_reserved === "number" ? i.quantity_reserved : undefined,
    quantity_available: typeof i.quantity_available === "number" ? i.quantity_available : undefined,
    reorder_threshold: typeof i.reorder_threshold === "number" ? i.reorder_threshold : undefined,
    below_reorder: Boolean(i.below_reorder),
    unit_price: typeof i.unit_price === "number" ? i.unit_price : null,
    currency: typeof i.currency === "string" ? i.currency : undefined,
  };
}

function parseSettings(value: unknown): WarehouseOperationsSettings | undefined {
  if (!value || typeof value !== "object") return undefined;
  const s = value as Record<string, unknown>;
  return {
    enabled: Boolean(s.enabled),
    voice_interaction_enabled: Boolean(s.voice_interaction_enabled),
    printer_integration_enabled: Boolean(s.printer_integration_enabled),
    auto_fulfillment_enabled: Boolean(s.auto_fulfillment_enabled),
    integration_channels: Array.isArray(s.integration_channels)
      ? (s.integration_channels as string[])
      : undefined,
  };
}

function parseMetrics(value: unknown): WarehouseOperationsMetrics | undefined {
  if (!value || typeof value !== "object") return undefined;
  const m = value as Record<string, unknown>;
  return {
    orders_awaiting_fulfillment:
      typeof m.orders_awaiting_fulfillment === "number" ? m.orders_awaiting_fulfillment : undefined,
    delayed_shipments: typeof m.delayed_shipments === "number" ? m.delayed_shipments : undefined,
    inventory_shortages: typeof m.inventory_shortages === "number" ? m.inventory_shortages : undefined,
    pickups_scheduled: typeof m.pickups_scheduled === "number" ? m.pickups_scheduled : undefined,
    picks_completed_today:
      typeof m.picks_completed_today === "number" ? m.picks_completed_today : undefined,
  };
}

function parseCapabilities(value: unknown): WarehouseCapability[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const c = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof c.key === "string" ? c.key : undefined,
      label: typeof c.label === "string" ? c.label : undefined,
    };
  });
}

function parseOrders(value: unknown): WarehouseFulfillmentOrder[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const o = (item ?? {}) as Record<string, unknown>;
    return {
      id: typeof o.id === "string" ? o.id : undefined,
      order_key: typeof o.order_key === "string" ? o.order_key : undefined,
      customer_label: typeof o.customer_label === "string" ? o.customer_label : undefined,
      external_source: typeof o.external_source === "string" ? o.external_source : undefined,
      fulfillment_status: typeof o.fulfillment_status === "string" ? o.fulfillment_status : undefined,
      priority: typeof o.priority === "number" ? o.priority : undefined,
      due_at: typeof o.due_at === "string" ? o.due_at : null,
      packaging_instructions:
        typeof o.packaging_instructions === "string" ? o.packaging_instructions : undefined,
      shipping_requirements:
        typeof o.shipping_requirements === "string" ? o.shipping_requirements : undefined,
    };
  });
}

function parsePickingTasks(value: unknown): WarehousePickingTask[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const t = (item ?? {}) as Record<string, unknown>;
    return {
      id: typeof t.id === "string" ? t.id : undefined,
      order_id: typeof t.order_id === "string" ? t.order_id : undefined,
      sku: typeof t.sku === "string" ? t.sku : undefined,
      product_name: typeof t.product_name === "string" ? t.product_name : undefined,
      pick_location: typeof t.pick_location === "string" ? t.pick_location : undefined,
      quantity_to_pick: typeof t.quantity_to_pick === "number" ? t.quantity_to_pick : undefined,
      sequence_no: typeof t.sequence_no === "number" ? t.sequence_no : undefined,
      task_status: typeof t.task_status === "string" ? t.task_status : undefined,
    };
  });
}

function parsePickups(value: unknown): WarehousePickupSchedule[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const p = (item ?? {}) as Record<string, unknown>;
    return {
      id: typeof p.id === "string" ? p.id : undefined,
      carrier: typeof p.carrier === "string" ? p.carrier : undefined,
      shipment_status: typeof p.shipment_status === "string" ? p.shipment_status : undefined,
      pickup_window_start: typeof p.pickup_window_start === "string" ? p.pickup_window_start : null,
      pickup_window_end: typeof p.pickup_window_end === "string" ? p.pickup_window_end : null,
      order_key: typeof p.order_key === "string" ? p.order_key : undefined,
    };
  });
}

function parsePrintJobs(value: unknown): WarehousePrintJob[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const p = (item ?? {}) as Record<string, unknown>;
    return {
      id: typeof p.id === "string" ? p.id : undefined,
      document_type: typeof p.document_type === "string" ? p.document_type : undefined,
      print_status: typeof p.print_status === "string" ? p.print_status : undefined,
      reference_key: typeof p.reference_key === "string" ? p.reference_key : undefined,
      created_at: typeof p.created_at === "string" ? p.created_at : undefined,
    };
  });
}

function parseApprovals(value: unknown): WarehousePendingApproval[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const a = (item ?? {}) as Record<string, unknown>;
    return {
      id: typeof a.id === "string" ? a.id : undefined,
      approval_type: typeof a.approval_type === "string" ? a.approval_type : undefined,
      summary: typeof a.summary === "string" ? a.summary : undefined,
      approval_status: typeof a.approval_status === "string" ? a.approval_status : undefined,
      created_at: typeof a.created_at === "string" ? a.created_at : undefined,
    };
  });
}

function parseIntegrations(value: unknown): WarehouseIntegration[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const i = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof i.key === "string" ? i.key : undefined,
      label: typeof i.label === "string" ? i.label : undefined,
      status: typeof i.status === "string" ? i.status : undefined,
    };
  });
}

export function parseAipifyWarehouseOperationsDashboard(
  value: unknown
): AipifyWarehouseOperationsDashboard {
  const d = (value ?? {}) as Record<string, unknown>;
  return {
    has_tenant: Boolean(d.has_tenant),
    principle: typeof d.principle === "string" ? d.principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    settings: parseSettings(d.settings),
    capabilities: parseCapabilities(d.capabilities),
    voice_examples: Array.isArray(d.voice_examples) ? (d.voice_examples as string[]) : undefined,
    workflow_steps: Array.isArray(d.workflow_steps) ? (d.workflow_steps as string[]) : undefined,
    metrics: parseMetrics(d.metrics),
    orders_awaiting: parseOrders(d.orders_awaiting),
    picking_tasks: parsePickingTasks(d.picking_tasks),
    inventory_shortages: Array.isArray(d.inventory_shortages)
      ? d.inventory_shortages.map(parseInventoryItem)
      : undefined,
    pickup_schedules: parsePickups(d.pickup_schedules),
    recent_print_jobs: parsePrintJobs(d.recent_print_jobs),
    pending_approvals: parseApprovals(d.pending_approvals),
    approval_rules: parseCapabilities(d.approval_rules),
    integrations: parseIntegrations(d.integrations),
    success_criteria: Array.isArray(d.success_criteria)
      ? (d.success_criteria as string[])
      : undefined,
    workspace_route: typeof d.workspace_route === "string" ? d.workspace_route : undefined,
    marketplace_route: typeof d.marketplace_route === "string" ? d.marketplace_route : undefined,
  };
}

export function parseAipifyWarehouseOperationsCard(value: unknown): AipifyWarehouseOperationsCard {
  const c = (value ?? {}) as Record<string, unknown>;
  return {
    has_tenant: Boolean(c.has_tenant),
    principle: typeof c.principle === "string" ? c.principle : undefined,
    orders_awaiting: typeof c.orders_awaiting === "number" ? c.orders_awaiting : undefined,
    inventory_shortages: typeof c.inventory_shortages === "number" ? c.inventory_shortages : undefined,
    pending_approvals: typeof c.pending_approvals === "number" ? c.pending_approvals : undefined,
  };
}

export function parseWarehouseInventorySearch(value: unknown): WarehouseInventorySearchResult {
  const s = (value ?? {}) as Record<string, unknown>;
  return {
    query: typeof s.query === "string" ? s.query : undefined,
    results: Array.isArray(s.results) ? s.results.map(parseInventoryItem) : undefined,
  };
}
