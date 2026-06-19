import { NextResponse } from "next/server";
import { getGovernanceManagementCenter, parseGovernanceCenter } from "@/lib/governance-management";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getGovernanceManagementCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseGovernanceCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load governance" }, { status: 500 });
  }
}
