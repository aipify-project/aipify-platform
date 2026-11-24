import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

/** Platform product + fixed commission upsert — fail-closed until Core RPCs exist. */
export async function GET() {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;
    const result = await callCspRpc(supabase, "csp_get_platform_overview");
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "products_load_failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const body = (await request.json()) as {
      product_key?: string;
      title?: string;
      currency?: string;
      fixed_commission_amount?: number;
      published?: boolean;
    };

    if (!body.product_key || !body.title || !body.currency) {
      return NextResponse.json({ error: "product_fields_required" }, { status: 400 });
    }
    if (!/^[A-Z]{3}$/.test(body.currency.toUpperCase())) {
      return NextResponse.json({ error: "currency_invalid" }, { status: 400 });
    }
    if (typeof body.fixed_commission_amount !== "number" || body.fixed_commission_amount < 0) {
      return NextResponse.json({ error: "fixed_commission_required" }, { status: 400 });
    }

    const result = await callCspRpc(supabase, "csp_upsert_sales_product", {
      p_product_key: body.product_key,
      p_title: body.title,
      p_currency: body.currency.toUpperCase(),
      p_fixed_commission_amount: body.fixed_commission_amount,
      p_published: body.published === true,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "product_upsert_failed" }, { status: 500 });
  }
}
