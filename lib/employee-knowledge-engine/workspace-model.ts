/**
 * Presentation helpers for Employee Knowledge items.
 * Does not invent multilingual article grouping — Core has no locale relation today.
 */

export type EmployeeKnowledgeItemRow = {
  id: string;
  title: string;
  content: string;
  category: string;
  approved: boolean;
  updatedAt: string | null;
  createdAt: string | null;
};

export type EmployeeKnowledgeItemStatus = "approved" | "pending";

export type EmployeeKnowledgeItemTone = "positive" | "warning" | "neutral";

export function parseEmployeeKnowledgeItemRow(raw: Record<string, unknown>): EmployeeKnowledgeItemRow | null {
  const id = typeof raw.id === "string" ? raw.id : null;
  const title = typeof raw.title === "string" ? raw.title : null;
  if (!id || !title) return null;
  return {
    id,
    title,
    content: typeof raw.content === "string" ? raw.content : "",
    category: typeof raw.category === "string" ? raw.category : "",
    approved: Boolean(raw.approved),
    updatedAt: typeof raw.updated_at === "string" ? raw.updated_at : null,
    createdAt: typeof raw.created_at === "string" ? raw.created_at : null,
  };
}

export function statusForItem(item: EmployeeKnowledgeItemRow): EmployeeKnowledgeItemStatus {
  return item.approved ? "approved" : "pending";
}

export function toneForItemStatus(status: EmployeeKnowledgeItemStatus): EmployeeKnowledgeItemTone {
  if (status === "approved") return "positive";
  return "warning";
}

function sortKey(item: EmployeeKnowledgeItemRow): number {
  const raw = item.updatedAt ?? item.createdAt;
  if (!raw) return 0;
  const t = Date.parse(raw);
  return Number.isNaN(t) ? 0 : t;
}

/** Newest first by updated_at (fallback created_at). */
export function sortKnowledgeItemsNewestFirst(
  items: EmployeeKnowledgeItemRow[]
): EmployeeKnowledgeItemRow[] {
  return [...items].sort((a, b) => sortKey(b) - sortKey(a));
}

/** Create-FAQ surface: at most four most recent rows. */
export function recentKnowledgeItems(
  items: EmployeeKnowledgeItemRow[],
  limit = 4
): EmployeeKnowledgeItemRow[] {
  return sortKnowledgeItemsNewestFirst(items).slice(0, Math.max(0, limit));
}

/**
 * Honest gate matching Core: title + content required; empty answer cannot persist.
 * Multilingual incomplete drafts need schema authorization (not invented here).
 */
export function canPersistEmployeeKnowledgeDraft(input: {
  title: string;
  content: string;
}): { ok: true } | { ok: false; reason: "empty_title" | "empty_content" } {
  if (!input.title.trim()) return { ok: false, reason: "empty_title" };
  if (!input.content.trim()) return { ok: false, reason: "empty_content" };
  return { ok: true };
}

/** Documented Core gaps — used by contract tests and RESULT. */
export const EMPLOYEE_KNOWLEDGE_MULTILINGUAL_GAPS = [
  "employee_knowledge_items has no locale / language column",
  "no parent article_id linking multiple language versions",
  "content is NOT NULL — empty answer drafts cannot be stored",
  "no update_employee_knowledge_item RPC",
  "status is approved boolean only — no draft/review/published/rejected enum",
  "ask/search are not locale-filtered",
] as const;
