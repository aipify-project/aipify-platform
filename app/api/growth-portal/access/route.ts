import { NextResponse } from "next/server";
import {
  isGrowthPortalAccessGranted,
  userHasCspPartnerAccess,
} from "@/lib/certified-sales-partner/partner-access";
import { parsePartnersPortalAccess } from "@/lib/partners-portal";
import { createClient } from "@/lib/supabase/server";

/** @deprecated Use /api/partners-portal/access — kept in sync for legacy clients. */
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

    if (await userHasCspPartnerAccess(supabase, user.id)) {
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
