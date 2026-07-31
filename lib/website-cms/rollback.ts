import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { WebsiteCmsRuntimeVerification } from "./types";
import { isValidWebsiteCmsIdempotencyKey } from "./publish";

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

export type RollbackVersionInput = {
  targetVersionId: string;
  expectedCurrentVersionId: string | null;
  internalReason: string;
  confirmation: boolean;
  idempotencyKey: string;
};

export type RollbackVersionResult =
  | {
      ok: true;
      operationId: string;
      status: "pending_verification" | "pending_runtime" | "active" | "attention" | "failed";
      versionId?: string;
      versionNumber?: number;
      runtimeVerification: WebsiteCmsRuntimeVerification;
      idempotentReplay: boolean;
    }
  | { ok: false; errorCode: string };

export async function rollbackWebsiteVersion(
  supabase: SupabaseClient,
  input: RollbackVersionInput,
): Promise<RollbackVersionResult> {
  if (!isValidWebsiteCmsIdempotencyKey(input.idempotencyKey)) {
    return { ok: false, errorCode: "invalid_idempotency_key" };
  }
  if (!input.confirmation) {
    return { ok: false, errorCode: "confirmation_required" };
  }

  const { data, error } = await supabase.rpc("rollback_customer_website_version", {
    p_target_version_id: input.targetVersionId,
    p_expected_current_version_id: input.expectedCurrentVersionId,
    p_internal_reason: input.internalReason,
    p_confirmation: input.confirmation,
    p_idempotency_key: input.idempotencyKey,
  });

  if (error) {
    return { ok: false, errorCode: mapRollbackErrorCode(error.message) };
  }

  const row = asRecord(data);
  const status =
    row.status === "active" ||
    row.status === "attention" ||
    row.status === "failed" ||
    row.status === "pending_runtime"
      ? row.status
      : "pending_verification";
  return {
    ok: true,
    operationId: String(row.operation_id ?? ""),
    status,
    versionId: typeof row.version_id === "string" ? row.version_id : undefined,
    versionNumber: typeof row.version_number === "number" ? row.version_number : undefined,
    runtimeVerification: asVerification(row.runtime_verification),
    idempotentReplay: row.idempotent_replay === true,
  };
}

function mapRollbackErrorCode(message: string): string {
  const known = [
    "WEBSITE_NOT_PROVISIONED",
    "TARGET_VERSION_NOT_FOUND",
    "TARGET_NOT_PUBLISHABLE_HISTORY",
    "TARGET_ALREADY_CURRENT",
    "VERSION_CONFLICT",
    "DELIVERY_NOT_ACKNOWLEDGED",
    "APPROVAL_ROLE_REQUIRED",
    "CONFIRMATION_REQUIRED",
    "INVALID_INTERNAL_REASON",
    "INVALID_IDEMPOTENCY_KEY",
    "KOMPIS_UNAVAILABLE",
  ];
  const match = known.find((code) => message.includes(code));
  return match ? match.toLowerCase() : "rollback_failed";
}
