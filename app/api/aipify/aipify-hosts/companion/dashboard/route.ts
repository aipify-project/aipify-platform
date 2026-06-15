import { NextResponse } from "next/server";
import { getAipifyHostsCompanionDashboard } from "@/lib/core/aipify-hosts-companion";
import { parseAipifyHostsCompanionDashboard } from "@/lib/aipify/aipify-hosts-companion";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsCompanionDashboard(supabase);
    const parsed = parseAipifyHostsCompanionDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load hospitality companion dashboard" }, { status: 500 });
  }
}
