import { NextResponse } from "next/server";
import { getAipifyHostsExecutiveDashboard } from "@/lib/core/aipify-hosts-executive-dashboard";
import { parseAipifyHostsExecutiveDashboard } from "@/lib/aipify/aipify-hosts-executive-dashboard";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsExecutiveDashboard(supabase);
    const parsed = parseAipifyHostsExecutiveDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load executive dashboard" }, { status: 500 });
  }
}
