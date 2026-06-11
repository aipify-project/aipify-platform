import { createClient } from "@/lib/supabase/server";

export async function runSimulationJob(scenarioId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("run_simulation", { p_scenario_id: scenarioId });
  if (error) throw error;
  return data;
}
