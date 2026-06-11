import { createClient } from "@/lib/supabase/server";
import { parsePersonalityMessage } from "@/lib/aipify/personality";

export async function renderPersonalityMessage(
  context: string,
  templateKey: string,
  variables: Record<string, string | number> = {}
) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("render_personality_message", {
    p_context: context,
    p_template_key: templateKey,
    p_variables: variables,
  });
  if (error) throw error;
  return parsePersonalityMessage(data);
}

export async function generateWarmGreeting(taskCount = 3) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("generate_warm_greeting", {
    p_task_count: taskCount,
  });
  if (error) throw error;
  return parsePersonalityMessage(data);
}
