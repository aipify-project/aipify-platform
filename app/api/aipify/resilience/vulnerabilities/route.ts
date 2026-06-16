import { NextResponse } from "next/server";
import { parseResilienceVulnerabilities } from "@/lib/app-portal/resilience";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_app_portal_resilience_vulnerabilities", {
      p_category: searchParams.get("category") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ found: true, vulnerabilities: parseResilienceVulnerabilities(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load vulnerabilities" }, { status: 500 });
  }
}
