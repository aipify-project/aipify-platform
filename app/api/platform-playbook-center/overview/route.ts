import { NextRequest, NextResponse } from "next/server";
import { parsePlatformPlaybookCenter } from "@/lib/platform-playbook-center";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  return {
    category: searchParams.get("category") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    trigger_type: searchParams.get("trigger_type") ?? undefined,
    owner: searchParams.get("owner") ?? undefined,
    outcome: searchParams.get("outcome") ?? undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const filters = buildFilters(request.nextUrl.searchParams);
    const { data, error } = await supabase.rpc("get_platform_playbook_center", { p_filters: filters });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parsePlatformPlaybookCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load playbook center" }, { status: 500 });
  }
}
