import type { SupabaseClient } from "@supabase/supabase-js";

export async function verifyUserPassword(
  supabase: SupabaseClient,
  email: string,
  password: string
): Promise<boolean> {
  if (!email.trim() || !password) return false;

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  return !error;
}
