import { createClient } from "@/lib/supabase/server";

export async function calculateAdoptionScoreJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("calculate_user_adoption_score");
  if (error) throw error;
  return data;
}

export async function calculateHumanSuccessScoreJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("calculate_human_success_score");
  if (error) throw error;
  return data;
}

export async function generateHumanSuccessBriefingJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("generate_human_success_briefing");
  if (error) throw error;
  return data;
}
