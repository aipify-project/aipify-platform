import { NextResponse } from "next/server";
import { getLicenseSubscriptionCenter, parseLicenseSubscriptionCenter } from "@/lib/license-management";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getLicenseSubscriptionCenter(supabase);
    return NextResponse.json(parseLicenseSubscriptionCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load licenses" }, { status: 500 });
  }
}
