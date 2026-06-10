import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlatformAdmin } from "./types";

export async function getPlatformProfile(
  supabase: SupabaseClient
): Promise<PlatformAdmin | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("platform_admins")
    .select("id, auth_user_id, role, created_at")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as PlatformAdmin;
}

export async function isPlatformAdmin(
  supabase: SupabaseClient
): Promise<boolean> {
  const profile = await getPlatformProfile(supabase);
  return profile !== null;
}
