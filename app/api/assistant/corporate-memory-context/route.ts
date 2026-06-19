import { NextRequest, NextResponse } from "next/server";
import { getCompanionCorporateMemoryContext } from "@/lib/corporate-memory";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const q = request.nextUrl.searchParams.get("q") ?? undefined;
    const data = await getCompanionCorporateMemoryContext(supabase, q);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load corporate memory context" },
      { status: 500 },
    );
  }
}
