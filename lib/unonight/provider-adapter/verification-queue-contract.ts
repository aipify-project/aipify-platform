import type { DirectoryRelationshipType } from "@/lib/integration-intelligence/directory/relationship-types";
import {
  maskVerificationSubjectReference,
  stripForbiddenVerificationFields,
} from "@/lib/integration-intelligence/verification/masking";
import { normalizeVerificationStatus } from "@/lib/integration-intelligence/verification/status-normalization";
import type {
  VerificationCaseSummary,
  VerificationQueueSummary,
} from "@/lib/integration-intelligence/verification/types";
import { UNONIGHT_VERIFICATION_READINESS } from "./verification-source-map";

export type UnonightVerificationProxyRow = {
  id?: string;
  practice_key?: string;
  title?: string;
  summary?: string;
  practice_type?: string;
  moderation_status?: string;
  status_key?: string;
};

const FORBIDDEN_ROW_KEYS = [
  "document",
  "email",
  "phone",
  "full_name",
  "id_number",
  "moderator_note",
] as const;

function isPendingVerificationRow(row: UnonightVerificationProxyRow): boolean {
  const moderation = String(row.moderation_status ?? "").toLowerCase();
  const statusKey = String(row.status_key ?? "").toLowerCase();
  if (moderation === "pending") return true;
  return statusKey.includes("pending") || statusKey.includes("review");
}

function isNeedsInformationRow(row: UnonightVerificationProxyRow): boolean {
  const statusKey = String(row.status_key ?? "").toLowerCase();
  const practiceType = String(row.practice_type ?? "").toLowerCase();
  return (
    statusKey.includes("missing") ||
    statusKey.includes("information") ||
    practiceType.includes("needs_information")
  );
}

function isHighPriorityRow(row: UnonightVerificationProxyRow): boolean {
  const statusKey = String(row.status_key ?? "").toLowerCase();
  const practiceType = String(row.practice_type ?? "").toLowerCase();
  return statusKey.includes("high") || statusKey.includes("priority") || practiceType.includes("priority");
}

function resolveCaseId(row: UnonightVerificationProxyRow): string {
  return String(row.practice_key ?? row.id ?? "").trim();
}

function resolveRelationshipType(row: UnonightVerificationProxyRow): DirectoryRelationshipType {
  const practiceType = String(row.practice_type ?? "").toLowerCase();
  if (practiceType.includes("member")) return "member";
  if (practiceType.includes("lead")) return "lead";
  return "member";
}

function resolveMissingRequirements(row: UnonightVerificationProxyRow): readonly string[] {
  const status = normalizeVerificationStatus(row.status_key ?? row.moderation_status);
  if (status !== "needs_information") return [];
  return ["customerApp.companionPlatformKnowledge.verification.requirements.identityMetadata"];
}

export function mapUnonightVerificationProxyRow(
  row: UnonightVerificationProxyRow,
  input: {
    organization_id: string;
    source_reference: string;
    fetched_at: string;
  },
): VerificationCaseSummary | null {
  const sanitized = stripForbiddenVerificationFields(row as Record<string, unknown>);
  for (const key of FORBIDDEN_ROW_KEYS) {
    if (key in sanitized) return null;
  }

  const caseId = resolveCaseId(row);
  if (!caseId) return null;

  const status = normalizeVerificationStatus(row.moderation_status ?? row.status_key);
  const priority = isHighPriorityRow(row) ? "high" : status === "pending" ? "normal" : "low";

  return {
    case_id: caseId,
    subject_reference: maskVerificationSubjectReference(row.title ?? row.practice_key ?? caseId),
    relationship_type: resolveRelationshipType(row),
    status,
    priority,
    created_at: null,
    updated_at: null,
    assigned_role: null,
    missing_requirements: resolveMissingRequirements(row),
    source_reference: input.source_reference,
    freshness: "fresh",
    completeness: "partial",
    permission_scope: "case",
  };
}

export function buildUnonightVerificationQueueSummary(input: {
  rows: readonly UnonightVerificationProxyRow[];
  organization_id: string;
  source_reference: string;
  fetched_at: string;
}): VerificationQueueSummary {
  const pendingRows = input.rows.filter(isPendingVerificationRow);
  const needsInformation = pendingRows.filter(isNeedsInformationRow).length;
  const inReview = pendingRows.filter(
    (row) => normalizeVerificationStatus(row.moderation_status ?? row.status_key) === "in_review",
  ).length;
  const highPriority = pendingRows.filter(isHighPriorityRow).length;

  return {
    total_pending: pendingRows.length,
    needs_information: needsInformation,
    in_review: inReview > 0 ? inReview : pendingRows.length - needsInformation,
    high_priority: highPriority,
    oldest_pending_at: null,
    generated_at: input.fetched_at,
    source_reference: input.source_reference,
    freshness: "fresh",
    completeness: pendingRows.length > 0 ? "partial" : "empty",
    permission_scope: "queue",
  };
}

export function buildUnonightVerificationCasesFromProxy(input: {
  rows: readonly UnonightVerificationProxyRow[];
  organization_id: string;
  source_reference: string;
  fetched_at: string;
}): VerificationCaseSummary[] {
  return input.rows
    .filter(isPendingVerificationRow)
    .map((row) =>
      mapUnonightVerificationProxyRow(row, {
        organization_id: input.organization_id,
        source_reference: input.source_reference,
        fetched_at: input.fetched_at,
      }),
    )
    .filter((row): row is VerificationCaseSummary => row !== null);
}

export function findUnonightVerificationCaseById(input: {
  rows: readonly UnonightVerificationProxyRow[];
  case_id: string;
  organization_id: string;
  source_reference: string;
  fetched_at: string;
}): VerificationCaseSummary | null {
  const normalizedId = input.case_id.trim().toLowerCase();
  const match =
    input.rows.find((row) => resolveCaseId(row).toLowerCase() === normalizedId) ?? null;
  if (!match) return null;
  return mapUnonightVerificationProxyRow(match, {
    organization_id: input.organization_id,
    source_reference: input.source_reference,
    fetched_at: input.fetched_at,
  });
}

export const UNONIGHT_MEMBER_VERIFICATION_CONTRACT = {
  provider_key: "unonight_community_adapter",
  readiness: UNONIGHT_VERIFICATION_READINESS,
  auto_approve_blocked: true,
  auto_reject_blocked: true,
  document_exposure_blocked: true,
};
