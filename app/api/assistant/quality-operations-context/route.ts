import { NextResponse } from "next/server";
import { getCompanionQualityOperationsContext } from "@/lib/quality-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getCompanionQualityOperationsContext(supabase, url.searchParams.get("q") ?? undefined);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load quality context" },
      { status: 500 },
    );
  }
}
