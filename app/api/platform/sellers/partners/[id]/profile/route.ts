import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { isCspPartnerId } from "@/lib/certified-sales-partner/partner-admin-detail";
import { fetchCspPartnerProfileData } from "@/lib/certified-sales-partner/partner-profile-data";
import { createClient } from "@/lib/supabase/server";

/** Platform Admin partner-scoped profile data (links, sales, settlements, ledger, audit). GET only. */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const { id } = await context.params;
    if (!isCspPartnerId(id)) return NextResponse.json({ found: false }, { status: 404 });

    const result = await fetchCspPartnerProfileData(id);
    if (result.kind === "not_found") return NextResponse.json({ found: false }, { status: 404 });
    if (result.kind === "error") return NextResponse.json({ error: "partner_profile_failed" }, { status: 500 });

    return NextResponse.json({ found: true, profile: result.profile }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "partner_profile_failed" }, { status: 500 });
  }
}
