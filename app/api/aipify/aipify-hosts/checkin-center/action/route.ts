import { NextResponse } from "next/server";
import { performAipifyHostsCheckinAction } from "@/lib/core/aipify-hosts-checkin-center";
import { parseAipifyHostsCheckinCenterActionResult } from "@/lib/aipify/aipify-hosts-checkin-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      record_type?: string;
      record_id?: string;
      notes?: string;
      departure_outcome?: string;
      damage?: boolean;
      missing?: boolean;
      maintenance?: boolean;
      exceptional?: boolean;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performAipifyHostsCheckinAction(supabase, {
      actionType: body.action_type,
      recordType: body.record_type,
      recordId: body.record_id,
      notes: body.notes,
      departureOutcome: body.departure_outcome,
      damage: body.damage,
      missing: body.missing,
      maintenance: body.maintenance,
      exceptional: body.exceptional,
    });

    return NextResponse.json(parseAipifyHostsCheckinCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
