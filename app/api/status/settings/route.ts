import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      title: string;
      description?: string;
      component?: string;
      estimated_duration_minutes?: number;
      affected_services?: string[];
    };

    const { data, error } = await supabase.rpc("publish_maintenance_notice", {
      p_title: body.title,
      p_description: body.description ?? null,
      p_component: body.component ?? "platform",
      p_estimated_duration_minutes: body.estimated_duration_minutes ?? 60,
      p_affected_services: body.affected_services ?? [],
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to publish maintenance notice" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("save_status_transparency_settings", {
      p_public_status_page_enabled: body.public_status_page_enabled ?? null,
      p_tenant_notices_enabled: body.tenant_notices_enabled ?? null,
      p_auto_publish_from_observability: body.auto_publish_from_observability ?? null,
      p_critical_bypass_quiet_hours: body.critical_bypass_quiet_hours ?? null,
      p_enabled_components: body.enabled_components ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
