import { NextRequest, NextResponse } from "next/server";
import {
  getPlatformCustomerSuccessHubCenter,
  parsePlatformCustomerSuccessHubCenter,
} from "@/lib/platform-customer-success-hub";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = request.nextUrl.searchParams.get("section") ?? "overview";
    const data = await getPlatformCustomerSuccessHubCenter(supabase, section);
    const parsed = parsePlatformCustomerSuccessHubCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load customer success hub" },
      { status: 500 }
    );
  }
}
