import { createClient } from "@/lib/supabase/server";

export async function calculateReadinessJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("calculate_continuity_readiness_score");
  if (error) throw error;
  return data;
}

export async function generateContinuityBriefingJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("generate_continuity_briefing");
  if (error) throw error;
  return data;
}
