import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

/**
 * Platform Admin dual-channel flags (publish_app / publish_sale).
 * Fail-closed when RPC/schema missing — never invent Core writes.
 */
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

    const productKey =
      typeof body.product_key === "string"
        ? body.product_key
        : typeof body.productKey === "string"
          ? body.productKey
          : null;
    const productId =
      typeof body.product_id === "string"
        ? body.product_id
        : typeof body.productId === "string"
          ? body.productId
          : null;

    if (!productKey && !productId) {
      return NextResponse.json({ error: "product_required" }, { status: 400 });
    }

    const payload: Record<string, unknown> = {};
    if (productId) payload.product_id = productId;
    if (productKey) payload.product_key = productKey.toLowerCase();

    if (typeof body.publish_app === "boolean") payload.publish_app = body.publish_app;
    else if (typeof body.publishApp === "boolean") payload.publish_app = body.publishApp;

    if (typeof body.publish_sale === "boolean") payload.publish_sale = body.publish_sale;
    else if (typeof body.publishSale === "boolean") payload.publish_sale = body.publishSale;
    else if (typeof body.published === "boolean") payload.published = body.published;

    if (typeof body.master_active === "boolean") payload.master_active = body.master_active;
    else if (typeof body.masterActive === "boolean") payload.master_active = body.masterActive;

    if (
      payload.publish_app === undefined &&
      payload.publish_sale === undefined &&
      payload.published === undefined &&
      payload.master_active === undefined
    ) {
      return NextResponse.json({ error: "no_channel_fields" }, { status: 400 });
    }

    const result = await callCspRpc(supabase, "csp_set_product_channel_flags", {
      p_payload: payload,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "channel_update_failed" }, { status: 500 });
  }
}
