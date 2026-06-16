import { createClient } from "@/lib/supabase/server";

export async function getAipifyWarehouseOperationsDashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_aipify_warehouse_operations_dashboard");
  if (error) throw error;
  return data;
}

export async function getAipifyWarehouseOperationsCard() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_aipify_warehouse_operations_card");
  if (error) throw error;
  return data;
}

export async function searchAipifyWarehouseInventory(query: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_aipify_warehouse_inventory", {
    p_query: query,
  });
  if (error) throw error;
  return data;
}

export async function performAipifyWarehouseOperationsAction(
  action: string,
  payload: Record<string, unknown> = {}
) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("perform_aipify_warehouse_operations_action", {
    p_action: action,
    p_payload: payload,
  });
  if (error) throw error;
  return data;
}
