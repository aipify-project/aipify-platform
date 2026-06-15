import { NextResponse } from "next/server";
import { getAipifyHostsAutomationDashboard } from "@/lib/core/aipify-hosts-automation";
import { parseAipifyHostsAutomationDashboard } from "@/lib/aipify/aipify-hosts-automation";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsAutomationDashboard(supabase);
    const parsed = parseAipifyHostsAutomationDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load hospitality automation dashboard" }, { status: 500 });
  }
}
