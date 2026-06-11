import { createClient } from "@/lib/supabase/server";

export async function runAocWatchersJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("run_aoc_watchers");
  if (error) throw error;
  return data;
}

export async function calculateAocHealthJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("calculate_aoc_operational_health");
  if (error) throw error;
  return data;
}

export async function generateAocReviewJob(reviewType: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("generate_aoc_review", { p_review_type: reviewType });
  if (error) throw error;
  return data;
}
