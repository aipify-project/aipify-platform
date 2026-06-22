import { randomUUID } from "node:crypto";
import { sanitizeDirectoryRecordForAudit } from "@/lib/integration-intelligence/directory/masking";
import type { DirectorySearchField, DirectorySearchQuery, DirectorySearchResult } from "@/lib/integration-intelligence/directory/types";
import { directoryOutcomeKey } from "@/lib/integration-intelligence/directory/outcomes";

export type DirectorySearchAuditEvent = {
  audit_id: string;
  organization_id: string;
  tenant_id: string;
  user_role: string;
  search_field: DirectorySearchField | null;
  relationship_type: string | null;
  outcome: DirectorySearchResult["outcome"];
  provider_keys: readonly string[];
  result_count: number;
  clarification_required: boolean;
  created_at: string;
  records: readonly Record<string, unknown>[];
};

const auditLog: DirectorySearchAuditEvent[] = [];

export function createDirectorySearchAuditEvent(input: {
  query: DirectorySearchQuery;
  user_role: string;
  outcome: DirectorySearchResult;
  provider_keys: readonly string[];
}): DirectorySearchAuditEvent {
  const event: DirectorySearchAuditEvent = {
    audit_id: randomUUID(),
    organization_id: input.query.organization_id,
    tenant_id: input.query.tenant_id,
    user_role: input.user_role,
    search_field: input.query.search_field,
    relationship_type: input.query.relationship_type,
    outcome: input.outcome.outcome,
    provider_keys: input.provider_keys,
    result_count: input.outcome.records.length,
    clarification_required: input.outcome.clarification_required,
    created_at: new Date().toISOString(),
    records: input.outcome.records.map(sanitizeDirectoryRecordForAudit),
  };
  auditLog.push(event);
  return event;
}

export function listDirectorySearchAuditEvents(organizationId: string): readonly DirectorySearchAuditEvent[] {
  return auditLog.filter((event) => event.organization_id === organizationId);
}

export function resetDirectorySearchAuditLogForTests(): void {
  auditLog.length = 0;
}

export function buildDirectoryOutcomeMessageKey(result: DirectorySearchResult): string | null {
  return result.outcome_key ?? directoryOutcomeKey(result.outcome);
}
