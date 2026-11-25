import { NextResponse } from "next/server";
import {
  isGrowthPortalAccessGranted,
  userHasCspPartnerAccess,
} from "@/lib/certified-sales-partner/partner-access";
import { parsePartnersPortalAccess } from "@/lib/partners-portal";
import { createClient } from "@/lib/supabase/server";

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
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ has_access: false, role: "none" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("get_growth_portal_access");
    if (!error && isGrowthPortalAccessGranted(data)) {
      return NextResponse.json(parsePartnersPortalAccess(data));
    }

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
