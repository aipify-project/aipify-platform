/**
 * Core product channel reads — fail-closed when RPC/schema missing.
 * Never invent publish_app / publish_sale from registry as Core truth.
 */
import { callCspRpc, type CspRpcClient } from "@/lib/certified-sales-partner/core-rpc";
import type { CoreSalesProductRow } from "./merge";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asBool(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

export function parseCoreSalesProductRow(raw: unknown): CoreSalesProductRow | null {
  const row = asRecord(raw);
  const id = asString(row.id) ?? asString(row.product_id);
  const productKey = asString(row.product_key) ?? asString(row.productKey);
  if (!id || !productKey) return null;

  const publishSale = asBool(row.publish_sale) ?? asBool(row.publishSale);
  const publishApp = asBool(row.publish_app) ?? asBool(row.publishApp);
  const published = asBool(row.published) ?? publishSale ?? false;

  return {
    id,
    productKey: productKey.toLowerCase(),
    title: asString(row.title),
    currency: asString(row.currency),
    fixedCommissionAmount: asNumber(row.fixed_commission_amount ?? row.fixedCommissionAmount),
    published,
    publishSale,
    publishApp,
    updatedAt: asString(row.updated_at ?? row.updatedAt),
  };
}

export type LoadCoreProductsResult =
  | { ok: true; channelSchema: boolean; products: CoreSalesProductRow[] }
  | { ok: false; reason: "missing" | "forbidden" | "error"; detail?: string };

/** Platform overview products[] (includes commission — Platform Admin only). */
export function parsePlatformOverviewProducts(payload: unknown): CoreSalesProductRow[] {
  const root = asRecord(payload);
  const list = Array.isArray(root.products) ? root.products : [];
  return list.map(parseCoreSalesProductRow).filter((row): row is CoreSalesProductRow => Boolean(row));
}

/**
 * APP store Core rows — strips commission even if a future RPC misbehaves.
 * Returns ok:false when channel schema / RPC is missing (caller keeps honest fallback).
 */
export async function loadAppStoreCoreProducts(
  supabase: CspRpcClient,
): Promise<LoadCoreProductsResult> {
  const result = await callCspRpc(supabase, "csp_list_app_store_products");
  if (!result.ready) {
    if (result.error === "rpc_missing" || result.error === "csp_backend_not_applied") {
      return { ok: false, reason: "missing", detail: result.detail };
    }
    if (result.error === "forbidden" || result.error === "unauthorized") {
      return { ok: false, reason: "forbidden", detail: result.detail };
    }
    return { ok: false, reason: "error", detail: result.detail };
  }

  const root = asRecord(result.data);
  if (root.error === "channel_schema_missing" || root.channel_schema === false) {
    return { ok: false, reason: "missing", detail: "channel_schema_missing" };
  }
  if (root.found === false) {
    return { ok: false, reason: "error", detail: String(root.error ?? "not_found") };
  }

  const list = Array.isArray(root.products) ? root.products : [];
  const products = list
    .map(parseCoreSalesProductRow)
    .filter((row): row is CoreSalesProductRow => Boolean(row))
    .map((row) => ({
      ...row,
      // APP surface must never carry partner commission.
      fixedCommissionAmount: null,
      currency: null,
      publishApp: true,
      publishSale: null,
      published: false,
    }));

  return { ok: true, channelSchema: root.channel_schema === true, products };
}
