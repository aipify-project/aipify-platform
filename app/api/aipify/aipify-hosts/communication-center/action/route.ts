import { NextResponse } from "next/server";
import { performAipifyHostsCommunicationAction } from "@/lib/core/aipify-hosts-communication-center";
import { parseAipifyHostsCommunicationCenterActionResult } from "@/lib/aipify/aipify-hosts-communication-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      comm_id?: string;
      comm_type?: string;
      template_id?: string;
      announcement_id?: string;
      notes?: string;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performAipifyHostsCommunicationAction(supabase, {
      actionType: body.action_type,
      commId: body.comm_id,
      commType: body.comm_type,
      templateId: body.template_id,
      announcementId: body.announcement_id,
      notes: body.notes,
    });

    return NextResponse.json(parseAipifyHostsCommunicationCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
