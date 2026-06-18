import { NextResponse } from "next/server";
import { getAipifyHostsOwnerCenterDashboard } from "@/lib/core/aipify-hosts-owner-center";
import { parseAipifyHostsOwnerCenterDashboard } from "@/lib/aipify/aipify-hosts-owner-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = new URL(request.url).searchParams.get("section") ?? "owner_stays";
    const data = await getAipifyHostsOwnerCenterDashboard(supabase, section);
    const parsed = parseAipifyHostsOwnerCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load owner center" }, { status: 500 });
  }
}
