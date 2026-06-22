import { parseOrganizationKnowledgeRow, type OrganizationKnowledgeHit } from "./organization-knowledge";
import { parseLearningCenterBundle } from "@/lib/learning/parse";
import type { LearningMemoryEntry } from "@/lib/learning/types";
import { parseOrganizationMemoryRecords } from "@/lib/aipify/organizational-memory-engine/parse";
import type { OrganizationMemoryRecord } from "@/lib/aipify/organizational-memory-engine/types";

export type CompanionMemoryFreshness = "fresh" | "stale" | "unknown";
export type CompanionMemoryPermissionStatus = "allowed" | "denied";
export type CompanionMemoryReviewStatus = "confirmed" | "published" | "reviewed" | "missing";

export type CompanionConfirmedKnowledgeItem = {
  id: string;
  title: string;
  summary: string;
  source_reference: string;
  review_status: CompanionMemoryReviewStatus;
  effective_from: string | null;
  audit_reference: string | null;
  source_kind: "organization_memory" | "learning_memory" | "organization_knowledge";
};

export type CompanionMemoryPreference = {
  key: string;
  label: string;
  value: string;
  category: string;
};

export type CompanionMemoryContext = {
  confirmed_knowledge: CompanionConfirmedKnowledgeItem[];
  organization_preferences: CompanionMemoryPreference[];
  terminology_preferences: CompanionMemoryPreference[];
  workflow_preferences: CompanionMemoryPreference[];
  approved_response_patterns: CompanionConfirmedKnowledgeItem[];
  source_references: string[];
  effective_from: string | null;
  review_status: CompanionMemoryReviewStatus;
  freshness: CompanionMemoryFreshness;
  permission_status: CompanionMemoryPermissionStatus;
};

const FRESH_MS = 24 * 60 * 60 * 1000;
const BLOCKED_MEMORY_STATUSES = new Set([
  "draft",
  "rejected",
  "expired",
  "archived",
  "superseded",
  "pending",
  "removed",
]);
const TERMINOLOGY_CATEGORIES = new Set([
  "terminology",
  "language",
  "naming",
  "glossary",
  "support_learnings",
]);
const WORKFLOW_CATEGORIES = new Set([
  "operational_decisions",
  "process_improvements",
  "onboarding_lessons",
  "approval_precedents",
  "workflow",
]);

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isBlockedStatus(status: string | undefined | null): boolean {
  if (!status) return false;
  return BLOCKED_MEMORY_STATUSES.has(status.toLowerCase());
}

function resolveFreshness(values: Array<string | null | undefined>): CompanionMemoryFreshness {
  let latest: number | null = null;
  for (const value of values) {
    if (!value) continue;
    const parsed = Date.parse(value);
    if (!Number.isFinite(parsed)) continue;
    if (latest === null || parsed > latest) latest = parsed;
  }
  if (latest === null) return "unknown";
  return Date.now() - latest <= FRESH_MS ? "fresh" : "stale";
}

function isEffective(record: { effective_from?: string | null; review_date?: string | null }): boolean {
  const effectiveFrom = str(record.effective_from ?? record.review_date);
  if (!effectiveFrom) return true;
  const parsed = Date.parse(effectiveFrom);
  if (!Number.isFinite(parsed)) return true;
  return parsed <= Date.now();
}

export function createEmptyCompanionMemoryContext(
  overrides?: Partial<CompanionMemoryContext>,
): CompanionMemoryContext {
  return {
    confirmed_knowledge: [],
    organization_preferences: [],
    terminology_preferences: [],
    workflow_preferences: [],
    approved_response_patterns: [],
    source_references: [],
    effective_from: null,
    review_status: "missing",
    freshness: "unknown",
    permission_status: "denied",
    ...overrides,
  };
}

function mapOrganizationMemoryRecord(record: OrganizationMemoryRecord): CompanionConfirmedKnowledgeItem | null {
  if (isBlockedStatus(record.status)) return null;
  if (record.status && record.status !== "active") return null;
  const title = str(record.title);
  const summary = str(record.summary);
  if (!title && !summary) return null;
  if (!isEffective({ effective_from: record.updated_at ?? record.created_at })) return null;

  return {
    id: str(record.id) || title,
    title: title || summary.slice(0, 80),
    summary,
    source_reference: str(record.source_reference) || "organization_memory",
    review_status: "confirmed",
    effective_from: record.updated_at ?? record.created_at ?? null,
    audit_reference: str(record.source_reference) || null,
    source_kind: "organization_memory",
  };
}

