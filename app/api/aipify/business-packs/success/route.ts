import { NextResponse } from "next/server";
import { parseBusinessPackSuccessOverview } from "@/lib/app-portal/business-pack-success";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_business_pack_success", {
      p_pack_key: searchParams.get("pack_key") || null,
      p_adoption_status: searchParams.get("adoption_status") || null,
      p_priority: searchParams.get("priority") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_success_status: searchParams.get("success_status") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseBusinessPackSuccessOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load business pack success center" }, { status: 500 });
  }
}
