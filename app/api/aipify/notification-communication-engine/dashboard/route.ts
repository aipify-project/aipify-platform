import { NextResponse } from "next/server";
import { parseNotificationCommunicationEngineDashboard } from "@/lib/aipify/notification-communication-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_notification_communication_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseNotificationCommunicationEngineDashboard(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to load notification communication dashboard" },
      { status: 500 }
    );
  }
}
