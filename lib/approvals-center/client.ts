import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCustomerApprovalsCenter(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_customer_approvals_center");
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}
