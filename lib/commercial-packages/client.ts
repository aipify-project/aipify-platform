import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCustomerBillingCenter(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_customer_billing_center");
  if (error) throw new Error(error.message);
  return data;
}

export async function getCustomerModulesCenter(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_customer_modules_center");
  if (error) throw new Error(error.message);
  return data;
}
