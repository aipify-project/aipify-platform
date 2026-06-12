import { NextResponse } from "next/server";
import { parseDigitalRoseResult } from "@/lib/aipify/gratitude-recognition-engine";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const recipientLabel =
      typeof body.recipient_label === "string"
        ? body.recipient_label
        : typeof body.recipient_display_label === "string"
          ? body.recipient_display_label
          : "";
    const messageSummary =
      typeof body.message_summary === "string" ? body.message_summary : "";

    const { data, error } = await supabase.rpc("send_digital_rose_recognition", {
      p_recipient_label: recipientLabel,
      p_message_summary: messageSummary,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDigitalRoseResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to send digital rose" }, { status: 500 });
  }
}
