import { NextResponse } from "next/server";
import {
  callCspRpc,
  canIssueSalesLink,
  failClosedJson,
  normalizeChannel,
} from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

/** Issue personal product/channel link when partner+cert+product gates pass. */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      product_id?: string;
      channel?: string;
      partner_approved?: boolean;
      product_published?: boolean;
      certification_passed?: boolean;
      agreement_accepted?: boolean;
    };

    if (!body.product_id) {
      return NextResponse.json({ error: "product_id_required" }, { status: 400 });
    }

    const channel = normalizeChannel(body.channel);
    const overview = await callCspRpc(supabase, "csp_get_partner_overview");
    if (!overview.ready) {
      const closed = failClosedJson(overview);
      return NextResponse.json(closed.body, { status: closed.status });
    }

    const gates = canIssueSalesLink({
      partnerApproved: body.partner_approved === true,
      productPublished: body.product_published === true,
      certificationPassed: body.certification_passed === true,
      agreementAccepted: body.agreement_accepted === true,
    });
    if (!gates) {
      return NextResponse.json({ error: "sales_link_gates_not_met" }, { status: 403 });
    }

    const created = await callCspRpc(supabase, "csp_create_attribution_link", {
      p_product_id: body.product_id,
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
