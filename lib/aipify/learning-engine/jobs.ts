import { createClient } from "@/lib/supabase/server";

export async function collectLearningSignalsJob(since?: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("collect_learning_signals", {
    p_since: since ?? null,
  });
  if (error) throw error;
  return data as { collected?: number; enabled?: boolean };
}

export async function seedUnonightPilotLearningJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("seed_unonight_pilot_learning");
  if (error) throw error;
  return data as { seeded?: number; tenant_id?: string; reason?: string };
}

export async function resetTenantLearningJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("reset_tenant_learning");
  if (error) throw error;
  return data as { reset?: boolean };
}
