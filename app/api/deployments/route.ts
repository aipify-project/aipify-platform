import { NextResponse } from "next/server";
import { parseDeploymentStatus } from "@/lib/aipify/deployment-environment-management-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_deployment_status");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDeploymentStatus(data));
  } catch {
    return NextResponse.json({ error: "Failed to load deployment status" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("schedule_deployment", {
      p_environment_key: body.environment_key,
      p_release_version: body.release_version,
      p_release_notes: body.release_notes ?? null,
      p_scheduled_at: body.scheduled_at ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to schedule deployment" }, { status: 500 });
  }
}
