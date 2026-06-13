import { NextResponse } from "next/server";
import { parseApprovalHumanOversightCenter } from "@/lib/approval-human-oversight";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_approval_human_oversight_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseApprovalHumanOversightCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Approval Center" }, { status: 500 });
  }
}
