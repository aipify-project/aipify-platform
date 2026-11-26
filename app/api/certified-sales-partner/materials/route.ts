import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Published sales materials only (Core enforces publish gate).
 * Partners cannot request unpublished drafts.
 */
export async function GET(request: Request) {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;

    const productKey = new URL(request.url).searchParams.get("product_key");
    const result = await callCspRpc(gate.access.supabase, "csp_list_sales_materials", {
      p_include_unpublished: false,
      p_product_key: productKey && productKey.trim() ? productKey.trim() : null,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status, headers: NO_STORE });
    }
    return NextResponse.json(result.data ?? { found: true, materials: [] }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "materials_load_failed" }, { status: 500, headers: NO_STORE });
  }
}
