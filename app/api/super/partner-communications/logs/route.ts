import { NextResponse } from "next/server";
import {
  getSuperPartnerCommunicationLogs,
  processPartnerCommunicationOutbox,
  resendSuperPartnerCommunicationEmail,
} from "@/lib/core/partner-communications-email";
import { parseSuperPartnerEmailLogs } from "@/lib/partner-communications-email";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? 100);
    const data = await getSuperPartnerCommunicationLogs(supabase, limit);
    return NextResponse.json({ logs: parseSuperPartnerEmailLogs(data) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load email logs";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { action?: string; log_id?: string };
    if (body.action === "process") {
      const result = await processPartnerCommunicationOutbox(supabase, 50);
      return NextResponse.json(result);
    }
    if (body.action === "resend" && body.log_id) {
      const data = await resendSuperPartnerCommunicationEmail(supabase, body.log_id);
      await processPartnerCommunicationOutbox(supabase, 5).catch(() => undefined);
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update email logs";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
