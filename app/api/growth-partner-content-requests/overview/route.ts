import { NextResponse } from "next/server";
import { parseGrowthPartnerContentRequestCenter } from "@/lib/growth-partner-content-requests";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const surface = new URL(request.url).searchParams.get("surface") ?? "partner";
    const { data, error } = await supabase.rpc("get_growth_partner_content_request_center", {
      p_surface: surface,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseGrowthPartnerContentRequestCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Content Request Center" }, { status: 500 });
  }
}
