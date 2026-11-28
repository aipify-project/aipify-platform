import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { validateProductMediaBytes } from "@/lib/product-catalog/product-media-bytes";
import {
  resolveProductMediaUploadGate,
} from "@/lib/product-catalog/product-media-upload-gate";
import {
  buildProductMediaObjectPath,
  PRODUCT_MEDIA_MAX_BYTES,
  PRODUCT_MEDIA_STORAGE_BUCKET,
  type ProductMediaKind,
} from "@/lib/product-catalog/product-media-storage-contract";
import { createClient } from "@/lib/supabase/server";

/**
 * Platform Product Center media upload — fail-closed until Staging activation env is set.
 * Uses authenticated session Storage upload (RLS / is_platform_admin) — no service-role bypass.
 * Does not register logo_path/hero_path (commit route does that after re-validation).
 * Feature owner: PLATFORM ADMIN.
 */

const NO_STORE = { "Cache-Control": "no-store" } as const;
const MAX_REQUEST_BYTES = PRODUCT_MEDIA_MAX_BYTES + 64 * 1024;

function fail(error: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error, ...extra }, { status, headers: NO_STORE });
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

    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
      return fail("too_large", 413);
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return fail("invalid_request", 400);
    }

    const productKeyRaw = form.get("product_key") ?? form.get("productKey");
    const kindRaw = form.get("kind");
    const file = form.get("file");
    const productKey =
      typeof productKeyRaw === "string" ? productKeyRaw.trim().toLowerCase() : "";
    const kind = typeof kindRaw === "string" ? kindRaw.trim().toLowerCase() : "";

    if (!productKey || !/^[a-z0-9_-]{1,64}$/.test(productKey)) {
      return fail("product_key_invalid", 400);
    }
    if (kind !== "logo" && kind !== "hero") {
      return fail("kind_invalid", 400);
    }
    if (!(file instanceof File)) {
      return fail("invalid_request", 400);
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const validation = validateProductMediaBytes(bytes, file.type || "");
    if (!validation.ok) {
      return fail(validation.code, validation.code === "too_large" ? 413 : 400);
    }

    const objectId = randomUUID();
    let path: string;
    try {
      path = buildProductMediaObjectPath({
        productKey,
        kind: kind as ProductMediaKind,
        objectId,
        mime: validation.mime,
      });
    } catch {
      return fail("path_invalid", 400);
    }

    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_MEDIA_STORAGE_BUCKET)
      .upload(path, bytes, {
        contentType: validation.mime,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      return fail("storage_unavailable", 503, { detail: uploadError.message });
    }

    return NextResponse.json(
      {
        ok: true,
        product_key: productKey,
        kind,
        path,
        mime: validation.mime,
        byte_size: validation.byteSize,
        registered: false,
        orphan_until_commit: true,
        note: "Object stored; call media/commit to register path. Prior objects are not deleted.",
      },
      { headers: NO_STORE },
    );
  } catch {
    return fail("upload_failed", 500);
  }
}
