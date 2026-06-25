import { NextResponse } from "next/server";
import { revalidateAppPortalIntegrationSurfaces } from "@/lib/app-portal/integrations/invalidate-server";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { connection_id?: string };
    if (!body.connection_id) {
      return NextResponse.json({ error: "connection_id required" }, { status: 400, headers: NO_STORE });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
    }

    const { data, error } = await supabase.rpc("remove_app_portal_integration_connection", {
      p_connection_id: body.connection_id,
    });

    if (error) {
      const message = error.message.toLowerCase();
      const status = message.includes("requires owner") || message.includes("permission") ? 403 : 400;
      return NextResponse.json({ error: "Removal could not be completed" }, { status, headers: NO_STORE });
    }

    revalidateAppPortalIntegrationSurfaces();
    return NextResponse.json(data, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Removal could not be completed" }, { status: 500, headers: NO_STORE });
  }
}
