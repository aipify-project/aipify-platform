import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseActionRequest } from "@/lib/trust-action";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("list_action_requests", { p_status: null });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const actions = Array.isArray(data) ? data : [];
    const match = actions.find((item) => (item as { id?: string }).id === id);
    const parsed = parseActionRequest(match);
    if (!parsed) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: audit } = await supabase.rpc("get_action_request_audit", {
      p_request_id: id,
    });

    return NextResponse.json({ action: parsed, audit: audit ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to load action" }, { status: 500 });
  }
}
