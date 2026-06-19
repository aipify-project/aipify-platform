import { NextResponse } from "next/server";
import { getCommunicationManagementCenter, parseCommunicationManagementCenter } from "@/lib/communication-management";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await getCommunicationManagementCenter(supabase);
    return NextResponse.json(parseCommunicationManagementCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load communications" }, { status: 500 });
  }
}
