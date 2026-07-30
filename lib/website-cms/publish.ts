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

/** Idempotency keys use a stable prefix so replay detection and audit filtering stay unambiguous. */
export function createWebsitePublishIdempotencyKey(): string {
  return `wcp-${randomSuffix()}`;
}

export function createWebsiteRollbackIdempotencyKey(): string {
  return `wcr-${randomSuffix()}`;
}

function randomSuffix(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

/** Validates the shape used by both publish and rollback idempotency keys. */
export function isValidWebsiteCmsIdempotencyKey(key: unknown): key is string {
  return typeof key === "string" && key.length >= 8 && key.length <= 128;
}

export type PublishCandidateInput = {
  candidateId: string;
  expectedCurrentVersionId: string | null;
  internalReason: string;
  confirmation: boolean;
  idempotencyKey: string;
};

export type PublishCandidateResult =
  | {
      ok: true;
      operationId: string;
      status: "pending_verification" | "active" | "attention" | "failed";
      versionId?: string;
      versionNumber?: number;
      runtimeVerification: WebsiteCmsRuntimeVerification;
      idempotentReplay: boolean;
    }
  | { ok: false; errorCode: string };

export async function publishWebsiteCandidate(
  supabase: SupabaseClient,
  input: PublishCandidateInput,
): Promise<PublishCandidateResult> {
  if (!isValidWebsiteCmsIdempotencyKey(input.idempotencyKey)) {
    return { ok: false, errorCode: "invalid_idempotency_key" };
  }
  if (!input.confirmation) {
    return { ok: false, errorCode: "confirmation_required" };
  }

  const { data, error } = await supabase.rpc("publish_customer_website_candidate", {
    p_candidate_id: input.candidateId,
    p_expected_current_version_id: input.expectedCurrentVersionId,
    p_internal_reason: input.internalReason,
    p_confirmation: input.confirmation,
    p_idempotency_key: input.idempotencyKey,
  });

  if (error) {
    return { ok: false, errorCode: mapPublishErrorCode(error.message) };
  }

  const row = asRecord(data);
  const status =
    row.status === "active" || row.status === "attention" || row.status === "failed"
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

function mapPublishErrorCode(message: string): string {
  const known = [
    "WEBSITE_NOT_PROVISIONED",
    "CANDIDATE_NOT_FOUND",
    "CANDIDATE_NOT_PUBLISHABLE",
    "VERSION_CONFLICT",
    "PREVIEW_REQUIRED",
    "DELIVERY_NOT_ACKNOWLEDGED",
    "APPROVAL_ROLE_REQUIRED",
    "CONFIRMATION_REQUIRED",
    "INVALID_INTERNAL_REASON",
    "INVALID_IDEMPOTENCY_KEY",
    "KOMPIS_UNAVAILABLE",
  ];
  const match = known.find((code) => message.includes(code));
  return match ? match.toLowerCase() : "publish_failed";
}
