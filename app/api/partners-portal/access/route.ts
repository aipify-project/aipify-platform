import { NextResponse } from "next/server";
import { authUserHasCspPartnerProfile } from "@/lib/certified-sales-partner/partner-admin-detail";
import { parsePartnersPortalAccess } from "@/lib/partners-portal";
import { createClient } from "@/lib/supabase/server";

/**
 * Partner portal access: Growth Portal membership OR an existing CSP partner profile.
 * CSP applicants/approved partners must reach /partners without legacy Growth membership.
 * Never grants Platform Admin privileges.
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
    if (!error) {
      const growth = parsePartnersPortalAccess(data);
      if (growth.has_access) return NextResponse.json(growth);
    }

    const hasCsp = await authUserHasCspPartnerProfile(user.id);
    if (hasCsp) {
      return NextResponse.json({ has_access: true, role: "csp_partner", access_source: "csp" });
    }

    return NextResponse.json({ has_access: false, role: "none" }, { status: 403 });
  } catch {
    return NextResponse.json({ has_access: false, role: "none" }, { status: 500 });
  }
}
