import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import {
  parseTaxonomyFromCoreRow,
  toTaxonomyRpcArgs,
  validateProductTaxonomyInput,
} from "@/lib/product-catalog/product-taxonomy";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Product Center taxonomy — Feature owner: PLATFORM ADMIN.
 * Write: csp_set_app_store_product_taxonomy only (no client table writes).
 * Read: platform-admin gated service-role column read (overview RPC lacks taxonomy fields).
 * Never flips publish_app / publish_sale.
 */

function productKeyFrom(bodyOrParams: Record<string, unknown> | URLSearchParams): string | null {
  if (bodyOrParams instanceof URLSearchParams) {
    const raw = bodyOrParams.get("product_key") ?? bodyOrParams.get("productKey");
    return typeof raw === "string" ? raw.trim().toLowerCase() : null;
  }
  const raw = bodyOrParams.product_key ?? bodyOrParams.productKey;
  return typeof raw === "string" ? raw.trim().toLowerCase() : null;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const url = new URL(request.url);
    const productKey = productKeyFrom(url.searchParams);
    if (!productKey || !/^[a-z0-9_-]{1,64}$/.test(productKey)) {
      return NextResponse.json({ found: false, error: "product_key_invalid" }, { status: 400 });
    }

    let admin;
    try {
      admin = createServiceRoleClient();
    } catch {
      return NextResponse.json(
        { found: false, error: "taxonomy_read_unavailable", backend_ready: true },
        { status: 503 },
      );
    }

    const { data, error } = await admin
      .from("csp_sales_products")
      .select("product_key, product_type, category_id, depends_on_product_keys, publish_app, publish_sale, master_active")
      .eq("product_key", productKey)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { found: false, error: "taxonomy_read_failed", detail: error.message },
        { status: 503 },
      );
    }
    if (!data) {
      return NextResponse.json({ found: false, error: "not_found" }, { status: 404 });
    }

    const taxonomy = parseTaxonomyFromCoreRow(data as Record<string, unknown>);
    return NextResponse.json({
      found: true,
      dependency_semantics: "all",
      taxonomy,
      publish_app: data.publish_app === true,
      publish_sale: data.publish_sale === true,
      master_active: data.master_active === true,
    });
  } catch {
    return NextResponse.json({ found: false, error: "taxonomy_load_failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ found: false, error: "invalid_json" }, { status: 400 });
    }

    const validated = validateProductTaxonomyInput({
      productKey: body.product_key ?? body.productKey,
      productType: body.product_type ?? body.productType,
      categoryId: body.category_id ?? body.categoryId,
      dependsOnProductKeys: body.depends_on_product_keys ?? body.dependsOnProductKeys,
    });
    if (!validated.ok) {
      return NextResponse.json(
        { found: false, error: validated.error, field: validated.field ?? null },
        { status: 400 },
      );
    }

    const result = await callCspRpc(supabase, "csp_set_app_store_product_taxonomy", {
      ...toTaxonomyRpcArgs(validated.payload),
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }

    const data = result.data as Record<string, unknown>;
    if (data && typeof data === "object" && data.found === false) {
      return NextResponse.json(
        {
          found: false,
          error: typeof data.error === "string" ? data.error : "taxonomy_save_failed",
          backend_ready: true,
        },
        { status: data.error === "forbidden" ? 403 : data.error === "not_found" ? 404 : 400 },
      );
    }

    const product =
      data && typeof data === "object" && data.product && typeof data.product === "object"
        ? (data.product as Record<string, unknown>)
        : null;
    const taxonomy = product
      ? parseTaxonomyFromCoreRow(product)
      : validated.payload;

    return NextResponse.json({
      found: true,
      dependency_semantics: "all",
      taxonomy,
      product,
    });
  } catch {
    return NextResponse.json({ found: false, error: "taxonomy_save_failed" }, { status: 500 });
  }
}
