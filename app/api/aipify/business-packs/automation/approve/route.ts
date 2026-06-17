import { NextResponse } from "next/server";
import { parseAutomationApproveResult } from "@/lib/app-portal/business-pack-automation";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      automation_key?: string;
      governance_notes?: string;
      review_schedule?: string;
    };

    if (!body.automation_key) {
      return NextResponse.json({ error: "automation_key required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("approve_app_portal_business_pack_automation", {
      p_automation_key: body.automation_key,
      p_governance_notes: body.governance_notes ?? null,
      p_review_schedule: body.review_schedule ?? "quarterly",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseAutomationApproveResult(data));
  } catch {
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}
