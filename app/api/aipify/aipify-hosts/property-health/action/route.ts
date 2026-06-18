import { NextResponse } from "next/server";
import { performAipifyHostsPropertyHealthAction } from "@/lib/core/aipify-hosts-property-health";
import { parseAipifyHostsPropertyHealthActionResult } from "@/lib/aipify/aipify-hosts-property-health/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      property_id?: string;
      recommendation_id?: string;
      risk_id?: string;
      notes?: string;
      override_score?: number;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performAipifyHostsPropertyHealthAction(supabase, {
      actionType: body.action_type,
      propertyId: body.property_id,
      recommendationId: body.recommendation_id,
      riskId: body.risk_id,
      notes: body.notes,
      overrideScore: body.override_score,
    });

    return NextResponse.json(parseAipifyHostsPropertyHealthActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
