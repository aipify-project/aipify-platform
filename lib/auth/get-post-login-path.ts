import type { SupabaseClient } from "@supabase/supabase-js";

export async function getPostLoginPath(
  supabase: SupabaseClient,
  nextPath?: string | null
): Promise<string> {
  if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
    return nextPath;
  }

  const { data: platformAdmin } = await supabase
    .from("platform_admins")
    .select("id")
    .maybeSingle();

  return platformAdmin ? "/platform" : "/dashboard";
}
