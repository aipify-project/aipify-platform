import { NextResponse } from "next/server";
import { getMyCompanionPresenceSummary } from "@/lib/companion-presence-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getMyCompanionPresenceSummary(supabase));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load summary" }, { status: 500 });
  }
}
