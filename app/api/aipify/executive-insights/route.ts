import { NextResponse } from "next/server";
import { parseAppPortalExecutiveInsights } from "@/lib/app-portal/executive-insights";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_executive_insights");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });

    const parsed = parseAppPortalExecutiveInsights(data);
    if (!parsed.has_access) {
      return NextResponse.json({ error: parsed.error ?? "Access denied" }, { status: 403 });
    }

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load executive insights" }, { status: 500 });
  }
}
