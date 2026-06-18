import { NextResponse } from "next/server";
import { parseWorkPrioritizationWorkload } from "@/lib/aipify/companion-work-prioritization/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_work_prioritization_workload");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseWorkPrioritizationWorkload(data));
  } catch {
    return NextResponse.json({ error: "Failed to load workload view" }, { status: 500 });
  }
}
