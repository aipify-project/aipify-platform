import { NextResponse } from "next/server";
import { parseIndustryInsightsExportPayload } from "@/lib/aipify/industry-intelligence-foundation-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("export_organization_industry_insights");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseIndustryInsightsExportPayload(data));
  } catch {
    return NextResponse.json({ error: "Failed to export industry insights" }, { status: 500 });
  }
}
