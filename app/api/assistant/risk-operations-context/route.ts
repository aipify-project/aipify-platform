import { NextResponse } from "next/server";
import { getCompanionRiskOperationsContext } from "@/lib/risk-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getCompanionRiskOperationsContext(supabase, url.searchParams.get("q") ?? undefined);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load risk context" },
      { status: 500 },
    );
  }
}
