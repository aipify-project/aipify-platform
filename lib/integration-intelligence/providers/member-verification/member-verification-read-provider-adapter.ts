import { maskVerificationSubjectReference } from "@/lib/integration-intelligence/verification/masking";
import { normalizeVerificationStatus } from "@/lib/integration-intelligence/verification/status-normalization";
import type {
  VerificationCaseSummary,
  VerificationQueueSummary,
} from "@/lib/integration-intelligence/verification/types";
import type { DirectoryRelationshipType } from "@/lib/integration-intelligence/directory/relationship-types";

export const MEMBER_VERIFICATION_READ_RPC = "get_customer_member_verification_center" as const;

export type MemberVerificationProviderRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export type MemberVerificationReadBundle = {
  source_exact: boolean;
  source_reference: string;
  queue: VerificationQueueSummary | null;
  cases: VerificationCaseSummary[];
  limitations: readonly string[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function asStringArray(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => String(entry));
}

function resolveRelationshipType(value: unknown): DirectoryRelationshipType {
  const raw = String(value ?? "member").toLowerCase();
  if (raw === "lead") return "lead";
  if (raw === "partner") return "partner";
  return "member";
}

function resolvePriority(value: unknown): "low" | "normal" | "high" | null {
  const raw = String(value ?? "normal").toLowerCase();
  if (raw === "low") return "low";
  if (raw === "high") return "high";
  if (raw === "normal") return "normal";
  return "normal";
}

function mapCaseRow(
  row: Record<string, unknown>,
  sourceReference: string,
  fetchedAt: string,
): VerificationCaseSummary | null {
  const caseId = String(row.case_id ?? "").trim();
  if (!caseId) return null;

  const status = normalizeVerificationStatus(String(row.status ?? "pending"));
  const completeness = "complete" as const;

  return {
    case_id: caseId,
    subject_reference: maskVerificationSubjectReference(String(row.subject_reference ?? caseId)),
    relationship_type: resolveRelationshipType(row.relationship_type),
    status,
    priority: resolvePriority(row.priority),
    created_at: row.created_at ? String(row.created_at) : null,
    updated_at: row.updated_at ? String(row.updated_at) : null,
    assigned_role: row.assigned_role ? String(row.assigned_role) : null,
    missing_requirements: asStringArray(row.missing_requirements),
    source_reference: sourceReference,
    freshness: "fresh",
    completeness,
    permission_scope: "case",
  };
}

function mapQueueSummary(
  queue: Record<string, unknown>,
  sourceReference: string,
  fetchedAt: string,
  completeness: "complete" | "empty",
): VerificationQueueSummary {
  return {
    total_pending: Number(queue.total_pending ?? 0),
    needs_information: Number(queue.needs_information ?? 0),
    in_review: Number(queue.in_review ?? 0),
    high_priority: Number(queue.high_priority ?? 0),
    oldest_pending_at: queue.oldest_pending_at ? String(queue.oldest_pending_at) : null,
    generated_at: fetchedAt,
    source_reference: sourceReference,
    freshness: "fresh",
    completeness,
    permission_scope: "queue",
  };
}

export function mapMemberVerificationCenterPayload(payload: unknown): MemberVerificationReadBundle {
  const record = asRecord(payload);
  const fetchedAt = new Date().toISOString();
  const sourceReference = MEMBER_VERIFICATION_READ_RPC;

  if (!record || record.found !== true) {
    return {
      source_exact: false,
      source_reference: sourceReference,
      queue: null,
      cases: [],
      limitations: ["member_verification_center_unavailable"],
    };
  }

  const completeness = record.completeness === "complete" ? "complete" : "empty";
  const queueRecord = asRecord(record.queue);
  const queue =
    queueRecord != null
      ? mapQueueSummary(queueRecord, sourceReference, fetchedAt, completeness)
      : null;

  const cases = asArray(record.cases)
    .map((row) => mapCaseRow(row, sourceReference, fetchedAt))
    .filter((row): row is VerificationCaseSummary => row !== null);

  const caseRecord = asRecord(record.case);
  if (caseRecord) {
    const mapped = mapCaseRow(caseRecord, sourceReference, fetchedAt);
    if (mapped) {
      return {
        source_exact: true,
        source_reference: sourceReference,
        queue,
        cases: [mapped],
        limitations: [],
      };
    }
  }

  return {
    source_exact: true,
    source_reference: sourceReference,
    queue,
    cases,
    limitations: [],
  };
}

export async function fetchMemberVerificationCenter(
  client: MemberVerificationProviderRpcClient,
  input?: { section?: string; case_id?: string | null },
): Promise<MemberVerificationReadBundle> {
  const { data, error } = await client.rpc(MEMBER_VERIFICATION_READ_RPC, {
    p_section: input?.section ?? "queue",
    p_case_id: input?.case_id ?? null,
  });

  if (error) {
    return {
      source_exact: false,
      source_reference: MEMBER_VERIFICATION_READ_RPC,
      queue: null,
      cases: [],
      limitations: [error.message],
    };
  }

  return mapMemberVerificationCenterPayload(data);
}
