import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QUICK_ACTIONS } from "@/lib/notification/command-center";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actionId = body.action_id as string | undefined;
    const notificationId =
      typeof body.notification_id === "string" ? body.notification_id : null;

    if (!actionId || !(QUICK_ACTIONS as readonly string[]).includes(actionId)) {
      return NextResponse.json({ error: "Invalid quick action" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("perform_presence_quick_action", {
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
