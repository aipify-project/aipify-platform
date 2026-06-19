import { NextResponse } from "next/server";
import { getCompanionCommandCenterContext } from "@/lib/companion-command-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    return NextResponse.json(
      await getCompanionCommandCenterContext(
        supabase,
        url.searchParams.get("q") ?? undefined,
        url.searchParams.get("view_mode") ?? undefined,
      ),
    );
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load context" }, { status: 500 });
  }
}
