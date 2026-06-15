import { NextResponse } from "next/server";
import { performAipifyHostsGuestExperienceAction } from "@/lib/core/aipify-hosts-guest-experience";
import { parseAipifyHostsGuestExperienceActionResult } from "@/lib/aipify/aipify-hosts-guest-experience";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      recovery_id?: string;
      property_id?: string;
      assigned_owner?: string;
      notes?: string;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performAipifyHostsGuestExperienceAction(supabase, {
      actionType: body.action_type,
      recoveryId: body.recovery_id,
      propertyId: body.property_id,
      assignedOwner: body.assigned_owner,
      notes: body.notes,
    });

    return NextResponse.json(parseAipifyHostsGuestExperienceActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
