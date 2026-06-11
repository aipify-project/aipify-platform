import { createClient } from "@/lib/supabase/server";

export async function seedUnonightPilotSkillsJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("seed_unonight_pilot_skills");
  if (error) throw new Error(error.message);
  return data;
}
