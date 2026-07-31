/**
 * Fail-closed website publish/rollback approval scope helpers.
 * Server SQL remains authoritative; these mirror required fields for planner/tests/UI.
 */

import { createHash } from "node:crypto";
import type { KompisOperatorToolKey } from "./tools-registry";
import { toolRequiresCoreApproval } from "./core-approval-policy";

export const APPROVAL_SCOPE_INCOMPLETE = "APPROVAL_SCOPE_INCOMPLETE";

export type WebsitePublishApprovalScope = {
  website_id: string;
  path: string;
  candidate_id: string;
  locale: string;
  expected_current_version_id: string;
  reason: string;
  action_checksum: string;
  idempotency_key: string;
};

export type WebsiteRollbackApprovalScope = {
  website_id: string;
  path: string;
  target_version_id: string;
  expected_current_version_id: string;
  locale?: string;
  reason: string;
  action_checksum: string;
  idempotency_key: string;
};

export function normalizeWebsitePath(path: unknown): string | null {
  if (typeof path !== "string") return null;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) return null;
  if (trimmed.includes("://") || trimmed.includes("..") || trimmed.includes("<")) return null;
  if (trimmed.length > 200) return null;
  if (trimmed === "/") return null; // homepage excluded from QA publish scope helpers
  return trimmed.replace(/\/{2,}/g, "/");
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim())
  );
}

function nonEmpty(value: unknown, max = 500): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

