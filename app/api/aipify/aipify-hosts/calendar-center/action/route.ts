import { NextResponse } from "next/server";
import {
  createAipifyHostsCalendarEvent,
  performAipifyHostsCalendarAction,
} from "@/lib/core/aipify-hosts-calendar-center";
import { parseAipifyHostsCalendarCenterActionResult } from "@/lib/aipify/aipify-hosts-calendar-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      title?: string;
      event_type?: string;
      start_date?: string;
      end_date?: string;
      property_id?: string;
      assigned_users?: string;
      internal_notes?: string;
      action_type?: string;
      block_id?: string;
      event_id?: string;
      notes?: string;
      reason?: string;
      default_view?: string;
    };

    let data: Record<string, unknown>;
    switch (body.action) {
      case "create_event":
        if (!body.title?.trim() || !body.event_type || !body.start_date || !body.end_date) {
          return NextResponse.json({ error: "title, event_type, start_date, end_date required" }, { status: 400 });
        }
        data = await createAipifyHostsCalendarEvent(supabase, {
          title: body.title.trim(),
          eventType: body.event_type,
          startDate: body.start_date,
          endDate: body.end_date,
          propertyId: body.property_id,
          assignedUsers: body.assigned_users,
          internalNotes: body.internal_notes,
        });
        break;
      case "calendar_action":
        if (!body.action_type) {
          return NextResponse.json({ error: "action_type required" }, { status: 400 });
        }
        data = await performAipifyHostsCalendarAction(supabase, {
          actionType: body.action_type,
          propertyId: body.property_id,
          startDate: body.start_date,
          endDate: body.end_date,
          blockId: body.block_id,
          eventId: body.event_id,
          notes: body.notes,
          reason: body.reason,
          defaultView: body.default_view,
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(parseAipifyHostsCalendarCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
