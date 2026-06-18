import { NextResponse } from "next/server";
import { getCustomerLicenseDashboard, parseCustomerLicenseDashboard } from "@/lib/app-store";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCustomerLicenseDashboard(supabase);
    return NextResponse.json(parseCustomerLicenseDashboard(data) ?? { found: false });
  } catch {
    return NextResponse.json({ error: "Failed to load license dashboard" }, { status: 500 });
  }
}
