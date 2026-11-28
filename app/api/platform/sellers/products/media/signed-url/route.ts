import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { createChannelProductMediaSignedUrl } from "@/lib/product-catalog/product-media-signed-url";
import { createClient } from "@/lib/supabase/server";

/**
 * Platform Admin preview signed URL for channel-registered media.
 * Still requires channel listing + registered path — no draft leak.
 */

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400, headers: NO_STORE });
    }

    const productKey =
      typeof body.product_key === "string"
        ? body.product_key.trim().toLowerCase()
        : typeof body.productKey === "string"
          ? body.productKey.trim().toLowerCase()
          : "";
    const locale =
      typeof body.locale === "string" ? body.locale.trim().toLowerCase() : "en";
    const channelRaw =
      typeof body.channel === "string" ? body.channel.trim().toLowerCase() : "";
    const kind =
      typeof body.kind === "string" ? body.kind.trim().toLowerCase() : "";

    if (!productKey || !/^[a-z0-9_-]{1,64}$/.test(productKey)) {
      return NextResponse.json({ ok: false, error: "product_key_invalid" }, { status: 400, headers: NO_STORE });
    }
    if (channelRaw !== "app" && channelRaw !== "sale") {
      return NextResponse.json({ ok: false, error: "channel_invalid" }, { status: 400, headers: NO_STORE });
    }
    if (kind !== "logo" && kind !== "hero") {
      return NextResponse.json({ ok: false, error: "kind_invalid" }, { status: 400, headers: NO_STORE });
    }

    const result = await createChannelProductMediaSignedUrl({
      supabase,
      productKey,
      locale,
      channel: channelRaw,
      kind,
    });

    if (!result.ok) {
      const status =
        result.reason === "forbidden"
          ? 403
          : result.reason === "not_listed" || result.reason === "content_missing" || result.reason === "path_not_registered"
            ? 404
            : 503;
      return NextResponse.json(
        { ok: false, error: result.reason, detail: result.detail },
        { status, headers: NO_STORE },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        url: result.url,
        path: result.path,
        expires_in: result.expiresIn,
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ ok: false, error: "signed_url_failed" }, { status: 500, headers: NO_STORE });
  }
}
