import { NextResponse } from "next/server";
import { parseExecutiveDecisionSupportCenter } from "@/lib/executive-decision-support";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_executive_decision_support_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseExecutiveDecisionSupportCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Decision Center" }, { status: 500 });
  }
}