function mapLearningMemory(entry: LearningMemoryEntry): CompanionConfirmedKnowledgeItem | null {
  if (isBlockedStatus(entry.status)) return null;
  if (entry.status !== "active") return null;
  if (!entry.reviewed_at && !entry.approval_source) return null;
  const summary = str(entry.explanation);
  if (!summary) return null;

  return {
    id: entry.id,
    title: entry.skill_key ? `${entry.pattern_type}:${entry.skill_key}` : entry.pattern_type,
    summary,
    source_reference: str(entry.approval_source) || "customer_learning_memory",
    review_status: "reviewed",
    effective_from: entry.reviewed_at ?? entry.learned_at,
    audit_reference: entry.approval_source,
    source_kind: "learning_memory",
  };
}

function mapOrganizationKnowledgeHit(hit: OrganizationKnowledgeHit): CompanionConfirmedKnowledgeItem | null {
  const body = hit.body?.trim() || hit.summary?.trim() || "";
  if (!body) return null;

  return {
    id: hit.id,
    title: hit.title,
    summary: body,
    source_reference: hit.slug || hit.id,
    review_status: "published",
    effective_from: hit.published_at,
    audit_reference: hit.source_type,
    source_kind: "organization_knowledge",
  };
}

function preferenceFromRecord(
  record: OrganizationMemoryRecord,
  category: string,
): CompanionMemoryPreference | null {
  const value = str(record.summary) || str(record.title);
  if (!value) return null;
  return {
    key: str(record.id) || str(record.title),
    label: str(record.title) || category,
    value,
    category,
  };
}

function preferenceFromLearning(entry: LearningMemoryEntry): CompanionMemoryPreference | null {
  const value = str(entry.explanation);
  if (!value) return null;
  return {
    key: entry.id,
    label: entry.pattern_type,
    value,
    category: entry.source_type,
  };
}

export type NormalizeMemoryInput = {
  organizationMemoryRecords: OrganizationMemoryRecord[];
  learningCenter: ReturnType<typeof parseLearningCenterBundle> | null;
  organizationKnowledgeHits: OrganizationKnowledgeHit[];
  memoryCenterPreferences?: Array<Record<string, unknown>>;
  permissionDenied?: boolean;
};

