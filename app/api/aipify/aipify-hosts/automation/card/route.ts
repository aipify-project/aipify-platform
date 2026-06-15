import { NextResponse } from "next/server";
import { getAipifyHostsAutomationCard } from "@/lib/core/aipify-hosts-automation";
import { parseAipifyHostsAutomationCard } from "@/lib/aipify/aipify-hosts-automation";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsAutomationCard(supabase);
    return NextResponse.json(parseAipifyHostsAutomationCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load hospitality automation card" }, { status: 500 });
  }
}
