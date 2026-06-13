import { NextResponse } from "next/server";
import { parseOrchestrationResult } from "@/lib/companion-orchestration";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: "update_settings" | "update_registry" | "orchestrate";
      orchestration_enabled?: boolean;
      sensitivity?: string;
      notification_level?: string;
      enterprise_policy_mode?: string;
      companion_key?: string;
      status?: string;
      priority_level?: number;
      request?: string;
    };

    if (body.action === "update_settings") {
      const { data, error } = await supabase.rpc("update_companion_orchestration_settings", {
        p_payload: {
          orchestration_enabled: body.orchestration_enabled,
          sensitivity: body.sensitivity,
          notification_level: body.notification_level,
          enterprise_policy_mode: body.enterprise_policy_mode,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update_registry" && body.companion_key) {
      const { data, error } = await supabase.rpc("update_companion_orchestration_registry", {
        p_payload: {
          companion_key: body.companion_key,
          status: body.status,
          priority_level: body.priority_level,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "orchestrate" && body.request?.trim()) {
      const { data, error } = await supabase.rpc("orchestrate_companion_request", {
        p_request: body.request.trim(),
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(parseOrchestrationResult(data));
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process orchestration action" }, { status: 500 });
  }
}
