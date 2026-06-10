import { NextResponse } from "next/server";
import { extractBearerToken } from "@/lib/desktop/session-auth";
import { QUICK_ACTIONS } from "@/lib/notification/command-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const token = extractBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Missing session token" }, { status: 401 });
    }

    const body = await request.json();
    const actionId = body.action_id as string | undefined;
    const notificationId =
      typeof body.notification_id === "string" ? body.notification_id : null;

    if (!actionId || !(QUICK_ACTIONS as readonly string[]).includes(actionId)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("desktop_perform_quick_action", {
      p_token: token,
      p_action_id: actionId,
      p_notification_id: notificationId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to perform quick action" },
      { status: 500 }
    );
  }
}
