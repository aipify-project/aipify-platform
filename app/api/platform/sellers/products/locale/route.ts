import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc } from "@/lib/certified-sales-partner";
import {
  isProductContentLocale,
  PRODUCT_CONTENT_LOCALES,
  PRODUCT_LOCALE_MEDIA_RPCS,
  type ProductContentLocale,
  type ProductLocaleCopy,
} from "@/lib/product-catalog/locale-media-core";
import { createClient } from "@/lib/supabase/server";

/**
 * Product Center locale copy — Feature owner: PLATFORM ADMIN.
 * RPCs: csp_list_product_locale_copy / csp_upsert_product_locale_copy
 * Never auto-approves; never invents missing locales.
 */

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function parseLocaleCopy(raw: unknown, fallbackKey: string): ProductLocaleCopy | null {
  const row = asRecord(raw);
  const localeRaw = asString(row.locale);
  if (!localeRaw || !isProductContentLocale(localeRaw)) return null;
  const title = asString(row.title) ?? "";
  const description = asString(row.description) ?? "";
  const benefits = Array.isArray(row.benefits)
    ? row.benefits.filter((b): b is string => typeof b === "string").map((b) => b.trim()).filter(Boolean).slice(0, 12)
    : [];
  return {
    locale: localeRaw,
    title,
    tagline: asString(row.tagline),
    description,
    benefits,
    approved: row.approved === true,
    updatedAt: asString(row.updated_at ?? row.updatedAt),
  };
}

function productKeyFrom(input: URLSearchParams | Record<string, unknown>): string | null {
  if (input instanceof URLSearchParams) {
    const raw = input.get("product_key") ?? input.get("productKey");
    return typeof raw === "string" ? raw.trim().toLowerCase() : null;
  }
  const raw = input.product_key ?? input.productKey;
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

    const result = await callCspRpc(supabase, PRODUCT_LOCALE_MEDIA_RPCS.listLocale, {
      p_product_key: productKey,
    });
    if (!result.ready) {
      return NextResponse.json(
        {
          found: false,
          error: result.error ?? "locale_list_unavailable",
          backend_ready: result.error !== "rpc_missing" && result.error !== "csp_backend_not_applied",
        },
        { status: result.error === "forbidden" || result.error === "unauthorized" ? 401 : 503 },
      );
    }

    const root = asRecord(result.data);
    if (root.found === false) {
      const status = root.error === "forbidden" ? 403 : root.error === "not_found" ? 404 : 400;
      return NextResponse.json({ found: false, error: root.error ?? "not_found" }, { status });
    }

    const localesRaw = Array.isArray(root.locales) ? root.locales : Array.isArray(root.locale_copies) ? root.locale_copies : [];
    const locales: ProductLocaleCopy[] = [];
    for (const item of localesRaw) {
      const parsed = parseLocaleCopy(item, productKey);
      if (parsed) locales.push(parsed);
    }

    const missing = PRODUCT_CONTENT_LOCALES.filter(
      (code) => !locales.some((row) => row.locale === code),
    );

    return NextResponse.json({
      found: true,
      product_key: productKey,
      locales,
      missing_locales: missing,
      supported_locales: PRODUCT_CONTENT_LOCALES,
    });
  } catch {
    return NextResponse.json({ found: false, error: "locale_list_failed" }, { status: 500 });
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

    const productKey = productKeyFrom(body);
    const localeRaw = asString(body.locale);
    if (!productKey || !/^[a-z0-9_-]{1,64}$/.test(productKey)) {
      return NextResponse.json({ found: false, error: "product_key_invalid" }, { status: 400 });
    }
    if (!localeRaw || !isProductContentLocale(localeRaw)) {
      return NextResponse.json({ found: false, error: "locale_invalid" }, { status: 400 });
    }

    const title = asString(body.title);
    const description = asString(body.description);
    if (!title || title.length > 200) {
      return NextResponse.json({ found: false, error: "title_invalid" }, { status: 400 });
    }
    if (!description || description.length > 8000) {
      return NextResponse.json({ found: false, error: "description_invalid" }, { status: 400 });
    }

    const approved = body.approved === true;
    const benefits = Array.isArray(body.benefits)
      ? body.benefits.filter((b): b is string => typeof b === "string").map((b) => b.trim()).filter(Boolean).slice(0, 12)
      : [];

    const result = await callCspRpc(supabase, PRODUCT_LOCALE_MEDIA_RPCS.upsertLocale, {
      p_payload: {
        product_key: productKey,
        locale: localeRaw as ProductContentLocale,
        title,
        tagline: asString(body.tagline),
        description,
        benefits,
        approved,
      },
    });

    if (!result.ready) {
      return NextResponse.json(
        { found: false, error: result.error ?? "locale_upsert_unavailable" },
        { status: result.error === "forbidden" || result.error === "unauthorized" ? 403 : 503 },
      );
    }

    const root = asRecord(result.data);
    if (root.found === false) {
      return NextResponse.json(
        { found: false, error: root.error ?? "upsert_failed" },
        { status: root.error === "forbidden" ? 403 : 400 },
      );
    }

    const localeCopy = parseLocaleCopy(root.locale_copy ?? root.localeCopy ?? root, productKey);
    return NextResponse.json({
      found: true,
      product_key: productKey,
      locale_copy: localeCopy,
      approved,
    });
  } catch {
    return NextResponse.json({ found: false, error: "locale_upsert_failed" }, { status: 500 });
  }
}
