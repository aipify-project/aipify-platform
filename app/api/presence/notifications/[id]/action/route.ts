import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { NOTIFICATION_ACTION_TYPES } from "@/lib/presence/notifications";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const actionType = body.action_type as string | undefined;

    if (
      !actionType ||
      !(NOTIFICATION_ACTION_TYPES as readonly string[]).includes(actionType)
    ) {
      return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("perform_presence_notification_action", {
      p_notification_id: id,
      p_action_type: actionType,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to perform notification action" },
      { status: 500 }
    );
  }
}
