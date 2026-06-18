import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseMemoryProfiles } from "@/lib/aipify/memory/parse";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const scope = request.nextUrl.searchParams.get("scope");
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? 50);

    const { data, error } = await supabase.rpc("get_memory_profiles", {
      p_scope: scope,
      p_limit: limit,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseMemoryProfiles(data));
  } catch {
    return NextResponse.json({ error: "Failed to load profiles" }, { status: 500 });
  }
}
