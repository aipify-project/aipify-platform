import { createClient } from "@/lib/supabase/server";
import { collectPresetMemoryObservations, observationsToRpcPayload } from "./collectors";

export async function collectMemoryObservationsJob(tenantSlug?: string) {
  const supabase = await createClient();
  const preset = observationsToRpcPayload(collectPresetMemoryObservations(tenantSlug));
  if (preset.length > 0) {
    await supabase.rpc("upsert_memory_observations_batch", { p_observations: preset });
  }
  const { data, error } = await supabase.rpc("collect_memory_observations");
  if (error) throw new Error(error.message);
  return data;
}

export async function generateMemoryRecommendationsJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("generate_memory_recommendations");
  if (error) throw new Error(error.message);
  return data;
}
