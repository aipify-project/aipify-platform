import { NextResponse } from "next/server";
import { getExecutiveInsightsCenter, parseExecutiveInsightsCenter } from "@/lib/analytics-management";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await getExecutiveInsightsCenter(supabase);
    return NextResponse.json(parseExecutiveInsightsCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load insights" }, { status: 500 });
  }
}
