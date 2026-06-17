import { NextResponse } from "next/server";
import { parseWorkPrioritizationDependencies } from "@/lib/aipify/companion-work-prioritization";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_work_prioritization_dependencies");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseWorkPrioritizationDependencies(data));
  } catch {
    return NextResponse.json({ error: "Failed to load dependencies" }, { status: 500 });
  }
}
