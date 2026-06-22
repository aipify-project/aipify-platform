import { normalizeIntegrationQuery, phraseMatchesQuery } from "@/lib/integration-intelligence/normalize-text";
import type { CompanionMemoryContext, CompanionConfirmedKnowledgeItem } from "./companion-memory-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type CompanionMemoryQueryMatch = {
  item: CompanionConfirmedKnowledgeItem;
  score: number;
};

function scoreMemoryItem(query: string, item: CompanionConfirmedKnowledgeItem): number {
  const normalized = normalizeIntegrationQuery(query);
  let score = 0;
  const title = normalizeIntegrationQuery(item.title);
  const summary = normalizeIntegrationQuery(item.summary);

  if (normalized === title) score += 100;
  if (title.includes(normalized) || normalized.includes(title)) score += 40;
  if (summary.includes(normalized)) score += 25;

  for (const word of normalized.split(/\s+/)) {
    if (word.length < 3) continue;
    if (title.includes(word)) score += 8;
    if (summary.includes(word)) score += 4;
  }

  if (item.review_status === "confirmed") score += 5;
  if (item.review_status === "published") score += 3;

  return score;
}

export function matchConfirmedMemoryQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): CompanionMemoryQueryMatch | null {
  if (!tenantContext.confirmedOrganizationKnowledgeAvailable) return null;
  if (tenantContext.memoryContext.permission_status === "denied") return null;

  let best: CompanionMemoryQueryMatch | null = null;
  for (const item of tenantContext.memoryContext.confirmed_knowledge) {
    const score = scoreMemoryItem(query, item);
    if (score < 20) continue;
    if (!best || score > best.score) {
      best = { item, score };
    }
  }

  return best;
}

export function findTerminologyPreference(
  query: string,
  memoryContext: CompanionMemoryContext,
): string | null {
  const normalized = normalizeIntegrationQuery(query);
  for (const pref of memoryContext.terminology_preferences) {
    const label = normalizeIntegrationQuery(pref.label);
    if (phraseMatchesQuery(normalized, label) || normalized.includes(label)) {
      return pref.value;
    }
  }
  return null;
}

export function findWorkflowPreference(
  query: string,
  memoryContext: CompanionMemoryContext,
): string | null {
  const normalized = normalizeIntegrationQuery(query);
  for (const pref of memoryContext.workflow_preferences) {
    const label = normalizeIntegrationQuery(pref.label);
    if (phraseMatchesQuery(normalized, label) || normalized.includes(label)) {
      return pref.value;
    }
  }
  return null;
}
