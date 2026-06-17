import { NextResponse } from "next/server";
import { getPartnerAcademyDashboard } from "@/lib/core/partner-academy";
import { parsePartnerAcademyDashboard } from "@/lib/partner-academy";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerAcademyDashboard(supabase);
    const parsed = parsePartnerAcademyDashboard(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load Partner Academy" }, { status: 500 });
  }
}
