import { NextResponse } from "next/server";
import { getAipifyHostsIncidentCenterCard } from "@/lib/core/aipify-hosts-incident-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getAipifyHostsIncidentCenterCard(supabase));
  } catch {
    return NextResponse.json({ error: "Failed to load incident center card" }, { status: 500 });
  }
}
