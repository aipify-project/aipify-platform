import { NextResponse } from "next/server";
import { parseExecutiveForesightDetail } from "@/lib/app-portal/executive-foresight";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_executive_foresight_observation", {
      p_observation_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseExecutiveForesightDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load foresight observation" }, { status: 500 });
  }
}
