import { NextResponse } from "next/server";
import { getUniversalSearchCenter, parseUniversalSearchCenter } from "@/lib/universal-search-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getUniversalSearchCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseUniversalSearchCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load search center" }, { status: 500 });
  }
}
