import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { scheduled_for?: string };
    if (!body.scheduled_for) {
      return NextResponse.json({ error: "scheduled_for required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("schedule_aipify_action", {
      p_action_id: id,
      p_scheduled_for: body.scheduled_for,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to schedule action" }, { status: 500 });
  }
}
