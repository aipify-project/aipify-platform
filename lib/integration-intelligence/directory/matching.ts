import { normalizeDirectoryName, normalizeDirectorySearchFieldValue } from "./normalization";
import type {
  DirectoryEntityType,
  DirectoryFreshness,
  DirectoryMatchKind,
  DirectoryPermissionScope,
  DirectoryRecord,
  DirectorySearchField,
} from "./types";
import type { DirectoryRelationshipType } from "./relationship-types";

export type DirectoryMatchCandidate = {
  entity_id: string;
  entity_type: DirectoryEntityType;
  display_name: string | null;
  company_name: string | null;
  role?: string | null;
  department?: string | null;
  team?: string | null;
  status?: string | null;
  email_masked?: string | null;
  phone_masked?: string | null;
  organization_number?: string | null;
  email_raw?: string | null;
  phone_raw?: string | null;
  external_id?: string | null;
  owner_reference?: string | null;
  lead_source?: string | null;
  pipeline_stage?: string | null;
  customer_id?: string | null;
  lead_id?: string | null;
  attribution_reference?: string | null;
};

export type DirectoryMatchBaseRecord = {
  entity_id: string;
  entity_type: DirectoryEntityType;
  display_name: string | null;
  company_name: string | null;
  role: string | null;
  status: string | null;
  department: string | null;
  team: string | null;
  email_masked: string | null;
  phone_masked: string | null;
  organization_number: string | null;
  relationship_type: DirectoryRelationshipType;
  source_provider: string;
  source_reference: string;
  organization_id: string;
  freshness: DirectoryFreshness;
  completeness: "complete" | "partial" | "empty";
  permission_scope: DirectoryPermissionScope;
};

export type DirectoryMatchResult = {
  record: DirectoryRecord;
  match_kind: DirectoryMatchKind;
  match_confidence: "high" | "moderate" | "low";
};

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[a.length][b.length];
}

function fuzzyNameScore(query: string, candidate: string): number {
  const normalizedQuery = normalizeDirectoryName(query);
  const normalizedCandidate = normalizeDirectoryName(candidate);
  if (!normalizedQuery || !normalizedCandidate) return 0;
  if (normalizedQuery === normalizedCandidate) return 100;
  if (normalizedCandidate.startsWith(normalizedQuery)) return 85;
  const distance = levenshtein(normalizedQuery, normalizedCandidate);
  const maxLen = Math.max(normalizedQuery.length, normalizedCandidate.length);
  const similarity = 1 - distance / maxLen;
  return Math.round(similarity * 100);
}

