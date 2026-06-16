import { NextResponse } from "next/server";
import { performAipifyHostsMaintenanceAction } from "@/lib/core/aipify-hosts-maintenance-center";
import { parseAipifyHostsMaintenanceCenterActionResult } from "@/lib/aipify/aipify-hosts-maintenance-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      work_order_id?: string;
      contractor_id?: string;
      priority?: string;
      scheduled_at?: string;
      notes?: string;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performAipifyHostsMaintenanceAction(supabase, {
      actionType: body.action_type,
      workOrderId: body.work_order_id,
      contractorId: body.contractor_id,
      priority: body.priority,
      scheduledAt: body.scheduled_at,
      notes: body.notes,
    });

    return NextResponse.json(parseAipifyHostsMaintenanceCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
