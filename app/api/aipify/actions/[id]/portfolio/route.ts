import { NextResponse } from "next/server";
import { parseInitiativeDetail } from "@/lib/action-center-portfolio";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_action_center_strategic_initiative_detail", {
      p_action_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseInitiativeDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load initiative detail" }, { status: 500 });
  }
}
