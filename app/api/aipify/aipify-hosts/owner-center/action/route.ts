import { NextResponse } from "next/server";
import { performAipifyHostsOwnerAction } from "@/lib/core/aipify-hosts-owner-center";
import { parseAipifyHostsOwnerCenterActionResult } from "@/lib/aipify/aipify-hosts-owner-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      block_id?: string;
      property_id?: string;
      start_date?: string;
      end_date?: string;
      block_type?: string;
      notes?: string;
      override_type?: string;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performAipifyHostsOwnerAction(supabase, {
      actionType: body.action_type,
      blockId: body.block_id,
      propertyId: body.property_id,
      startDate: body.start_date,
      endDate: body.end_date,
      blockType: body.block_type,
      notes: body.notes,
      overrideType: body.override_type,
    });

    return NextResponse.json(parseAipifyHostsOwnerCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
