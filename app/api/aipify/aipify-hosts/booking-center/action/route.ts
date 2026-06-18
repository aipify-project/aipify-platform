import { NextResponse } from "next/server";
import { performAipifyHostsBookingAction } from "@/lib/core/aipify-hosts-booking-center";
import { parseAipifyHostsBookingCenterActionResult } from "@/lib/aipify/aipify-hosts-booking-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      reservation_id?: string;
      notes?: string;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performAipifyHostsBookingAction(supabase, {
      actionType: body.action_type,
      reservationId: body.reservation_id,
      notes: body.notes,
    });

    return NextResponse.json(parseAipifyHostsBookingCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
