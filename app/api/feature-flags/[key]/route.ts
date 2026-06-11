import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteParams = { params: Promise<{ key: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { key } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("toggle_feature_flag", {
      p_feature_key: decodeURIComponent(key),
      p_enabled: body.enabled ?? true,
      p_environment: body.environment ?? "production",
      p_rollout_percentage: body.rollout_percentage ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to toggle feature flag" }, { status: 500 });
  }
}
