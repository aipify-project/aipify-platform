import type { DirectoryPermissionScope, DirectoryRecord, DirectorySearchFieldAccess } from "./types";

export function maskDirectoryEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const trimmed = email.trim();
  const [local, domain] = trimmed.split("@");
  if (!local || !domain) return null;
  if (local.length <= 1) return `*@${domain}`;
  return `${local[0]}${"*".repeat(Math.max(local.length - 1, 2))}@${domain}`;
}

export function maskDirectoryPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return null;
  return `${"*".repeat(Math.max(digits.length - 4, 0))}${digits.slice(-4)}`;
}

export function applyDirectoryRecordMasking(
  record: DirectoryRecord,
  scope: DirectoryPermissionScope,
): DirectoryRecord {
  if (scope === "sensitive") return record;
  if (scope === "contact") {
    return {
      ...record,
      email_masked: record.email_masked,
      phone_masked: record.phone_masked,
    };
  }
  return {
    ...record,
    email_masked: record.email_masked ? maskDirectoryEmail(record.email_masked) ?? record.email_masked : null,
    phone_masked: record.phone_masked ? maskDirectoryPhone(record.phone_masked) ?? record.phone_masked : null,
  };
}

export function resolveDirectoryFieldAccess(scope: DirectoryPermissionScope): DirectorySearchFieldAccess {
  switch (scope) {
    case "sensitive":
      return "directory.search.sensitive";
    case "contact":
      return "directory.search.contact";
    case "export":
      return "directory.export";
    default:
      return "directory.search.basic";
  }
}

export function filterDirectoryRecordsForScope(
  records: readonly DirectoryRecord[],
  scope: DirectoryPermissionScope,
): DirectoryRecord[] {
  return records.map((record) => applyDirectoryRecordMasking(record, scope));
}

/** Strip raw contact values before audit/logging — metadata only. */
export function sanitizeDirectoryRecordForAudit(record: DirectoryRecord): Record<string, unknown> {
  return {
    entity_id: record.entity_id,
    entity_type: record.entity_type,
    relationship_type: record.relationship_type,
    source_provider: record.source_provider,
    organization_id: record.organization_id,
    match_kind: record.match_kind,
    match_confidence: record.match_confidence,
    permission_scope: record.permission_scope,
    has_email: Boolean(record.email_masked),
    has_phone: Boolean(record.phone_masked),
  };
}
