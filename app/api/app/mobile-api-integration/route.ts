import { NextResponse } from "next/server";
import {
  getMobileApiIntegrationCenter,
  parseMobileApiIntegrationCenter,
} from "@/lib/mobile-api-integration";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getMobileApiIntegrationCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseMobileApiIntegrationCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load mobile API integration center" },
      { status: 500 },
    );
  }
}
