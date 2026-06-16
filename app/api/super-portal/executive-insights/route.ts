import { NextResponse } from "next/server";
import { parseSuperExecutiveInsights } from "@/lib/super-portal";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_super_executive_insights");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });

    const parsed = parseSuperExecutiveInsights(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load executive insights" }, { status: 500 });
  }
}
