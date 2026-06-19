import { NextResponse } from "next/server";
import { getUnifiedApprovalCenter, parseUnifiedApprovalCenter } from "@/lib/communication-management";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await getUnifiedApprovalCenter(supabase);
    return NextResponse.json(parseUnifiedApprovalCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load approvals" }, { status: 500 });
  }
}
