import { NextResponse } from "next/server";
import { parsePartnersPortalAccess } from "@/lib/partners-portal";
import { createClient } from "@/lib/supabase/server";

/** @deprecated Use /api/partners-portal/access */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_growth_portal_access");
    if (error) return NextResponse.json({ has_access: false, role: "none" }, { status: 403 });
    return NextResponse.json(parsePartnersPortalAccess(data));
  } catch {
    return NextResponse.json({ has_access: false, role: "none" }, { status: 500 });
  }
}