export function buildWebsiteActionChecksum(parts: {
  organizationId: string;
  runId: string;
  stepId: string;
  toolKey: string;
  websiteId: string;
  path: string;
  candidateOrTargetId: string;
  expectedCurrentVersionId: string;
  locale: string;
  reason: string;
}): string {
  const canonical = [
    parts.organizationId,
    parts.runId,
    parts.stepId,
    parts.toolKey,
    parts.websiteId,
    parts.path,
    parts.candidateOrTargetId,
    parts.expectedCurrentVersionId,
    parts.locale,
    parts.reason,
  ].join("|");
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

export function buildWebsiteApprovalIdempotencyKey(actionChecksum: string): string {
  return `kompis-core-approval:${actionChecksum}`;
}

export function validatePublishApprovalScope(
  scope: Record<string, unknown> | null | undefined,
):
  | { ok: true; scope: WebsitePublishApprovalScope }
  | { ok: false; errorCode: typeof APPROVAL_SCOPE_INCOMPLETE; missing: string[] } {
  const missing: string[] = [];
  const website_id = isUuid(scope?.website_id) ? String(scope!.website_id).trim() : null;
  const path = normalizeWebsitePath(scope?.path);
  const candidate_id = isUuid(scope?.candidate_id) ? String(scope!.candidate_id).trim() : null;
  const locale = nonEmpty(scope?.locale, 16);
  const expected_current_version_id = isUuid(scope?.expected_current_version_id)
    ? String(scope!.expected_current_version_id).trim()
    : null;
  const reason = nonEmpty(scope?.reason ?? scope?.internal_reason ?? scope?.internalReason, 500);
  const action_checksum = nonEmpty(scope?.action_checksum, 128);
  const idempotency_key = nonEmpty(scope?.idempotency_key, 160);

  if (!website_id) missing.push("website_id");
  if (!path) missing.push("path");
  if (!candidate_id) missing.push("candidate_id");
  if (!locale) missing.push("locale");
  if (!expected_current_version_id) missing.push("expected_current_version_id");
  if (!reason) missing.push("reason");
  if (!action_checksum) missing.push("action_checksum");
  if (!idempotency_key) missing.push("idempotency_key");

  if (missing.length > 0) {
    return { ok: false, errorCode: APPROVAL_SCOPE_INCOMPLETE, missing };
  }

  return {
    ok: true,
    scope: {
      website_id: website_id!,
      path: path!,
      candidate_id: candidate_id!,
      locale: locale!,
      expected_current_version_id: expected_current_version_id!,
      reason: reason!,
      action_checksum: action_checksum!,
      idempotency_key: idempotency_key!,
    },
  };
}

export function validateRollbackApprovalScope(
  scope: Record<string, unknown> | null | undefined,
):
  | { ok: true; scope: WebsiteRollbackApprovalScope }
  | { ok: false; errorCode: typeof APPROVAL_SCOPE_INCOMPLETE; missing: string[] } {
  const missing: string[] = [];
  const website_id = isUuid(scope?.website_id) ? String(scope!.website_id).trim() : null;
  const path = normalizeWebsitePath(scope?.path);
  const target_version_id = isUuid(scope?.target_version_id)
    ? String(scope!.target_version_id).trim()
    : null;
  const expected_current_version_id = isUuid(scope?.expected_current_version_id)
    ? String(scope!.expected_current_version_id).trim()
    : null;
  const reason = nonEmpty(scope?.reason ?? scope?.internal_reason ?? scope?.internalReason, 500);
  const action_checksum = nonEmpty(scope?.action_checksum, 128);
  const idempotency_key = nonEmpty(scope?.idempotency_key, 160);
  const locale = nonEmpty(scope?.locale, 16) ?? undefined;

  if (!website_id) missing.push("website_id");
  if (!path) missing.push("path");
  if (!target_version_id) missing.push("target_version_id");
  if (!expected_current_version_id) missing.push("expected_current_version_id");
  if (!reason) missing.push("reason");
  if (!action_checksum) missing.push("action_checksum");
  if (!idempotency_key) missing.push("idempotency_key");

  if (missing.length > 0) {
    return { ok: false, errorCode: APPROVAL_SCOPE_INCOMPLETE, missing };
  }

  return {
    ok: true,
    scope: {
      website_id: website_id!,
      path: path!,
      target_version_id: target_version_id!,
      expected_current_version_id: expected_current_version_id!,
      locale,
      reason: reason!,
      action_checksum: action_checksum!,
      idempotency_key: idempotency_key!,
    },
  };
}

export function validateCoreApprovalScopeForTool(
  toolKey: string,
  scope: Record<string, unknown> | null | undefined,
): { ok: true } | { ok: false; errorCode: typeof APPROVAL_SCOPE_INCOMPLETE; missing: string[] } {
  if (!toolRequiresCoreApproval(toolKey)) return { ok: true };
  if (toolKey === "website_publish_approved_draft") {
    const result = validatePublishApprovalScope(scope);
    return result.ok ? { ok: true } : result;
  }
  if (toolKey === "website_publish_rollback") {
    const result = validateRollbackApprovalScope(scope);
    return result.ok ? { ok: true } : result;
  }
  return { ok: false, errorCode: APPROVAL_SCOPE_INCOMPLETE, missing: ["tool"] };
}

export function isEmptySafeInput(safeInput: Record<string, unknown> | null | undefined): boolean {
  if (!safeInput || typeof safeInput !== "object") return true;
  return Object.keys(safeInput).length === 0;
}

export function coreToolRejectsEmptySafeInput(toolKey: KompisOperatorToolKey | string): boolean {
  return toolRequiresCoreApproval(toolKey);
}

/** Canonical Norwegian QA draft copy for the allowed CMS QA path. */
export const NORWEGIAN_QA_DRAFT = {
  path: "/aipify-cms-qa",
  locale: "no",
  title: "Verifisering av Aipify kundeleveranse",
  text:
    "Denne siden brukes til å kontrollere at Platform, APP og kundens nettsted fungerer sammen gjennom den ordinære leveransekjeden.",
} as const;

export function extractWebsiteContentHints(request: string): {
  path: string | null;
  locale: string | null;
  title: string | null;
  text: string | null;
  wantsDraft: boolean;
  wantsPreview: boolean;
  wantsPublish: boolean;
  isNorwegianQaUpdate: boolean;
} {
  const pathMatch = request.match(/(\/[a-z0-9][-a-z0-9_/]*)/i);
  const path = normalizeWebsitePath(pathMatch?.[1] ?? null);
  const wantsDraft = /utkast|draft|oppdater|update|lag\s+først/i.test(request);
  const wantsPreview = /forhåndsvis|preview/i.test(request);
  const wantsPublish = /publiser|publish|godkjenning/i.test(request);
  const mentionsNorwegian = /\bnorsk\b|\bno\b|norwegian/i.test(request);
  const isNorwegianQaUpdate =
    path === NORWEGIAN_QA_DRAFT.path &&
    (mentionsNorwegian || /kundeleveranse|verifiser|ordinære\s+leveransekjeden/i.test(request));

  return {
    path,
    locale: isNorwegianQaUpdate || mentionsNorwegian ? "no" : null,
    title: isNorwegianQaUpdate ? NORWEGIAN_QA_DRAFT.title : null,
    text: isNorwegianQaUpdate ? NORWEGIAN_QA_DRAFT.text : null,
    wantsDraft,
    wantsPreview,
    wantsPublish,
    isNorwegianQaUpdate,
  };
}
