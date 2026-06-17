import { NextResponse } from "next/server";
import { parsePackValueOverview } from "@/lib/app-portal/business-pack-value";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_business_pack_value", {
      p_pack_key: searchParams.get("pack_key") || null,
      p_value_category: searchParams.get("value_category") || null,
      p_department: searchParams.get("department") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_roi_indicator: searchParams.get("roi_indicator") || null,
      p_adoption_status: searchParams.get("adoption_status") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePackValueOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load value center" }, { status: 500 });
  }
}
