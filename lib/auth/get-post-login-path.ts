import type { SupabaseClient } from "@supabase/supabase-js";
import { sanitizeNextPath } from "@/lib/auth/safe-next-path";
import {
  CUSTOMER_PORTAL_ROUTE,
  PLATFORM_ADMIN_ROUTE,
  resolvePostLoginPath,
} from "@/lib/portals";
import { resolvePostLoginRedirectUrl } from "@/lib/portals/customer-portal-url";

export async function getPostLoginPath(
  supabase: SupabaseClient,
  nextPath?: string | null,
  host?: string | null
): Promise<string> {
  const safeNext = sanitizeNextPath(nextPath);
  if (safeNext) {
    return resolvePostLoginRedirectUrl(safeNext, host);
  }

  const { data: platformAdmin } = await supabase
    .from("platform_admins")
    .select("role")
    .maybeSingle();

  const destination = resolvePostLoginPath(host, platformAdmin?.role ?? null);
  return resolvePostLoginRedirectUrl(destination, host);
}

export { CUSTOMER_PORTAL_ROUTE, PLATFORM_ADMIN_ROUTE };
