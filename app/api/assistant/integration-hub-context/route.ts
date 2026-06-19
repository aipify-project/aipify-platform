import { NextResponse } from "next/server";
import { getCompanionIntegrationHubContext } from "@/lib/integration-hub-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getCompanionIntegrationHubContext(
      supabase,
      url.searchParams.get("q") ?? undefined,
      url.searchParams.get("connector_id") ?? undefined,
    );
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load context" }, { status: 500 });
  }
}
