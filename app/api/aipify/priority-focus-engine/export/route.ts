import { NextResponse } from "next/server";
import { parsePriorityFocusExport } from "@/lib/aipify/priority-focus-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { format?: string };
    const { data, error } = await supabase.rpc("export_priority_focus_summary", {
      p_format: body.format ?? "json",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePriorityFocusExport(data));
  } catch {
    return NextResponse.json({ error: "Failed to export summary" }, { status: 500 });
  }
}
