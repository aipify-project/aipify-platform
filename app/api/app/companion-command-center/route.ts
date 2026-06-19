import { NextResponse } from "next/server";
import { getCompanionCommandCenter, parseCompanionCommandCenter } from "@/lib/companion-command-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getCompanionCommandCenter(
      supabase,
      url.searchParams.get("view_mode") ?? undefined,
      url.searchParams.get("section") ?? undefined,
    );
    return NextResponse.json(parseCompanionCommandCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load command center" }, { status: 500 });
  }
}
