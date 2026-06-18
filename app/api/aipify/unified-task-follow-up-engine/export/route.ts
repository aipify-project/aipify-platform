import { NextResponse } from "next/server";
import { parseUnifiedTaskFollowUpExport } from "@/lib/aipify/unified-task-follow-up-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const manifestType = searchParams.get("manifest_type");

    const { data, error } = await supabase.rpc("export_unified_task_follow_up_manifest", {
      p_manifest_type: manifestType ?? "tasks_summary",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseUnifiedTaskFollowUpExport(data));
  } catch {
    return NextResponse.json({ error: "Failed to export task manifest" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { manifest_type?: string };

    const { data, error } = await supabase.rpc("export_unified_task_follow_up_manifest", {
      p_manifest_type: body.manifest_type ?? "tasks_summary",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseUnifiedTaskFollowUpExport(data));
  } catch {
    return NextResponse.json({ error: "Failed to export task manifest" }, { status: 500 });
  }
}
