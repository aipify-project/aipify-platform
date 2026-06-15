import { NextRequest, NextResponse } from "next/server";
import { parseReleaseCenter } from "@/lib/release-center";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  return {
    release_type: searchParams.get("release_type") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    owner: searchParams.get("owner") ?? undefined,
    audience: searchParams.get("audience") ?? undefined,
    date_from: searchParams.get("date_from") ?? undefined,
    date_to: searchParams.get("date_to") ?? undefined,
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
    const { data, error } = await supabase.rpc("get_release_center", { p_filters: filters });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseReleaseCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load release center" }, { status: 500 });
  }
}
