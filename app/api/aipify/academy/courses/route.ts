import { NextResponse } from "next/server";
import { parseAcademyOverview } from "@/lib/app-portal/customer-academy";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_academy_courses", {
      p_category: searchParams.get("category") || null,
      p_completion_status: searchParams.get("completion_status") || null,
      p_difficulty: searchParams.get("difficulty") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const parsed = parseAcademyOverview(data);
    return NextResponse.json({ found: parsed.found, courses: parsed.courses });
  } catch {
    return NextResponse.json({ error: "Failed to load courses" }, { status: 500 });
  }
}
