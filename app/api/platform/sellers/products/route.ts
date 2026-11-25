import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc, failClosedJson, validateSalesProductInput } from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

/** Platform Admin product catalogue for sale — fail-closed without Core CSP. */
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

/** Create or update a product for sale (fixed one-time commission amount, publish flag). */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const validated = validateSalesProductInput({
      productKey: body.product_key ?? body.productKey,
      title: body.title,
      currency: body.currency,
      fixedCommissionAmount: body.fixed_commission_amount ?? body.fixedCommissionAmount,
      published: body.published,
    });
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error, field: validated.field ?? null }, { status: 400 });
    }

    const result = await callCspRpc(supabase, "csp_upsert_sales_product", {
      p_product_key: validated.payload.productKey,
      p_title: validated.payload.title,
      p_currency: validated.payload.currency,
      p_fixed_commission_amount: validated.payload.fixedCommissionAmount,
      p_published: validated.payload.published,
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
