import { NextResponse } from "next/server";
import { getAipifyHostsDashboard } from "@/lib/core/aipify-hosts";
import { parseAipifyHostsDashboard } from "@/lib/aipify/aipify-hosts/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsDashboard(supabase);
    const parsed = parseAipifyHostsDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load Aipify Hosts dashboard" }, { status: 500 });
  }
}
