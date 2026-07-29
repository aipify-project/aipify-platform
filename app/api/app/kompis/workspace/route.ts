import { NextResponse } from "next/server";
import { mapKompisOperatorRpcError, parseWorkspace } from "@/lib/kompis-operator/parse";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { createClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }
    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data, error } = await supabase.rpc("get_app_kompis_operator_workspace");
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Unable to load Kompis workspace.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    const parsed = parseWorkspace(data);
    if (!parsed) {
      return NextResponse.json({ error: "Unable to load Kompis workspace.", code: "unknown" }, { status: 500, headers });
    }
    return NextResponse.json(parsed, { headers });
  } catch {
    return NextResponse.json({ error: "Unable to load Kompis workspace.", code: "unknown" }, { status: 500, headers });
  }
}
