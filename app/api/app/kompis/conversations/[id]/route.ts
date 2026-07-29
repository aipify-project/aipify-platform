import { NextResponse } from "next/server";
import { mapKompisOperatorRpcError, isUuid } from "@/lib/kompis-operator/parse";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { createClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "no-store" };

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!isUuid(id ?? "")) {
      return NextResponse.json({ error: "Invalid id.", code: "invalid_input" }, { status: 400, headers });
    }
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }
    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;
    const { data, error } = await supabase.rpc("get_app_kompis_operator_conversation", {
      p_id: id,
    });
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Unable to load conversation.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    return NextResponse.json(data, { headers });
  } catch {
    return NextResponse.json({ error: "Unable to load conversation.", code: "unknown" }, { status: 500, headers });
  }
}
