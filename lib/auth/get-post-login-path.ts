import type { SupabaseClient } from "@supabase/supabase-js";
import { sanitizeNextPath } from "@/lib/auth/safe-next-path";
import {
  authUserHasActiveCustomerMembership,
  userHasCspPartnerAccess,
} from "@/lib/certified-sales-partner/partner-access";
import {
  CUSTOMER_PORTAL_ROUTE,
  PLATFORM_ADMIN_ROUTE,
  resolvePostLoginPath,
} from "@/lib/portals";
import { resolvePostLoginRedirectUrl } from "@/lib/portals/customer-portal-url";

const PARTNERS_HOME = "/partners";

/**
 * Resolve post-login destination.
 * Explicit safe `next` wins. Platform admins default to Platform.
 * Partner portal is only the default when:
 *  - login explicitly requested the partner portal, or
 *  - the user is an approved/active CSP partner without an active APP customer membership.
 * Ordinary APP customers (including dual-identity accounts) stay on the customer APP.
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

  if (user?.id) {
    // APP customer membership wins over partner auto-routing so Unonight-style
    // dual identities keep landing in the customer APP after ordinary login.
    if (await authUserHasActiveCustomerMembership(user.id)) {
      const destination = resolvePostLoginPath(host, null);
      return resolvePostLoginRedirectUrl(destination, host);
    }

    if (await userHasCspPartnerAccess(supabase, user.id)) {
      return resolvePostLoginRedirectUrl(PARTNERS_HOME, host);
    }
  }

  const destination = resolvePostLoginPath(host, null);
  return resolvePostLoginRedirectUrl(destination, host);
}

export { CUSTOMER_PORTAL_ROUTE, PLATFORM_ADMIN_ROUTE };
