import { NextResponse } from "next/server";
import { getOrganizationManagementCenter, parseOrganizationManagementCenter } from "@/lib/organization-management";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await getOrganizationManagementCenter(supabase);
    return NextResponse.json(parseOrganizationManagementCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load organization" }, { status: 500 });
  }
}
