import { NextResponse } from "next/server";
import { parseCFIOverview } from "@/lib/app-portal/cross-functional-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_cfi_collaboration");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const overview = parseCFIOverview({ found: true, collaboration: (data as { collaboration?: unknown })?.collaboration });
    return NextResponse.json({ collaboration: overview.collaboration ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to load collaboration" }, { status: 500 });
  }
}
