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
    .select("id, auth_user_id, role, created_at, status")
    .eq("auth_user_id", user.id)
    .in("role", ["super_admin", "platform_support"])
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const status = (data as { status?: string }).status ?? "active";
  if (status !== "active") {
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
