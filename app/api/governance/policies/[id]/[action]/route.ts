import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteParams = { params: Promise<{ id: string; action: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id, action } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (action === "activate") {
      const { data, error } = await supabase.rpc("activate_organization_policy", {
        p_policy_id: id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (action === "archive") {
      const { data, error } = await supabase.rpc("archive_organization_policy", {
        p_policy_id: id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (action === "update") {
      const body = (await request.json()) as Record<string, unknown>;
      const { data, error } = await supabase.rpc("update_organization_policy", {
        p_policy_id: id,
        p_policy_name: body.policy_name ?? null,
        p_description: body.description ?? null,
        p_configuration: body.configuration ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (action === "schedule-review") {
      const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
      const { data, error } = await supabase.rpc("schedule_policy_review", {
        p_policy_id: id,
        p_scheduled_at: body.scheduled_at ?? null,
        p_owner_user_id: body.owner_user_id ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update policy" }, { status: 500 });
  }
}
