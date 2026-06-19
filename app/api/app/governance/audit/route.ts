import { NextResponse } from "next/server";
import { searchGovernanceAudit } from "@/lib/governance-management";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await searchGovernanceAudit(supabase, {
      user_id: url.searchParams.get("user_id") ?? undefined,
      department_id: url.searchParams.get("department_id") ?? undefined,
      business_pack_key: url.searchParams.get("business_pack_key") ?? undefined,
      domain_id: url.searchParams.get("domain_id") ?? undefined,
      event_category: url.searchParams.get("event_category") ?? undefined,
      event_type: url.searchParams.get("event_type") ?? undefined,
      from: url.searchParams.get("from") ?? undefined,
      to: url.searchParams.get("to") ?? undefined,
      limit: url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 50,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Search failed" }, { status: 500 });
  }
}
