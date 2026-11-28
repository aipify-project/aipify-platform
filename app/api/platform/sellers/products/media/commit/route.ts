import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc } from "@/lib/certified-sales-partner";
import { validateProductMediaBytes } from "@/lib/product-catalog/product-media-bytes";
import { PRODUCT_LOCALE_MEDIA_RPCS } from "@/lib/product-catalog/locale-media-core";
import { resolveProductMediaUploadGate } from "@/lib/product-catalog/product-media-upload-gate";
import {
  isProductMediaPath,
  PRODUCT_MEDIA_STORAGE_BUCKET,
} from "@/lib/product-catalog/product-media-storage-contract";
import { createClient } from "@/lib/supabase/server";

/**
 * Register a successfully uploaded object path on csp_sales_products.
 * Re-downloads bytes and re-validates magic/size before RPC — fail closed.
 * Never deletes prior objects (orphan-safe supersede by pointer).
 */

const NO_STORE = { "Cache-Control": "no-store" } as const;

function fail(error: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error, ...extra }, { status, headers: NO_STORE });
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const gate = resolveProductMediaUploadGate();
    if (!gate.uploadEnabled) {
      return fail("upload_activation_required", 403, {
        gate: gate.reason,
        production_upload_activated: false,
      });
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return fail("invalid_json", 400);
    }

    const productKey =
      typeof body.product_key === "string"
        ? body.product_key.trim().toLowerCase()
        : typeof body.productKey === "string"
          ? body.productKey.trim().toLowerCase()
          : "";
    const kind =
      typeof body.kind === "string" ? body.kind.trim().toLowerCase() : "";
    const path = typeof body.path === "string" ? body.path.trim() : "";

    if (!productKey || !/^[a-z0-9_-]{1,64}$/.test(productKey)) {
      return fail("product_key_invalid", 400);
    }
    if (kind !== "logo" && kind !== "hero") {
      return fail("kind_invalid", 400);
    }
    if (!isProductMediaPath(path) || !path.startsWith(`products/${productKey}/${kind}/`)) {
      return fail("path_invalid", 400);
    }

    const { data: blob, error: downloadError } = await supabase.storage
      .from(PRODUCT_MEDIA_STORAGE_BUCKET)
      .download(path);
    if (downloadError || !blob) {
      return fail("object_missing", 404, { detail: downloadError?.message });
    }

    const bytes = new Uint8Array(await blob.arrayBuffer());
    const declared =
      path.endsWith(".png")
        ? "image/png"
        : path.endsWith(".webp")
          ? "image/webp"
          : "image/jpeg";
    const validation = validateProductMediaBytes(bytes, declared);
    if (!validation.ok) {
      return fail("validation_failed", 400, { code: validation.code });
    }

    const payload =
      kind === "logo"
        ? { product_key: productKey, logo_path: path }
        : { product_key: productKey, hero_path: path };

    const result = await callCspRpc(supabase, PRODUCT_LOCALE_MEDIA_RPCS.setMediaPaths, {
      p_payload: payload,
    });
    if (!result.ready) {
      return fail(result.error ?? "media_path_rpc_unavailable", 503);
    }
    const root = asRecord(result.data);
    if (root.found === false) {
      return fail(String(root.error ?? "media_path_rejected"), root.error === "forbidden" ? 403 : 400);
    }

    return NextResponse.json(
      {
        ok: true,
        product_key: productKey,
        kind,
        path,
        registered: true,
        product: root.product ?? null,
      },
      { headers: NO_STORE },
    );
  } catch {
    return fail("commit_failed", 500);
  }
}
