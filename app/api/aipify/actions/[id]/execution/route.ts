import { NextResponse } from "next/server";
import { parseExecutionDetail } from "@/lib/action-center-execution";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_action_center_execution_detail", { p_action_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const parsed = parseExecutionDetail(data);
    if (!parsed.found) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load execution detail" }, { status: 500 });
  }
}
