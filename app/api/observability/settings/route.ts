import { NextResponse } from "next/server";
import { parseObservabilitySettings } from "@/lib/aipify/observability-platform-health-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_observability_settings");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseObservabilitySettings(data));
  } catch {
    return NextResponse.json({ error: "Failed to load observability settings" }, { status: 500 });
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
    const { data, error } = await supabase.rpc("save_observability_settings", {
      p_response_time_threshold_ms: body.response_time_threshold_ms ?? null,
      p_integration_failure_threshold: body.integration_failure_threshold ?? null,
      p_ai_failure_threshold: body.ai_failure_threshold ?? null,
      p_queue_backlog_threshold: body.queue_backlog_threshold ?? null,
      p_failed_login_threshold: body.failed_login_threshold ?? null,
      p_notification_failure_threshold: body.notification_failure_threshold ?? null,
      p_enabled_components: body.enabled_components ?? null,
      p_alert_rules: body.alert_rules ?? null,
      p_proactive_monitoring_enabled: body.proactive_monitoring_enabled ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save observability settings" }, { status: 500 });
  }
}
