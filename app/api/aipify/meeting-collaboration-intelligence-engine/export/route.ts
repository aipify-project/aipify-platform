import { NextResponse } from "next/server";
import { parseMeetingCollaborationExport } from "@/lib/aipify/meeting-collaboration-intelligence-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const manifestType = searchParams.get("manifest_type");

    const { data, error } = await supabase.rpc("export_meeting_collaboration_manifest", {
      p_manifest_type: manifestType ?? "meetings_summary",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseMeetingCollaborationExport(data));
  } catch {
    return NextResponse.json({ error: "Failed to export meeting manifest" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { manifest_type?: string };

    const { data, error } = await supabase.rpc("export_meeting_collaboration_manifest", {
      p_manifest_type: body.manifest_type ?? "meetings_summary",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseMeetingCollaborationExport(data));
  } catch {
    return NextResponse.json({ error: "Failed to export meeting manifest" }, { status: 500 });
  }
}
