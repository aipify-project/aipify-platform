import { NextRequest, NextResponse } from "next/server";
import {
  getDeveloperEcosystemPortal,
  parseDeveloperPortalCenter,
} from "@/lib/platform-developer-ecosystem";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const section = request.nextUrl.searchParams.get("section") ?? "overview";
    const data = await getDeveloperEcosystemPortal(supabase, section);
    return NextResponse.json(parseDeveloperPortalCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load Developer Portal" },
      { status: 500 }
    );
  }
}
