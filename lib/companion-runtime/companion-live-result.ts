import type { CompanionToolDispatchResult } from "./companion-tool-dispatch";
import type { CompanionToolFreshness } from "./companion-tool-definition";
import { sanitizeToolOutput } from "./companion-tool-definition";
import type { CompanionLiveQueryMatch } from "./companion-query-match";

export type CompanionLiveCompleteness = "complete" | "partial" | "missing";
export type CompanionLivePermissionStatus = "allowed" | "denied";

export type CompanionLiveResult = {
  capability_id: string;
  entity: string | null;
  operation: "read";
  data: Record<string, unknown>;
  summary_fields: string[];
  source: string;
  provider_key: string;
  checked_at: string | null;
  freshness: CompanionToolFreshness;
  permission_status: CompanionLivePermissionStatus;
  completeness: CompanionLiveCompleteness;
  warnings: string[];
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveCompleteness(
  summaryFields: string[],
  expectedFields: string[],
): CompanionLiveCompleteness {
  if (summaryFields.length === 0) return "missing";
  if (expectedFields.length === 0) return summaryFields.length > 0 ? "complete" : "missing";
  if (summaryFields.length >= expectedFields.length) return "complete";
  return "partial";
}

export function normalizeCompanionLiveResult(
  dispatchResult: Extract<CompanionToolDispatchResult, { ok: true }>,
  match: CompanionLiveQueryMatch,
): CompanionLiveResult {
  const data = sanitizeToolOutput(dispatchResult.data);
  const expectedFields = dispatchResult.tool.output_schema.fields.map((field) => field.name);
  const summaryFields = expectedFields.filter((field) => data[field] !== undefined);
  const checkedAt =
    str(data.checked_at) ||
    str(data.last_verified_at) ||
    str(data.last_used_at) ||
    null;

  const warnings: string[] = [];
  if (dispatchResult.freshness === "stale") warnings.push("stale");
  if (resolveCompleteness(summaryFields, expectedFields) === "partial") {
    warnings.push("partial");
  }

  return {
    capability_id: dispatchResult.tool.capability_id,
    entity: match.entity,
    operation: "read",
    data,
    summary_fields: summaryFields,
    source: dispatchResult.tool.source_label,
    provider_key: dispatchResult.tool.provider_key,
    checked_at: checkedAt,
    freshness: dispatchResult.freshness,
    permission_status: dispatchResult.tool.enabled ? "allowed" : "denied",
    completeness: resolveCompleteness(summaryFields, expectedFields),
    warnings,
  };
}

export function createEmptyCompanionLiveResult(
  overrides?: Partial<CompanionLiveResult>,
): CompanionLiveResult {
  return {
    capability_id: "",
    entity: null,
    operation: "read",
    data: {},
    summary_fields: [],
    source: "",
    provider_key: "",
    checked_at: null,
    freshness: "unknown",
    permission_status: "denied",
    completeness: "missing",
    warnings: [],
    ...overrides,
  };
}
