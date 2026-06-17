import { NextResponse } from "next/server";
import { getPartnerPortalActivity } from "@/lib/core/partner-portal";
import { parsePartnerPortalActivity } from "@/lib/partner-portal";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerPortalActivity(supabase);
    const parsed = parsePartnerPortalActivity(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load partner activity" }, { status: 500 });
  }
}
