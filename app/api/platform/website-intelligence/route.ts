import { NextRequest, NextResponse } from "next/server";
import { parseWebsiteIntelligence, WEBSITE_INTELLIGENCE_SECTIONS } from "@/lib/marketing/website-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sectionParam = request.nextUrl.searchParams.get("section") ?? "overview";
    const section = WEBSITE_INTELLIGENCE_SECTIONS.includes(
      sectionParam as (typeof WEBSITE_INTELLIGENCE_SECTIONS)[number]
    )
      ? sectionParam
      : "overview";

    const { data, error } = await supabase.rpc("get_platform_website_intelligence", {
      p_section: section,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(parseWebsiteIntelligence(data));
  } catch {
    return NextResponse.json({ error: "Failed to load website intelligence" }, { status: 500 });
  }
}
