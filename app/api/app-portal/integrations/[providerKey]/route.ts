import { NextResponse } from "next/server";
import { parseAppPortalIntegrationSetup } from "@/lib/app-portal/integrations";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

type RouteContext = { params: Promise<{ providerKey: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { providerKey } = await context.params;
    const mode = new URL(request.url).searchParams.get("mode");
    const previewMode = mode === "preview";
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_app_portal_integration_setup", {
      p_provider_key: providerKey,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    const parsed = parseAppPortalIntegrationSetup(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500, headers: NO_STORE });
    // Preview is read-only: never expose a persisted installation session for mutation.
    if (previewMode) {
      return NextResponse.json(
        { ...parsed, installation_session: null, preview_mode: true },
        { headers: NO_STORE }
      );
    }
    return NextResponse.json(parsed, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to load integration setup" }, { status: 500, headers: NO_STORE });
  }
}
