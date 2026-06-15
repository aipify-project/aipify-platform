import { NextResponse } from "next/server";
import { getAipifyHostsGuestExperienceDashboard } from "@/lib/core/aipify-hosts-guest-experience";
import { parseAipifyHostsGuestExperienceDashboard } from "@/lib/aipify/aipify-hosts-guest-experience";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = new URL(request.url).searchParams.get("section") ?? "experience_overview";
    const data = await getAipifyHostsGuestExperienceDashboard(supabase, section);
    const parsed = parseAipifyHostsGuestExperienceDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load guest experience center" }, { status: 500 });
  }
}
