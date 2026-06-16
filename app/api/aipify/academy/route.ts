import { NextResponse } from "next/server";
import { parseAcademyOverview } from "@/lib/app-portal/customer-academy";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_academy", {
      p_category: searchParams.get("category") || null,
      p_completion_status: searchParams.get("completion_status") || null,
      p_certification_type: searchParams.get("certification_type") || null,
      p_department: searchParams.get("department") || null,
      p_assigned_by: searchParams.get("assigned_by") || null,
      p_difficulty: searchParams.get("difficulty") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseAcademyOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load academy" }, { status: 500 });
  }
}
