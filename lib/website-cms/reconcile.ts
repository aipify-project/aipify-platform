import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { WebsiteCmsRuntimeVerification } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asVerification(value: unknown): WebsiteCmsRuntimeVerification {
  const row = asRecord(value);
  return {
    verified: row.verified === true,
    reason: typeof row.reason === "string" ? row.reason : "not_verified",
    domain: typeof row.domain === "string" ? row.domain : undefined,
    checkedAt: typeof row.checked_at === "string" ? row.checked_at : undefined,
  };
}

export type ReconcilePublishResult =
  | {
      ok: true;
      operationId: string;
      status: "pending_verification" | "active" | "attention" | "failed";
      runtimeVerification: WebsiteCmsRuntimeVerification;
    }
  | { ok: false; errorCode: string };

export async function reconcileWebsitePublish(
  supabase: SupabaseClient,
  operationId: string,
): Promise<ReconcilePublishResult> {
  const { data, error } = await supabase.rpc("reconcile_customer_website_publish", {
    p_operation_id: operationId,
  });

  if (error) {
    const code = /OPERATION_NOT_FOUND/.test(error.message)
      ? "operation_not_found"
      : "reconcile_failed";
    return { ok: false, errorCode: code };
  }

  const row = asRecord(data);
  const status =
    row.status === "active" || row.status === "attention" || row.status === "failed"
      ? row.status
      : "pending_verification";
  return {
    ok: true,
    operationId: String(row.operation_id ?? operationId),
    status,
    runtimeVerification: asVerification(row.runtime_verification),
  };
}

export async function platformReconcileWebsitePublish(
  supabase: SupabaseClient,
  organizationId: string,
  operationId: string,
): Promise<ReconcilePublishResult> {
  const { data, error } = await supabase.rpc("platform_reconcile_customer_website_publish", {
    p_organization_id: organizationId,
    p_operation_id: operationId,
  });

  if (error) {
    const code = /OPERATION_NOT_FOUND/.test(error.message)
      ? "operation_not_found"
      : /FORBIDDEN/.test(error.message)
        ? "forbidden"
        : "reconcile_failed";
    return { ok: false, errorCode: code };
  }

  const row = asRecord(data);
  const status =
    row.status === "active" || row.status === "attention" || row.status === "failed"
      ? row.status
      : "pending_verification";
  return {
    ok: true,
    operationId: String(row.operation_id ?? operationId),
    status,
    runtimeVerification: asVerification(row.runtime_verification),
  };
}
