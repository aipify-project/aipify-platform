import { NextResponse } from "next/server";
import { getAipifyHostsSuppliesCenterDashboard } from "@/lib/core/aipify-hosts-supplies-center";
import { parseAipifyHostsSuppliesCenterDashboard } from "@/lib/aipify/aipify-hosts-supplies-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = new URL(request.url).searchParams.get("section") ?? "inventory_overview";
    const data = await getAipifyHostsSuppliesCenterDashboard(supabase, section);
    const parsed = parseAipifyHostsSuppliesCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load supplies center" }, { status: 500 });
  }
}