export function normalizeCompanionMemoryContext(input: NormalizeMemoryInput): CompanionMemoryContext {
  if (input.permissionDenied) {
    return createEmptyCompanionMemoryContext({
      permission_status: "denied",
      review_status: "missing",
    });
  }

  const confirmedKnowledge: CompanionConfirmedKnowledgeItem[] = [];
  const terminologyPreferences: CompanionMemoryPreference[] = [];
  const workflowPreferences: CompanionMemoryPreference[] = [];
  const organizationPreferences: CompanionMemoryPreference[] = [];
  const approvedPatterns: CompanionConfirmedKnowledgeItem[] = [];
  const sourceReferences = new Set<string>();
  const effectiveDates: string[] = [];

  for (const record of input.organizationMemoryRecords) {
    const mapped = mapOrganizationMemoryRecord(record);
    if (mapped) {
      confirmedKnowledge.push(mapped);
      sourceReferences.add(mapped.source_reference);
      if (mapped.effective_from) effectiveDates.push(mapped.effective_from);
    }

    const category = str(record.category).toLowerCase();
    const pref = preferenceFromRecord(record, category);
    if (!pref) continue;
    if (TERMINOLOGY_CATEGORIES.has(category)) terminologyPreferences.push(pref);
    else if (WORKFLOW_CATEGORIES.has(category)) workflowPreferences.push(pref);
    else organizationPreferences.push(pref);
  }

  for (const entry of input.learningCenter?.recent_learnings ?? []) {
    const mapped = mapLearningMemory(entry);
    if (mapped) {
      confirmedKnowledge.push(mapped);
      approvedPatterns.push(mapped);
      sourceReferences.add(mapped.source_reference);
      if (mapped.effective_from) effectiveDates.push(mapped.effective_from);
    }
    const pref = preferenceFromLearning(entry);
    if (pref && entry.source_type.includes("terminology")) {
      terminologyPreferences.push(pref);
    }
  }

  for (const hit of input.organizationKnowledgeHits) {
    const mapped = mapOrganizationKnowledgeHit(hit);
    if (mapped) {
      confirmedKnowledge.push(mapped);
      sourceReferences.add(mapped.source_reference);
      if (mapped.effective_from) effectiveDates.push(mapped.effective_from);
    }
  }

  for (const pref of input.memoryCenterPreferences ?? []) {
    const prefValue = pref.preference_value;
    const value =
      str(pref.summary) ||
      (typeof prefValue === "string" ? prefValue : prefValue != null ? JSON.stringify(prefValue) : "");
    const mapped: CompanionMemoryPreference = {
      key: str(pref.preference_key),
      label: str(pref.preference_title) || str(pref.preference_key),
      value,
      category: str(pref.preference_category) || "organization",
    };
    if (!mapped.key && !mapped.label) continue;
    organizationPreferences.push(mapped);
    const category = mapped.category.toLowerCase();
    if (TERMINOLOGY_CATEGORIES.has(category)) terminologyPreferences.push(mapped);
    if (WORKFLOW_CATEGORIES.has(category)) workflowPreferences.push(mapped);
  }

  const deduped = dedupeConfirmedKnowledge(confirmedKnowledge);
  const effectiveFrom = effectiveDates.sort().at(-1) ?? null;

  return createEmptyCompanionMemoryContext({
    confirmed_knowledge: deduped,
    organization_preferences: dedupePreferences(organizationPreferences),
    terminology_preferences: dedupePreferences(terminologyPreferences),
    workflow_preferences: dedupePreferences(workflowPreferences),
    approved_response_patterns: dedupeConfirmedKnowledge(approvedPatterns),
    source_references: [...sourceReferences],
    effective_from: effectiveFrom,
    review_status: deduped.length > 0 ? "confirmed" : "missing",
    freshness: resolveFreshness(effectiveDates),
    permission_status: "allowed",
  });
}

function dedupeConfirmedKnowledge(items: CompanionConfirmedKnowledgeItem[]): CompanionConfirmedKnowledgeItem[] {
  const seen = new Set<string>();
  const result: CompanionConfirmedKnowledgeItem[] = [];
  for (const item of items) {
    const key = `${item.id}:${item.title}:${item.source_reference}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result.slice(0, 30);
}

function dedupePreferences(items: CompanionMemoryPreference[]): CompanionMemoryPreference[] {
  const seen = new Set<string>();
  const result: CompanionMemoryPreference[] = [];
  for (const item of items) {
    const key = `${item.key}:${item.category}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result.slice(0, 20);
}

export function parseMemoryRpcPayloads(input: {
  organizationMemoryRaw: unknown;
  learningCenterRaw: unknown;
  organizationKnowledgeRaw: unknown;
  memoryCenterRaw: unknown;
}): {
  organizationMemoryRecords: OrganizationMemoryRecord[];
  learningCenter: ReturnType<typeof parseLearningCenterBundle> | null;
  organizationKnowledgeHits: OrganizationKnowledgeHit[];
  memoryCenterPreferences: Array<Record<string, unknown>>;
} {
  const organizationMemoryRecords = parseOrganizationMemoryRecords(input.organizationMemoryRaw);
  const learningCenter =
    input.learningCenterRaw && typeof input.learningCenterRaw === "object"
      ? parseLearningCenterBundle(input.learningCenterRaw)
      : null;

  const organizationKnowledgeHits: OrganizationKnowledgeHit[] = [];
  if (Array.isArray(input.organizationKnowledgeRaw)) {
    for (const entry of input.organizationKnowledgeRaw) {
      const hit = parseOrganizationKnowledgeRow(entry as Record<string, unknown>);
      if (hit) organizationKnowledgeHits.push(hit);
    }
  }

  const memoryCenterPreferences: Array<Record<string, unknown>> = [];
  if (input.memoryCenterRaw && typeof input.memoryCenterRaw === "object") {
    const row = input.memoryCenterRaw as Record<string, unknown>;
    if (Array.isArray(row.preferences)) {
      memoryCenterPreferences.push(...(row.preferences as Array<Record<string, unknown>>));
    }
  }

  return {
    organizationMemoryRecords,
    learningCenter,
    organizationKnowledgeHits,
    memoryCenterPreferences,
  };
}
