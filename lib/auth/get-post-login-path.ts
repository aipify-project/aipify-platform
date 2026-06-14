import type { SupabaseClient } from "@supabase/supabase-js";
import { CUSTOMER_PORTAL_ROUTE, PLATFORM_ADMIN_ROUTE, resolvePostLoginPath } from "@/lib/portals";

export async function getPostLoginPath(
  supabase: SupabaseClient,
  nextPath?: string | null,
  host?: string | null
): Promise<string> {
  if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
    return nextPath;
  }

  const { data: platformAdmin } = await supabase
    .from("platform_admins")
    .select("role")
    .maybeSingle();

  return resolvePostLoginPath(host, platformAdmin?.role ?? null);
}

export { CUSTOMER_PORTAL_ROUTE, PLATFORM_ADMIN_ROUTE };
