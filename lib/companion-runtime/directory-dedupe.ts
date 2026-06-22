import { normalizeDirectoryEmail, normalizeDirectoryOrganizationNumber, normalizeDirectoryPhone } from "@/lib/integration-intelligence/directory/normalization";
import type { DirectoryRecord } from "@/lib/integration-intelligence/directory/types";

export type DirectoryDedupeKey = {
  provider_external_id: string | null;
  normalized_email: string | null;
  normalized_phone: string | null;
  organization_number: string | null;
};

export function buildDirectoryDedupeKey(record: DirectoryRecord): DirectoryDedupeKey {
  return {
    provider_external_id: record.entity_id || null,
    normalized_email: record.email_masked ? normalizeDirectoryEmail(record.email_masked) : null,
    normalized_phone: record.phone_masked ? normalizeDirectoryPhone(record.phone_masked) : null,
    organization_number: record.organization_number
      ? normalizeDirectoryOrganizationNumber(record.organization_number)
      : null,
  };
}

function dedupeKeysEqual(a: DirectoryDedupeKey, b: DirectoryDedupeKey): boolean {
  if (a.provider_external_id && b.provider_external_id && a.provider_external_id === b.provider_external_id) {
    return true;
  }
  if (a.normalized_email && b.normalized_email && a.normalized_email === b.normalized_email) {
    return true;
  }
  if (a.normalized_phone && b.normalized_phone && a.normalized_phone === b.normalized_phone) {
    return true;
  }
  if (
    a.organization_number &&
    b.organization_number &&
    a.organization_number === b.organization_number
  ) {
    return true;
  }
  return false;
}

/** Merge cross-provider results within one tenant — never auto-merge on low confidence. */
export function dedupeDirectoryRecords(records: readonly DirectoryRecord[]): DirectoryRecord[] {
  const merged: DirectoryRecord[] = [];
  for (const record of records) {
    const key = buildDirectoryDedupeKey(record);
    const existingIndex = merged.findIndex((candidate) =>
      dedupeKeysEqual(key, buildDirectoryDedupeKey(candidate)),
    );
    if (existingIndex === -1) {
      merged.push(record);
      continue;
    }
    const existing = merged[existingIndex];
    if (record.match_confidence === "high" && existing.match_confidence !== "high") {
      merged[existingIndex] = record;
    }
  }
  return merged;
}
