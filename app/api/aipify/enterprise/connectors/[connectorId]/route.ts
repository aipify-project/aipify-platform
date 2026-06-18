import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseEnterpriseConnectors } from "@/lib/aipify/enterprise/parse";

type RouteContext = { params: Promise<{ connectorId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { connectorId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.rpc("update_enterprise_connector", {
      p_connector_key: connectorId,
      p_patch: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ connectors: parseEnterpriseConnectors(data) });
  } catch {
    return NextResponse.json({ error: "Failed to update connector" }, { status: 500 });
  }
}