export function matchDirectoryRecord(input: {
  field: DirectorySearchField;
  queryValue: string;
  candidate: DirectoryMatchCandidate;
  baseRecord: DirectoryMatchBaseRecord;
}): DirectoryMatchResult | null {
  const normalizedQuery = normalizeDirectorySearchFieldValue(input.field, input.queryValue);

  if (input.field === "email") {
    const candidateEmail = input.candidate.email_raw
      ? normalizeDirectorySearchFieldValue("email", input.candidate.email_raw)
      : null;
    if (!candidateEmail || candidateEmail !== normalizedQuery) return null;
    return {
      record: { ...input.baseRecord, match_kind: "exact", match_confidence: "high" } as DirectoryRecord,
      match_kind: "exact",
      match_confidence: "high",
    };
  }

  if (input.field === "phone") {
    const candidatePhone = input.candidate.phone_raw
      ? normalizeDirectorySearchFieldValue("phone", input.candidate.phone_raw)
      : null;
    if (!candidatePhone || candidatePhone !== normalizedQuery) return null;
    return {
      record: { ...input.baseRecord, match_kind: "exact", match_confidence: "high" } as DirectoryRecord,
      match_kind: "exact",
      match_confidence: "high",
    };
  }

  if (input.field === "organization_number") {
    const candidateOrg = input.candidate.organization_number
      ? normalizeDirectorySearchFieldValue("organization_number", input.candidate.organization_number)
      : null;
    if (!candidateOrg || candidateOrg !== normalizedQuery) return null;
    return {
      record: { ...input.baseRecord, match_kind: "exact", match_confidence: "high" } as DirectoryRecord,
      match_kind: "exact",
      match_confidence: "high",
    };
  }

  if (input.field === "external_id") {
    const candidateExternal = input.candidate.external_id
      ? normalizeDirectorySearchFieldValue("external_id", input.candidate.external_id)
      : null;
    if (!candidateExternal || candidateExternal !== normalizedQuery) return null;
    return {
      record: { ...input.baseRecord, match_kind: "exact", match_confidence: "high" } as DirectoryRecord,
      match_kind: "exact",
      match_confidence: "high",
    };
  }

  if (input.field === "role" || input.field === "department" || input.field === "team" || input.field === "status" || input.field === "owner" || input.field === "lead_source" || input.field === "pipeline_stage") {
    const candidateValue =
      input.field === "role"
        ? input.candidate.role
        : input.field === "department"
          ? input.candidate.department
          : input.field === "team"
            ? input.candidate.team
            : input.field === "status"
              ? input.candidate.status
              : input.field === "owner"
                ? input.candidate.owner_reference ?? input.candidate.role
                : input.field === "lead_source"
                  ? input.candidate.lead_source
                  : input.candidate.pipeline_stage;
    if (!candidateValue) return null;
    const normalizedCandidate = normalizeDirectoryName(candidateValue);
    const normalizedQueryValue = normalizeDirectoryName(normalizedQuery);
    if (
      normalizedCandidate === normalizedQueryValue ||
      normalizedCandidate.includes(normalizedQueryValue) ||
      normalizedQueryValue.includes(normalizedCandidate)
    ) {
      return {
        record: { ...input.baseRecord, match_kind: "normalized", match_confidence: "high" } as DirectoryRecord,
        match_kind: "normalized",
        match_confidence: "high",
      };
    }
    return null;
  }

  if (input.field === "customer_id" || input.field === "lead_id") {
    const candidateId =
      input.field === "customer_id"
        ? input.candidate.customer_id ?? input.candidate.entity_id
        : input.candidate.lead_id ?? input.candidate.entity_id;
    if (!candidateId || candidateId !== normalizedQuery) return null;
    return {
      record: { ...input.baseRecord, match_kind: "exact", match_confidence: "high" } as DirectoryRecord,
      match_kind: "exact",
      match_confidence: "high",
    };
  }

  if (input.field === "company_name") {
    const candidateName = input.candidate.company_name ?? input.candidate.display_name;
    if (!candidateName) return null;
    const normalizedCandidate = normalizeDirectoryName(candidateName);
    const normalizedQueryName = normalizeDirectoryName(normalizedQuery);
    if (normalizedCandidate === normalizedQueryName) {
      return {
        record: { ...input.baseRecord, match_kind: "exact", match_confidence: "high" } as DirectoryRecord,
        match_kind: "exact",
        match_confidence: "high",
      };
    }
    if (normalizedCandidate.startsWith(normalizedQueryName)) {
      return {
        record: { ...input.baseRecord, match_kind: "prefix", match_confidence: "moderate" } as DirectoryRecord,
        match_kind: "prefix",
        match_confidence: "moderate",
      };
    }
    const score = fuzzyNameScore(normalizedQuery, candidateName);
    if (score >= 82) {
      return {
        record: { ...input.baseRecord, match_kind: "fuzzy", match_confidence: "moderate" } as DirectoryRecord,
        match_kind: "fuzzy",
        match_confidence: "moderate",
      };
    }
    if (score >= 70) {
      return {
        record: { ...input.baseRecord, match_kind: "fuzzy", match_confidence: "low" } as DirectoryRecord,
        match_kind: "fuzzy",
        match_confidence: "low",
      };
    }
    return null;
  }

  const candidateName = input.candidate.display_name ?? input.candidate.company_name;
  if (!candidateName) return null;
  const normalizedCandidate = normalizeDirectoryName(candidateName);
  const normalizedQueryName = normalizeDirectoryName(normalizedQuery);
  if (normalizedCandidate === normalizedQueryName) {
    return {
      record: { ...input.baseRecord, match_kind: "exact", match_confidence: "high" } as DirectoryRecord,
      match_kind: "exact",
      match_confidence: "high",
    };
  }
  if (normalizedCandidate.startsWith(normalizedQueryName)) {
    return {
      record: { ...input.baseRecord, match_kind: "prefix", match_confidence: "moderate" } as DirectoryRecord,
      match_kind: "prefix",
      match_confidence: "moderate",
    };
  }
  const score = fuzzyNameScore(normalizedQuery, candidateName);
  if (score >= 82) {
    return {
      record: { ...input.baseRecord, match_kind: "fuzzy", match_confidence: "moderate" } as DirectoryRecord,
      match_kind: "fuzzy",
      match_confidence: "moderate",
    };
  }
  if (score >= 70) {
    return {
      record: { ...input.baseRecord, match_kind: "fuzzy", match_confidence: "low" } as DirectoryRecord,
      match_kind: "fuzzy",
      match_confidence: "low",
    };
  }
  return null;
}

export function classifyDirectoryMatches(matches: readonly DirectoryMatchResult[]): {
  outcome: "exact_match" | "multiple_matches" | "no_match" | "ambiguous_query";
  clarification_required: boolean;
} {
  if (matches.length === 0) {
    return { outcome: "no_match", clarification_required: false };
  }

  const highConfidence = matches.filter((match) => match.match_confidence === "high");
  if (highConfidence.length === 1) {
    return { outcome: "exact_match", clarification_required: false };
  }
  if (highConfidence.length > 1) {
    return { outcome: "multiple_matches", clarification_required: true };
  }

  const uncertainFuzzy = matches.filter((match) => match.match_confidence === "low");
  if (uncertainFuzzy.length > 0) {
    return { outcome: "ambiguous_query", clarification_required: true };
  }

  if (matches.length === 1 && matches[0].match_confidence === "moderate") {
    return { outcome: "exact_match", clarification_required: false };
  }

  return { outcome: "multiple_matches", clarification_required: true };
}
