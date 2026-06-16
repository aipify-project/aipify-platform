import { NextResponse } from "next/server";
import { parseOnboarding } from "@/lib/app-portal/onboarding";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_onboarding");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseOnboarding(data));
  } catch {
    return NextResponse.json({ error: "Failed to load onboarding" }, { status: 500 });
  }
}

type PatchBody = {
  action?: "start" | "update_task" | "dismiss_milestone";
  task_key?: string;
  status?: string;
  milestone_key?: string;
};

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as PatchBody;
    if (!body.action) return NextResponse.json({ error: "Action required" }, { status: 400 });

    const { data, error } = await supabase.rpc("patch_app_portal_onboarding", {
      p_action: body.action,
      p_task_key: body.task_key ?? null,
      p_status: body.status ?? null,
      p_milestone_key: body.milestone_key ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOnboarding(data));
  } catch {
    return NextResponse.json({ error: "Failed to update onboarding" }, { status: 500 });
  }
}
