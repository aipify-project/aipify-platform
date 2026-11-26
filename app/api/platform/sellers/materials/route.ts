import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Platform Admin — list materials including unpublished drafts. */
export async function GET() {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const result = await callCspRpc(supabase, "csp_list_sales_materials", {
      p_include_unpublished: true,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status, headers: NO_STORE });
    }

    const data = (result.data ?? {}) as { materials?: unknown[] };
    const materials = Array.isArray(data.materials) ? data.materials : [];
    return NextResponse.json(
      { found: true, backend_ready: true, rows: materials, materials },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ error: "materials_load_failed" }, { status: 500, headers: NO_STORE });
  }
}

/** Platform Admin — upsert draft (never auto-publishes). */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const body = (await request.json().catch(() => null)) as {
      action?: string;
      material_id?: string;
      material_key?: string;
      category?: string;
      title?: string;
      asset_path?: string;
      product_keys?: string[];
      locales?: string[];
      description?: string;
      mime_hint?: string;
      version?: string;
      change_note?: string;
    } | null;

    const action = typeof body?.action === "string" ? body.action.trim() : "upsert";

    if (action === "publish" || action === "withdraw") {
      const materialId = typeof body?.material_id === "string" ? body.material_id.trim() : "";
      if (!materialId) {
        return NextResponse.json({ error: "material_id_required" }, { status: 400, headers: NO_STORE });
      }
      const rpc = action === "publish" ? "csp_publish_sales_material" : "csp_withdraw_sales_material";
      const result = await callCspRpc(supabase, rpc, { p_material_id: materialId });
      if (!result.ready) {
        const closed = failClosedJson(result);
        return NextResponse.json(closed.body, { status: closed.status, headers: NO_STORE });
      }
      return NextResponse.json(result.data, { headers: NO_STORE });
    }

    const materialKey = typeof body?.material_key === "string" ? body.material_key.trim() : "";
    const category = typeof body?.category === "string" ? body.category.trim() : "";
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const assetPath = typeof body?.asset_path === "string" ? body.asset_path.trim() : "";
    if (!materialKey || !category || !title || !assetPath) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400, headers: NO_STORE });
    }

    const result = await callCspRpc(supabase, "csp_upsert_sales_material", {
      p_material_key: materialKey,
      p_category: category,
      p_title: title,
      p_asset_path: assetPath,
      p_product_keys: Array.isArray(body?.product_keys) ? body.product_keys : [],
      p_locales: Array.isArray(body?.locales) ? body.locales : [],
      p_description: typeof body?.description === "string" ? body.description : null,
      p_mime_hint: typeof body?.mime_hint === "string" ? body.mime_hint : null,
      p_version: typeof body?.version === "string" ? body.version : "1.0",
      p_change_note: typeof body?.change_note === "string" ? body.change_note : null,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status, headers: NO_STORE });
    }
    return NextResponse.json(result.data, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "materials_write_failed" }, { status: 500, headers: NO_STORE });
  }
}
