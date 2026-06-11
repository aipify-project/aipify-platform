import { createClient } from "@/lib/supabase/server";

export async function processAppReviewQueueJob(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("process_ecosystem_app_review_queue", { p_limit: limit });
  if (error) throw error;
  return data as { processed?: number };
}

export async function checkAppUpdatesJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_ecosystem_app_updates");
  if (error) throw error;
  return data as { updates_flagged?: number };
}

export async function collectAppTelemetryJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("collect_ecosystem_app_telemetry");
  if (error) throw error;
  return data as { metrics_recorded?: number };
}
