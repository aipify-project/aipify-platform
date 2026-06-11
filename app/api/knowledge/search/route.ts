import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = Object.fromEntries(new URL(request.url).searchParams.entries());
    const filters: Record<string, unknown> = {};
    for (const key of ["query", "category_slug", "language", "status", "visibility"]) {
      if (params[key]) filters[key] = params[key];
    }
    if (params.limit) filters.limit = Number(params.limit);

    const { data, error } = await supabase.rpc("search_organization_knowledge", { p_filters: filters });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ results: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to search knowledge" }, { status: 500 });
  }
}
