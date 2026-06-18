import { NextResponse } from "next/server";
import { parseResourcePlanningExport } from "@/lib/aipify/resource-planning-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("export_resource_planning_manifest", { p_format: "json" });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseResourcePlanningExport(data));
  } catch {
    return NextResponse.json({ error: "Failed to export manifest" }, { status: 500 });
  }
}
