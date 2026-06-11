import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_ACTIONS = new Set([
  "archive",
  "supersede",
  "restore",
  "reference",
  "change_visibility",
]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const { id, action } = await params;
    if (!ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json({ error: "Unknown action" }, { status: 404 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("perform_organization_memory_action", {
      p_record_id: id,
      p_action: action,
      p_payload: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? {});
  } catch {
    return NextResponse.json({ error: "Memory action failed" }, { status: 500 });
  }
}
