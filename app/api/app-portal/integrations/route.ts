import { NextResponse } from "next/server";
import { parseAppPortalIntegrationsHub } from "@/lib/app-portal/integrations";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_app_portal_integrations_hub");
    if (error) return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    const parsed = parseAppPortalIntegrationsHub(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500, headers: NO_STORE });
    return NextResponse.json(parsed, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to load integrations hub" }, { status: 500, headers: NO_STORE });
  }
}
