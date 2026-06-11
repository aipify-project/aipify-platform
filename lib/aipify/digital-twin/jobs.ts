import { createClient } from "@/lib/supabase/server";

export async function calculateTwinHealthJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("calculate_digital_twin_health_score");
  if (error) throw error;
  return data;
}

export async function detectBottlenecksJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("detect_digital_twin_bottlenecks");
  if (error) throw error;
  return data;
}
