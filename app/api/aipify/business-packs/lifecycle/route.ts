import { NextResponse } from "next/server";
import { parsePackLifecycleOverview } from "@/lib/app-portal/business-pack-lifecycle";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_business_pack_lifecycle", {
      p_lifecycle_stage: searchParams.get("lifecycle_stage") || null,
      p_review_owner: searchParams.get("review_owner") || null,
      p_department: searchParams.get("department") || null,
      p_adoption_status: searchParams.get("adoption_status") || null,
      p_review_status: searchParams.get("review_status") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePackLifecycleOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load lifecycle center" }, { status: 500 });
  }
}
