import { createClient } from "@/lib/supabase/server";

export async function calculateStrategicHealthJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("calculate_strategic_health_score");
  if (error) throw error;
  return data;
}

export async function generateStrategicBriefingJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("generate_strategic_briefing");
  if (error) throw error;
  return data;
}

export async function detectStrategicOpportunitiesJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_strategic_dashboard");
  if (error) throw error;
  return data;
}
