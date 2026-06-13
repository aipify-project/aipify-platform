import { NextResponse } from "next/server";
import { parseApprovalProfilesCenter } from "@/lib/approval-profiles";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_approval_profiles_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseApprovalProfilesCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Approval Profiles center" }, { status: 500 });
  }
}
