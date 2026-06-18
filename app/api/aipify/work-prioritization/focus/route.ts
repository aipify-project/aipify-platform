import { NextResponse } from "next/server";
import { parseWorkPrioritizationFocus } from "@/lib/aipify/companion-work-prioritization/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_work_prioritization_focus");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseWorkPrioritizationFocus(data));
  } catch {
    return NextResponse.json({ error: "Failed to load focus view" }, { status: 500 });
  }
}
