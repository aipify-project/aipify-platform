import { NextResponse } from "next/server";
import {
  addAipifyHostsGuestNote,
  updateAipifyHostsGuestRequestStatus,
} from "@/lib/core/aipify-hosts-guest-center";
import { parseAipifyHostsGuestCenterActionResult } from "@/lib/aipify/aipify-hosts-guest-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      guest_id?: string;
      note_text?: string;
      request_id?: string;
      status?: string;
    };

    let data: Record<string, unknown>;
    switch (body.action) {
      case "add_note":
        if (!body.guest_id || !body.note_text?.trim()) {
          return NextResponse.json({ error: "guest_id and note_text required" }, { status: 400 });
        }
        data = await addAipifyHostsGuestNote(supabase, body.guest_id, body.note_text.trim());
        break;
      case "update_request_status":
        if (!body.request_id || !body.status) {
          return NextResponse.json({ error: "request_id and status required" }, { status: 400 });
        }
        data = await updateAipifyHostsGuestRequestStatus(supabase, body.request_id, body.status);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(parseAipifyHostsGuestCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
