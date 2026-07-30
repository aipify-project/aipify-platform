import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { validateWebsiteCmsDraftIds } from "./schema";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export type BuildCandidateInput = {
  draftIds: string[];
  locales: string[];
  expectedDraftVersions?: Record<string, number>;
  internalReason: string;
  idempotencyKey: string;
};

export type BuildCandidateResult =
  | {
      ok: true;
      candidateId: string;
      versionNumber: number;
      contentChecksum: string;
      manifestChecksum: string;
      idempotentReplay: boolean;
    }
  | { ok: false; errorCode: string };

/** Pure pre-flight validation, mirrored authoritatively by the candidate-build RPC. */
export function validateBuildCandidateInput(
  input: Pick<BuildCandidateInput, "draftIds" | "locales">,
): { ok: true } | { ok: false; errorCode: string } {
  const draftCheck = validateWebsiteCmsDraftIds(input.draftIds);
  if (!draftCheck.ok) return { ok: false, errorCode: draftCheck.errorCode };
  if (!Array.isArray(input.locales) || input.locales.length < 1) {
    return { ok: false, errorCode: "invalid_locales" };
  }
  return { ok: true };
}

export async function buildWebsiteCandidateFromDrafts(
  supabase: SupabaseClient,
  input: BuildCandidateInput,
): Promise<BuildCandidateResult> {
  const preflight = validateBuildCandidateInput(input);
  if (!preflight.ok) return preflight;

  const { data, error } = await supabase.rpc("build_customer_website_candidate_from_drafts", {
    p_draft_ids: input.draftIds,
    p_locales: input.locales,
    p_expected_draft_versions: input.expectedDraftVersions ?? {},
    p_internal_reason: input.internalReason,
    p_idempotency_key: input.idempotencyKey,
  });

  if (error) {
    return { ok: false, errorCode: mapCandidateErrorCode(error.message) };
  }

  const row = asRecord(data);
  return {
    ok: true,
    candidateId: String(row.id ?? ""),
    versionNumber: Number(row.version_number ?? 0),
    contentChecksum: typeof row.content_checksum === "string" ? row.content_checksum : "",
    manifestChecksum: typeof row.manifest_checksum === "string" ? row.manifest_checksum : "",
    idempotentReplay: row.idempotent_replay === true,
  };
}

function mapCandidateErrorCode(message: string): string {
  const known = [
    "WEBSITE_NOT_PROVISIONED",
    "INVALID_DRAFT_IDS",
    "INVALID_LOCALES",
    "INVALID_OR_INACTIVE_LOCALE",
    "DRAFT_NOT_FOUND",
    "INVALID_DRAFT_KIND",
    "DRAFT_VERSION_CONFLICT",
    "FORBIDDEN_MARKUP",
    "INVALID_PAGE_PATH",
    "NO_CONTENT_TO_PUBLISH",
    "INVALID_INTERNAL_REASON",
    "INVALID_IDEMPOTENCY_KEY",
    "KOMPIS_UNAVAILABLE",
  ];
  const match = known.find((code) => message.includes(code));
  return match ? match.toLowerCase() : "candidate_build_failed";
}
