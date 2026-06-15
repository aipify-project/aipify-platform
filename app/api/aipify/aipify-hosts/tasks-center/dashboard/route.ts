import { NextResponse } from "next/server";
import { getAipifyHostsTasksCenterDashboard } from "@/lib/core/aipify-hosts-tasks-center";
import { parseAipifyHostsTasksCenterDashboard } from "@/lib/aipify/aipify-hosts-tasks-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") ?? "active_tasks";

    const data = await getAipifyHostsTasksCenterDashboard(supabase, section);
    const parsed = parseAipifyHostsTasksCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load tasks center" }, { status: 500 });
  }
}
