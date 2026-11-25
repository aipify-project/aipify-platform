import { NextResponse } from "next/server";
import {
  callCspRpc,
  evaluateSalesLinkGates,
  failClosedJson,
  normalizeChannel,
  parsePartnerOverview,
} from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

/**
 * Issue a personal product/channel link.
 *
 * Gates (partner approved, product published, certification passed, agreement) are DERIVED SERVER-SIDE
 * from `csp_get_partner_overview`. Any gate flags in the request body are ignored. `product_id` may be
 * the Core product id or a product key (e.g. `kompis_web`).
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as {
      product_id?: unknown;
      product_key?: unknown;
      channel?: unknown;
    };

    const productRef =
      typeof body.product_id === "string" && body.product_id.trim()
        ? body.product_id.trim()
        : typeof body.product_key === "string"
          ? body.product_key.trim()
          : "";
    if (!productRef) {
      return NextResponse.json({ error: "product_id_required" }, { status: 400 });
    }

    const channel = normalizeChannel(typeof body.channel === "string" ? body.channel : undefined);
    const overview = await callCspRpc(supabase, "csp_get_partner_overview");
    if (!overview.ready) {
      const closed = failClosedJson(overview);
      return NextResponse.json(closed.body, { status: closed.status });
    }

    const evaluation = evaluateSalesLinkGates(parsePartnerOverview(overview.data), productRef);
    if (!evaluation.allowed || !evaluation.productId) {
      return NextResponse.json({ error: "sales_link_gates_not_met", gates: evaluation.gates }, { status: 403 });
    }

    const created = await callCspRpc(supabase, "csp_create_attribution_link", {
      p_product_id: evaluation.productId,
      p_channel: channel,
    });
    if (!created.ready) {
      const closed = failClosedJson(created);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json(created.data);
  } catch {
    return NextResponse.json({ error: "link_create_failed" }, { status: 500 });
  }
}
