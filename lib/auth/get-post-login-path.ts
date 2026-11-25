import type { SupabaseClient } from "@supabase/supabase-js";
import { sanitizeNextPath } from "@/lib/auth/safe-next-path";
import { userHasCspPartnerAccess } from "@/lib/certified-sales-partner/partner-access";
import {
  CUSTOMER_PORTAL_ROUTE,
  PLATFORM_ADMIN_ROUTE,
  resolvePostLoginPath,
} from "@/lib/portals";
import { resolvePostLoginRedirectUrl } from "@/lib/portals/customer-portal-url";

const PARTNERS_HOME = "/partners";

/**
 * Resolve post-login destination.
 * Explicit safe `next` wins. Platform admins default to Platform. Approved CSP sellers
 * (without an explicit customer next) land on /partners — never customer APP org bootstrap.
 */
export async function getPostLoginPath(
  supabase: SupabaseClient,
  nextPath?: string | null,
  host?: string | null,
  options?: { portalIntent?: string | null },
): Promise<string> {
  const safeNext = sanitizeNextPath(nextPath);
  if (safeNext) {
    return resolvePostLoginRedirectUrl(safeNext, host);
  }

  if (options?.portalIntent === "partner") {
    return resolvePostLoginRedirectUrl(PARTNERS_HOME, host);
  }

  const { data: platformAdmin } = await supabase
    .from("platform_admins")
    .select("role")
    .maybeSingle();

  if (platformAdmin?.role) {
    const destination = resolvePostLoginPath(host, platformAdmin.role);
    return resolvePostLoginRedirectUrl(destination, host);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.id && (await userHasCspPartnerAccess(supabase, user.id))) {
    return resolvePostLoginRedirectUrl(PARTNERS_HOME, host);
  }

  const destination = resolvePostLoginPath(host, null);
  return resolvePostLoginRedirectUrl(destination, host);
}

export { CUSTOMER_PORTAL_ROUTE, PLATFORM_ADMIN_ROUTE };
