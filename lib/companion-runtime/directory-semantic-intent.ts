import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import {
  type DirectoryRelationshipType,
} from "@/lib/integration-intelligence/directory/relationship-types";
import { capabilityKeyForRelationship } from "@/lib/integration-intelligence/directory/relationship-capability-map";
import {
  detectDirectorySearchField,
  normalizeDirectorySearchValue,
} from "@/lib/integration-intelligence/directory/normalization";
import type {
  DirectoryCapabilityKey,
  DirectoryEntityType,
  DirectoryProviderManifest,
  DirectorySearchField,
  DirectorySearchFilters,
} from "@/lib/integration-intelligence/directory/types";

export type DirectoryRelationshipAliasDescriptor = {
  relationship_type: DirectoryRelationshipType;
  entity_type: DirectoryEntityType;
  capability_key: DirectoryCapabilityKey;
  aliases: Partial<Record<CustomerActiveLocale | "en", readonly string[]>>;
};

export type DirectorySemanticIntent = {
  entity_type: DirectoryEntityType | null;
  relationship_type: DirectoryRelationshipType | null;
  search_field: DirectorySearchField | null;
  search_value: string | null;
  filters: DirectorySearchFilters;
  requested_fields: readonly DirectorySearchField[];
  requested_detail_level: "summary" | "list" | "detail";
  capability_candidates: DirectoryCapabilityKey[];
  confidence: "high" | "moderate" | "low";
  ambiguous: boolean;
};

function extractEmployeeSearchHints(normalized: string): {
  search_field: DirectorySearchField | null;
  search_value: string | null;
  filters: DirectorySearchFilters;
} {
  const filters: DirectorySearchFilters = {};

  if (
    /venter.*invitasjon|pending invitation|invitation pending|invitasjon.*venter/.test(normalized)
  ) {
    filters.status = "pending_invitation";
    return { search_field: "status", search_value: "pending_invitation", filters };
  }

  if (/aktive?\s+ansatte|active employees|how many employees|hvor mange ansatte/.test(normalized)) {
    filters.status = "active";
    return { search_field: "status", search_value: "active", filters };
  }

  const adminMatch = /(?:hvem er|who is)\s+(?:administrator|admin)/.test(normalized);
  if (adminMatch) {
    filters.role = "administrator";
    return { search_field: "role", search_value: "administrator", filters };
  }

  const deptMatch = normalized.match(
    /(?:jobber i|works in|avdeling|department|team)\s+([a-zæøåäöéíóúłćęśźżа-я0-9][\w\sæøåäöéíóúłćęśźż-]{1,40})/i,
  );
  if (deptMatch?.[1]) {
    const field: DirectorySearchField = /team/.test(normalized) ? "team" : "department";
    return { search_field: field, search_value: deptMatch[1].trim(), filters };
  }

  const accessMatch = normalized.match(
    /(?:tilgang til|access to|har tilgang)\s+([a-zæøå0-9][\w\s-]{1,40})/i,
  );
  if (accessMatch?.[1]) {
    return { search_field: "role", search_value: accessMatch[1].trim(), filters };
  }

  return { search_field: null, search_value: null, filters };
}

function extractSearchValueFromQuery(normalized: string): string | null {
  const quoted = normalized.match(/["“](.+?)["”]/);
  if (quoted?.[1]) return quoted[1].trim();
  const email = normalized.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
  if (email?.[0]) return email[0];
  const phone = normalized.match(/(?:\+?\d[\d\s-]{7,}\d)/);
  if (phone?.[0]) return phone[0].trim();
  const org = normalized.match(/\b\d{9}\b/);
  if (org?.[0]) return org[0];
  const nameTail = normalized.match(
    /(?:heter|called|named|navn|firma|company|organisasjon|organization|medlem|member|kunde|customer|ansatt|employee|lead|contact|selger|seller|leverand|supplier)\s+(.{2,80})$/i,
  );
  if (nameTail?.[1]) return normalizeDirectorySearchValue(nameTail[1]);
  return null;
}

function scoreRelationshipAlias(
  normalized: string,
  descriptor: DirectoryRelationshipAliasDescriptor,
  locale: CustomerActiveLocale,
): number {
  const aliasGroups = [
    ...(descriptor.aliases[locale] ?? []),
    ...(descriptor.aliases.en ?? []),
  ];
  let score = 0;
  for (const alias of aliasGroups) {
    const token = alias.trim().toLowerCase();
    if (!token) continue;
    if (normalized.includes(token)) score += 25;
  }
  return score;
}

export function collectDirectoryRelationshipDescriptorsFromManifests(
  manifests: readonly DirectoryProviderManifest[],
): DirectoryRelationshipAliasDescriptor[] {
  const descriptors: DirectoryRelationshipAliasDescriptor[] = [];
  for (const manifest of manifests) {
    for (const capability of manifest.capabilities) {
      if (!capability.semantic) continue;
      descriptors.push({
        relationship_type: capability.semantic.relationship_type,
        entity_type: capability.semantic.entity_type,
        capability_key: capability.capability_key,
        aliases: capability.semantic.entity_aliases ?? {},
      });
    }
  }
  return descriptors;
}

export function resolveDirectorySemanticIntent(input: {
  query: string;
  locale: CustomerActiveLocale;
  descriptors: readonly DirectoryRelationshipAliasDescriptor[];
}): DirectorySemanticIntent {
  const normalized = normalizeIntegrationQuery(input.query);
  const employeeHints = extractEmployeeSearchHints(normalized);
  const search_value =
    employeeHints.search_value ?? extractSearchValueFromQuery(normalized);
  const search_field =
    employeeHints.search_field ?? detectDirectorySearchField(search_value ?? normalized);
  const filters = employeeHints.filters;

  const scored = input.descriptors
    .map((descriptor) => ({
      descriptor,
      score: scoreRelationshipAlias(normalized, descriptor, input.locale),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored[0] ?? null;
  const relationship_type = top?.descriptor.relationship_type ?? null;
  const entity_type =
    top?.descriptor.entity_type ??
    (search_field === "company_name" || search_field === "organization_number" ? "organization" : "person");

  const capability_candidates = relationship_type
    ? ([capabilityKeyForRelationship(relationship_type)] as DirectoryCapabilityKey[])
    : (["directory.search"] as DirectoryCapabilityKey[]);

  const confidence: DirectorySemanticIntent["confidence"] = top
    ? top.score >= 25
      ? "high"
      : "moderate"
    : search_field
      ? "moderate"
      : "low";

  return {
    entity_type,
    relationship_type,
    search_field,
    search_value,
    filters,
    requested_fields: search_field ? [search_field] : ["name"],
    requested_detail_level: "summary",
    capability_candidates,
    confidence,
    ambiguous: scored.length > 1 && scored[0].score === scored[1].score,
  };
}

export function buildDirectorySearchQueryFromIntent(input: {
  intent: DirectorySemanticIntent;
  organization_id: string;
  tenant_id: string;
  locale: CustomerActiveLocale;
  permission_scope: "basic" | "contact" | "sensitive";
}): import("@/lib/integration-intelligence/directory/types").DirectorySearchQuery {
  return {
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    entity_type: input.intent.entity_type,
    relationship_type: input.intent.relationship_type,
    search_field: input.intent.search_field,
    search_value: input.intent.search_value,
    filters: input.intent.filters,
    requested_fields: input.intent.requested_fields,
    requested_detail_level: input.intent.requested_detail_level,
    permission_scope: input.permission_scope,
    capability_candidates: input.intent.capability_candidates,
    locale: input.locale,
  };
}
