/**
 * Fail-closed caller for Unified Seller Bridge RPCs.
 * Missing/unapplied Core returns ready:false — never invents a bridge.
 */
import { UNIFIED_SELLER_BRIDGE_RPC } from "./constants";
import {
  parseUnifiedSellerEnsureResult,
  parseUnifiedSellerSalesLinks,
  type UnifiedSellerEnsureResult,
  type UnifiedSellerSalesLinks,
} from "./parse";

export type BridgeRpcClient = {
  rpc: (
    name: string,
    args?: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: { code?: string; message?: string } | null }>;
};

export type BridgeRpcNotReadyReason = "rpc_missing" | "rpc_error" | "unauthorized" | "forbidden";

export type BridgeRpcResult<T> =
  | { ready: false; error: BridgeRpcNotReadyReason; detail?: string }
  | { ready: true; data: T };

function isMissingRpc(code?: string, message?: string): boolean {
  const m = (message ?? "").toLowerCase();
  return code === "PGRST202" || m.includes("does not exist") || m.includes("could not find the function");
}

async function callBridgeRpc<T>(
  supabase: BridgeRpcClient,
  rpcName: string,
  args: Record<string, unknown> | undefined,
  parse: (data: unknown) => T,
): Promise<BridgeRpcResult<T>> {
  try {
    const { data, error } = await supabase.rpc(rpcName, args ?? {});
    if (error) {
      const message = error.message ?? "";
      if (isMissingRpc(error.code, message)) {
        return { ready: false, error: "rpc_missing", detail: message || error.code };
      }
      const lower = message.trim().toLowerCase();
      if (lower === "unauthorized" || lower.includes("authentication required")) {
        return { ready: false, error: "unauthorized", detail: message };
      }
      if (lower === "forbidden" || lower.includes("platform admin required")) {
        return { ready: false, error: "forbidden", detail: message };
      }
      return { ready: false, error: "rpc_error", detail: message || error.code };
    }
    const parsed = parse(data);
    if (
      parsed &&
      typeof parsed === "object" &&
      "ok" in (parsed as object) &&
      (parsed as { ok?: unknown }).ok === false
    ) {
      const err = (parsed as { error?: unknown }).error;
      if (typeof err === "string" && err.toLowerCase() === "unauthorized") {
        return { ready: false, error: "unauthorized", detail: err };
      }
      if (typeof err === "string" && err.toLowerCase() === "forbidden") {
        return { ready: false, error: "forbidden", detail: err };
      }
    }
    return { ready: true, data: parsed };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    if (isMissingRpc(undefined, message)) {
      return { ready: false, error: "rpc_missing", detail: message };
    }
    return { ready: false, error: "rpc_error", detail: message };
  }
}

export function getOwnUnifiedSellerSalesLinks(
  supabase: BridgeRpcClient,
): Promise<BridgeRpcResult<UnifiedSellerSalesLinks>> {
  return callBridgeRpc(supabase, UNIFIED_SELLER_BRIDGE_RPC.getOwnLinks, undefined, parseUnifiedSellerSalesLinks);
}

export function ensureOwnGrowthPartnerAppProfileFromCsp(
  supabase: BridgeRpcClient,
): Promise<BridgeRpcResult<UnifiedSellerEnsureResult>> {
  return callBridgeRpc(supabase, UNIFIED_SELLER_BRIDGE_RPC.ensureOwn, undefined, parseUnifiedSellerEnsureResult);
}

export function ensureGrowthPartnerAppProfileForCspPartner(
  supabase: BridgeRpcClient,
  cspPartnerId: string,
): Promise<BridgeRpcResult<UnifiedSellerEnsureResult>> {
  return callBridgeRpc(
    supabase,
    UNIFIED_SELLER_BRIDGE_RPC.ensureForCsp,
    { p_csp_partner_id: cspPartnerId },
    parseUnifiedSellerEnsureResult,
  );
}