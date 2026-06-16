import { NextResponse } from "next/server";
import { performGrowthPartnerPortalAction } from "@/lib/core/growth-partner-portal";
import { parseGrowthPartnerPortalActionResult } from "@/lib/growth-partner-portal";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      entity_id?: string;
      status?: string;
      email?: string;
      name?: string;
      role?: string;
      notes?: string;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performGrowthPartnerPortalAction(supabase, {
      actionType: body.action_type,
      entityId: body.entity_id,
      status: body.status,
      email: body.email,
      name: body.name,
      role: body.role,
      notes: body.notes,
    });

    return NextResponse.json(parseGrowthPartnerPortalActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
