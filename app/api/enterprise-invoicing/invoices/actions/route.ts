import { NextResponse } from "next/server";
import { parseEnterpriseInvoice } from "@/lib/enterprise-invoicing";
import { INVOICE_ACTIONS } from "@/lib/enterprise-invoicing/constants";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = String(body.action ?? "");

    if (!INVOICE_ACTIONS.includes(action as (typeof INVOICE_ACTIONS)[number])) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("enterprise_invoice_action", {
      p_payload: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseEnterpriseInvoice(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Invoice action failed" }, { status: 500 });
  }
}
