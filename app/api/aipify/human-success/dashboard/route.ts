import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseHumanSuccessDashboard } from "@/lib/aipify/human-success";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_human_success_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseHumanSuccessDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load human success dashboard" }, { status: 500 });
  }
}
