import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      partner_type?: string;
      partner_display_name?: string;
      governance_tier?: string;
      participation_agreement?: Record<string, unknown>;
    };

    if (!body.partner_type || !body.partner_display_name) {
      return NextResponse.json({ error: "partner_type and partner_display_name required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_joint_operations_partnership", {
      p_partner_type: body.partner_type,
      p_partner_display_name: body.partner_display_name,
      p_governance_tier: body.governance_tier ?? "standard",
      p_participation_agreement: body.participation_agreement ?? {},
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data });
  } catch {
    return NextResponse.json({ error: "Failed to create partnership" }, { status: 500 });
  }
}
