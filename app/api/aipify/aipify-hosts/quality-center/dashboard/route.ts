import { NextResponse } from "next/server";
import { getAipifyHostsQualityCenterDashboard } from "@/lib/core/aipify-hosts-quality-center";
import { parseAipifyHostsQualityCenterDashboard } from "@/lib/aipify/aipify-hosts-quality-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = new URL(request.url).searchParams.get("section") ?? "upcoming_inspections";
    const data = await getAipifyHostsQualityCenterDashboard(supabase, section);
    const parsed = parseAipifyHostsQualityCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load quality center" }, { status: 500 });
  }
}
