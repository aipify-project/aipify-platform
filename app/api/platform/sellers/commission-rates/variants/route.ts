import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { listVariantCommissionRatesFromCore } from "@/lib/product-catalog/variant-commission-core";
import { resolveVariantCommissionPersistCapability } from "@/lib/product-catalog/variant-commission-core-gate";
import { createClient } from "@/lib/supabase/server";

/**
 * Shared variant commission list for Provisjonspriser.
 * Same Core source as product editor. Production fail-closed.
 */
export async function GET(request: Request) {
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
          reason: capability.reason,
          rows: [],
          settlement_activated: false,
        },
        { status: capability.productionBound ? 403 : 503 },
      );
    }

    const url = new URL(request.url);
    const productIdRaw = (url.searchParams.get("product_id") ?? "").trim();
    const productId = productIdRaw || null;

    const listed = await listVariantCommissionRatesFromCore(supabase, productId);
    if (!listed.ok) {
      const status =
        listed.error === "production_fail_closed"
          ? 403
          : listed.error === "forbidden"
            ? 403
            : listed.error === "unauthorized"
              ? 401
              : 503;
      return NextResponse.json(
        {
          found: false,
          persist_enabled: false,
          error: listed.error,
          detail: listed.detail ?? null,
          rows: [],
          settlement_activated: false,
        },
        { status },
      );
    }

    return NextResponse.json({
      found: true,
      persist_enabled: true,
      rows: listed.rows,
      settlement_activated: false,
    });
  } catch {
    return NextResponse.json(
      { found: false, error: "variant_commission_rates_load_failed", rows: [] },
      { status: 500 },
    );
  }
}
