import { createClient } from "@/lib/supabase/server";

export async function collectActionRecommendationsJob(since?: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("collect_action_recommendations", {
    p_since: since ?? null,
  });
  if (error) throw error;
  return data as { collected?: number; enabled?: boolean };
}

export async function seedUnonightPilotActionsJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("seed_unonight_pilot_actions");
  if (error) throw error;
  return data as { seeded?: number; tenant_id?: string; reason?: string };
}
