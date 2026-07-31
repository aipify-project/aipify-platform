import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { parseRuntimeStatusRpc } from "@/lib/customer-website-runtime";

const headers = { "Cache-Control": "no-store" };

/** GET — customer-safe Website Runtime Delivery readiness for the active APP tenant. */
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

    const { data, error } = await supabase.rpc("get_customer_website_runtime_status");
    if (error) {
      return NextResponse.json(
        { error: "Runtime status unavailable.", code: "runtime_status_failed" },
        { status: 400, headers },
      );
    }
    return NextResponse.json({ status: parseRuntimeStatusRpc(data) }, { headers });
  } catch {
    return NextResponse.json(
      { error: "Runtime status unavailable.", code: "unknown" },
      { status: 500, headers },
    );
  }
}
