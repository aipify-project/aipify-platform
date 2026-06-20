import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCustomerKnowledgeCenter(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_customer_knowledge_center");
  if (error) throw new Error(error.message);
  return data;
}
