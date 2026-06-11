import { createClient } from "@/lib/supabase/server";

export async function calculateTrustScoreJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("calculate_explainability_trust_score");
  if (error) throw error;
  return data;
}
