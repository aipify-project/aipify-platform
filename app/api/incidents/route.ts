import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const status = new URL(request.url).searchParams.get("status");
    const { data, error } = await supabase.rpc("get_platform_incidents", {
      p_status: status,
      p_limit: 20,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: "Failed to load incidents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      incident_summary: string;
      affected_services?: string[];
      severity?: string;
      mitigation_steps?: string;
    };

    const { data, error } = await supabase.rpc("create_platform_incident", {
      p_incident_summary: body.incident_summary,
      p_affected_services: body.affected_services ?? [],
      p_severity: body.severity ?? "medium",
      p_mitigation_steps: body.mitigation_steps ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create incident" }, { status: 500 });
  }
}
