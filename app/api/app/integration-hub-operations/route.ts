import { NextResponse } from "next/server";
import { getIntegrationHubCenter, parseIntegrationHubCenter } from "@/lib/integration-hub-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getIntegrationHubCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseIntegrationHubCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load integration hub" }, { status: 500 });
  }
}
