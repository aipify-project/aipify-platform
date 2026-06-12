import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("record_companion_heartbeat", {
      p_device_id: body.device_id ?? "web-default",
      p_connection_status: body.connection_status ?? "online",
      p_current_activity: body.current_activity ?? null,
      p_metadata: body.metadata ?? {},
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to record companion heartbeat" },
      { status: 500 }
    );
  }
}
