import { NextResponse } from "next/server";
import {
  acknowledgeAipifyHostsCriticalAlert,
  updateAipifyHostsNotificationPreferences,
  updateAipifyHostsNotificationStatus,
} from "@/lib/core/aipify-hosts-notification-center";
import { parseAipifyHostsNotificationCenterActionResult } from "@/lib/aipify/aipify-hosts-notification-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      notification_id?: string;
      status?: string;
      preferences?: Record<string, unknown>;
    };

    let data: Record<string, unknown>;
    switch (body.action) {
      case "update_status":
        if (!body.notification_id || !body.status) {
          return NextResponse.json({ error: "notification_id and status required" }, { status: 400 });
        }
        data = await updateAipifyHostsNotificationStatus(supabase, body.notification_id, body.status);
        break;
      case "acknowledge_critical":
        if (!body.notification_id) {
          return NextResponse.json({ error: "notification_id required" }, { status: 400 });
        }
        data = await acknowledgeAipifyHostsCriticalAlert(supabase, body.notification_id);
        break;
      case "update_preferences":
        data = await updateAipifyHostsNotificationPreferences(supabase, {
          p_channel_in_app: body.preferences?.channel_in_app,
          p_channel_email: body.preferences?.channel_email,
          p_channel_push: body.preferences?.channel_push,
          p_quiet_hours_enabled: body.preferences?.quiet_hours_enabled,
          p_min_priority: body.preferences?.min_priority,
          p_escalate_critical_to_owner: body.preferences?.escalate_critical_to_owner,
          p_escalate_critical_to_property_manager: body.preferences?.escalate_critical_to_property_manager,
          p_repeat_critical_alerts: body.preferences?.repeat_critical_alerts,
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(parseAipifyHostsNotificationCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
