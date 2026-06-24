import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BULK_ACTIONS = new Set(["mark_all_read", "archive_all_read"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actionType = body.action_type as string | undefined;

    if (!actionType || !BULK_ACTIONS.has(actionType)) {
      return NextResponse.json({ error: "Invalid bulk action type" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("perform_presence_notification_bulk_action", {
      p_action_type: actionType,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to perform bulk notification action" }, { status: 500 });
  }
}
