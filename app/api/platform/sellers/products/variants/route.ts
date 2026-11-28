import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { failClosedJson } from "@/lib/certified-sales-partner";
import {
  loadProductVariantsBundle,
  parseVariantsJsonInput,
  persistProductVariantsToCore,
  probeVariantCommissionCoreRpcs,
} from "@/lib/product-catalog/variant-commission-core";
import { resolveVariantCommissionPersistCapability } from "@/lib/product-catalog/variant-commission-core-gate";
import { createClient } from "@/lib/supabase/server";

/**
 * Product variants + interval commission — Staging Core only.
 * Production remains fail-closed (no writes, no false success).
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const capability = resolveVariantCommissionPersistCapability();
    const url = new URL(request.url);
    if (url.searchParams.get("capability") === "1") {
      if (!capability.canAttemptPersist) {
        return NextResponse.json(
          {
            found: false,
            persist_enabled: false,
            reason: capability.reason,
            settlement_activated: false,
          },
          { status: capability.productionBound ? 403 : 503 },
        );
      }
      const probe = await probeVariantCommissionCoreRpcs(supabase);
      if ("ok" in probe && probe.ok === false) {
        return NextResponse.json(
          {
            found: false,
            persist_enabled: false,
            reason: probe.error,
            detail: probe.detail ?? null,
            settlement_activated: false,
          },
          { status: probe.error === "production_fail_closed" ? 403 : 503 },
        );
      }
      return NextResponse.json({
        found: true,
        persist_enabled: true,
        reason: capability.reason,
        settlement_activated: false,
      });
    }

    const productKey = (url.searchParams.get("product_key") ?? "").trim();
    if (!productKey) {
      return NextResponse.json({ error: "product_key_required" }, { status: 400 });
    }

    const loaded = await loadProductVariantsBundle(supabase, productKey);
    if (!loaded.ok) {
      const status =
        loaded.error === "production_fail_closed"
          ? 403
          : loaded.error === "forbidden" || loaded.error === "unauthorized"
            ? loaded.error === "unauthorized"
              ? 401
              : 403
            : 503;
      return NextResponse.json(
        {
          found: false,
          persist_enabled: false,
          error: loaded.error,
          detail: loaded.detail ?? null,
          settlement_activated: false,
        },
        { status },
      );
    }

    return NextResponse.json({
      found: true,
      persist_enabled: true,
      product_key: productKey,
      product_id: loaded.bundle.product_id ?? null,
      variants: loaded.variants,
      settlement_activated: false,
    });
  } catch {
    return NextResponse.json({ error: "variants_load_failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const capability = resolveVariantCommissionPersistCapability();
    if (!capability.canAttemptPersist) {
      return NextResponse.json(
        {
          found: false,
          persist_enabled: false,
          error: capability.productionBound ? "production_fail_closed" : "persist_env_disabled",
          settlement_activated: false,
        },
        { status: capability.productionBound ? 403 : 503 },
      );
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const productKey = String(body.product_key ?? body.productKey ?? "").trim();
    if (!productKey) {
      return NextResponse.json({ error: "product_key_required" }, { status: 400 });
    }

    const parsed = parseVariantsJsonInput(body.variants ?? body.variants_json);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await persistProductVariantsToCore(supabase, {
      productKey,
      variants: parsed.variants,
    });

    if (!result.ok) {
      if (
        result.error === "rpc_missing" ||
        result.error === "csp_backend_not_applied" ||
        result.error === "rpc_error" ||
        result.error === "forbidden" ||
        result.error === "unauthorized"
      ) {
        const closed = failClosedJson({
          ready: false,
          error: result.error,
          detail: result.detail,
        });
        return NextResponse.json(
          {
            ...closed.body,
            persist_enabled: false,
            settlement_activated: false,
          },
          { status: closed.status },
        );
      }
      const status =
        result.error === "production_fail_closed"
          ? 403
          : result.error === "product_id_required"
            ? 409
            : 400;
      return NextResponse.json(
        {
          found: false,
          persist_enabled: capability.canAttemptPersist,
          error: result.error,
          detail: result.detail ?? null,
          settlement_activated: false,
        },
        { status },
      );
    }

    return NextResponse.json({
      ok: true,
      found: true,
      persist_enabled: true,
      product_key: result.productKey,
      product_id: result.productId,
      variants_saved: result.variantsSaved,
      prices_saved: result.pricesSaved,
      commissions_saved: result.commissionsSaved,
      commissions_unchanged: result.commissionsUnchanged,
      settlement_activated: false,
    });
  } catch {
    return NextResponse.json({ error: "variants_persist_failed" }, { status: 500 });
  }
}
