import { NextResponse } from "next/server";
import {
  fetchCspPartnerStatusForAuthUser,
  isCspPartnerPortalStatusAllowed,
  isGrowthPortalAccessGranted,
  userHasCspPartnerAccess,
} from "@/lib/certified-sales-partner/partner-access";
import { parsePartnersPortalAccess } from "@/lib/partners-portal";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUserFromSession } from "@/lib/supabase/session-auth";

/**
 * Seller portal access (`/partners`).
 *
 * ALLOWED only when Core confirms:
 *  - active Growth Portal membership / super_admin growth role, or
 *  - an approved/active Certified Sales Partner profile.
 *
 * Never grants access from customer company membership, email address,
 * client-supplied roles, or a pending/rejected partner application.
 * Never elevates Platform Admin privileges.
 *
 * Growth RPC and CSP status run in parallel (same contract as layout gate).
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const user = await getAuthenticatedUserFromSession(supabase);
    if (!user) {
      return NextResponse.json({ has_access: false, role: "none" }, { status: 401 });
    }

    const [growthResult, cspStatus] = await Promise.all([
      supabase.rpc("get_growth_portal_access"),
      fetchCspPartnerStatusForAuthUser(user.id),
    ]);

    if (!growthResult.error && isGrowthPortalAccessGranted(growthResult.data)) {
      return NextResponse.json(parsePartnersPortalAccess(growthResult.data));
    }

    if (isCspPartnerPortalStatusAllowed(cspStatus)) {
      return NextResponse.json({
        has_access: true,
        role: "csp_partner",
        access_source: "csp",
      });
    }

    if (cspStatus !== null) {
      return NextResponse.json({ has_access: false, role: "none" }, { status: 403 });
    }

    // Rare: no profile row yet — fall back to overview RPC (fail-closed).
    const hasCsp = await userHasCspPartnerAccess(supabase, user.id);
    if (hasCsp) {
      return NextResponse.json({
        has_access: true,
        role: "csp_partner",
        access_source: "csp",
      });
    }

    return NextResponse.json({ has_access: false, role: "none" }, { status: 403 });
  } catch {
    return NextResponse.json({ has_access: false, role: "none" }, { status: 500 });
  }
}
