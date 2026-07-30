import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { WebsiteStagingRunSummary, WebsiteStagingRuntimeVerification } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asStringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asObjectArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(asRecord) : [];
}

export function mapWebsiteStagingRuntimeVerification(raw: unknown): WebsiteStagingRuntimeVerification | undefined {
  const row = asRecord(raw);
  if (row.verified === undefined) return undefined;
  return {
    verified: row.verified === true,
    reason: typeof row.reason === "string" ? row.reason : "unknown",
    domain: typeof row.domain === "string" ? row.domain : undefined,
    checkedAt: typeof row.checked_at === "string" ? row.checked_at : undefined,
  };
}

export function mapWebsiteStagingRunSnapshot(raw: unknown): WebsiteStagingRunSummary {
  const row = asRecord(raw);
  return {
    id: String(row.id ?? ""),
    environmentId: String(row.environment_id ?? ""),
    organizationId: String(row.organization_id ?? ""),
    websiteId: asStringOrNull(row.website_id),
    fixtureId: asStringOrNull(row.fixture_id),
    status: (row.status as WebsiteStagingRunSummary["status"]) ?? "pending",
    currentPhase: (row.current_phase as WebsiteStagingRunSummary["currentPhase"]) ?? "initialized",
    baselineVersionId: asStringOrNull(row.baseline_version_id),
    firstCandidateId: asStringOrNull(row.first_candidate_id),
    firstPublishOperationId: asStringOrNull(row.first_publish_operation_id),
    secondCandidateId: asStringOrNull(row.second_candidate_id),
    secondPublishOperationId: asStringOrNull(row.second_publish_operation_id),
    rollbackOperationId: asStringOrNull(row.rollback_operation_id),
    previewRefs: asObjectArray(row.preview_refs),
    expectedChecksums: asRecord(row.expected_checksums),
    actualChecksums: asRecord(row.actual_checksums),
    safeErrorCode: asStringOrNull(row.safe_error_code),
    startedAt: asStringOrNull(row.started_at),
    completedAt: asStringOrNull(row.completed_at),
    idempotencyKey: typeof row.idempotency_key === "string" ? row.idempotency_key : "",
    createdAt: asStringOrNull(row.created_at),
    updatedAt: asStringOrNull(row.updated_at),
    idempotentReplay: typeof row.idempotent_replay === "boolean" ? row.idempotent_replay : undefined,
    runtimeVerification: mapWebsiteStagingRuntimeVerification(row.runtime_verification),
  };
}

export type WebsiteStagingRpcResult<T> =
  | { ok: true; value: T }
  | { ok: false; errorCode: string; rawMessage: string };

export async function startWebsiteReleaseVerificationRun(
  supabase: SupabaseClient,
  input: {
    environmentId: string;
    fixtureId: string;
    internalReason: string;
    confirmation: boolean;
    idempotencyKey: string;
  },
): Promise<WebsiteStagingRpcResult<WebsiteStagingRunSummary>> {
  const { data, error } = await supabase.rpc("start_website_release_verification_run", {
    p_environment_id: input.environmentId,
    p_fixture_id: input.fixtureId,
    p_internal_reason: input.internalReason,
    p_confirmation: input.confirmation,
    p_idempotency_key: input.idempotencyKey,
  });
  if (error) {
    return { ok: false, errorCode: "start_run_failed", rawMessage: error.message };
  }
  return { ok: true, value: mapWebsiteStagingRunSnapshot(data) };
}

export async function getWebsiteReleaseVerificationRun(
  supabase: SupabaseClient,
  runId: string,
): Promise<WebsiteStagingRpcResult<WebsiteStagingRunSummary>> {
  const { data, error } = await supabase.rpc("get_website_release_verification_run", { p_run_id: runId });
  if (error) {
    return { ok: false, errorCode: "get_run_failed", rawMessage: error.message };
  }
  return { ok: true, value: mapWebsiteStagingRunSnapshot(data) };
}

export async function resumeWebsiteReleaseVerificationRun(
  supabase: SupabaseClient,
  runId: string,
): Promise<WebsiteStagingRpcResult<WebsiteStagingRunSummary>> {
  const { data, error } = await supabase.rpc("resume_website_release_verification_run", { p_run_id: runId });
  if (error) {
    return { ok: false, errorCode: "resume_run_failed", rawMessage: error.message };
  }
  return { ok: true, value: mapWebsiteStagingRunSnapshot(data) };
}
