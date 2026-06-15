/**
 * Aipify Hosts — Supplies Center (Phase Airbnb 23).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsSuppliesCenterDashboard(
  supabase: RpcClient,
  section = "inventory_overview",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_supplies_center_dashboard", { p_section: section });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsSuppliesCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_supplies_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createAipifyHostsInventoryItem(
  supabase: RpcClient,
  params: {
    itemName: string;
    category: string;
    propertyId?: string | null;
    currentQuantity?: number;
    minimumQuantity?: number;
    unitType?: string;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_aipify_hosts_inventory_item", {
    p_item_name: params.itemName,
    p_category: params.category,
    p_property_id: params.propertyId ?? null,
    p_current_quantity: params.currentQuantity ?? 0,
    p_minimum_quantity: params.minimumQuantity ?? 0,
    p_unit_type: params.unitType ?? "units",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsInventoryQuantity(
  supabase: RpcClient,
  itemId: string,
  quantity: number,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_inventory_quantity", {
    p_item_id: itemId,
    p_quantity: quantity,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function recordAipifyHostsInventoryPurchase(
  supabase: RpcClient,
  params: {
    supplierName: string;
    quantity: number;
    propertyId?: string | null;
    itemId?: string | null;
    cost?: number | null;
    purchaseDate?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("record_aipify_hosts_inventory_purchase", {
    p_supplier_name: params.supplierName,
    p_quantity: params.quantity,
    p_property_id: params.propertyId ?? null,
    p_item_id: params.itemId ?? null,
    p_cost: params.cost ?? null,
    p_purchase_date: params.purchaseDate ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createAipifyHostsInventorySupplier(
  supabase: RpcClient,
  params: {
    supplierName: string;
    category: string;
    contactInformation?: string | null;
    preferredSupplier?: boolean;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_aipify_hosts_inventory_supplier", {
    p_supplier_name: params.supplierName,
    p_category: params.category,
    p_contact_information: params.contactInformation ?? null,
    p_preferred_supplier: params.preferredSupplier ?? false,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsInventoryAction(
  supabase: RpcClient,
  params: {
    itemId: string;
    actionType: string;
    assignedTo?: string | null;
    dueDate?: string | null;
    quantity?: number | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_inventory_action", {
    p_item_id: params.itemId,
    p_action_type: params.actionType,
    p_assigned_to: params.assignedTo ?? null,
    p_due_date: params.dueDate ?? null,
    p_quantity: params.quantity ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
