import type {
  CompanionMemoryDashboard,
  MemoryRecord,
  MemoryReviewItem,
  MemorySource,
  MemoryTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown, fb = 0): number { return typeof v === "number" ? v : fb; }
function bool(v: unknown): boolean { return v === true; }

function parseMemory(raw: unknown): MemoryRecord | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  if (!str(d.id)) return undefined;
  return {
    id: str(d.id),
    title: str(d.title),
    summary: str(d.summary),
    content: str(d.content) || undefined,
    category: str(d.category),
    memory_type: str(d.memory_type),
    memory_scope: str(d.memory_scope),
    source_key: str(d.source_key),
    department: str(d.department) || undefined,
    confidence: str(d.confidence),
    approval_status: str(d.approval_status),
    reason: str(d.reason) || undefined,
    learned_at: str(d.learned_at) || undefined,
    approved_at: str(d.approved_at) || null,
    updated_at: str(d.updated_at) || undefined,
  };
}

function parseMemories(raw: unknown): MemoryRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseMemory).filter(Boolean) as MemoryRecord[];
}

export function parseCompanionMemoryDashboard(data: unknown): CompanionMemoryDashboard {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const timeline = Array.isArray(d.timeline)
    ? d.timeline.map((i) => {
        const e = i as Record<string, unknown>;
        return {
          id: str(e.id),
          event_type: str(e.event_type),
          description: str(e.description),
          memory_id: str(e.memory_id) || null,
          created_at: str(e.created_at),
        } satisfies MemoryTimelineEvent;
      })
    : [];
  return {
    found: bool(d.found),
    can_personal: bool(d.can_personal),
    can_team: bool(d.can_team),
    can_organization: bool(d.can_organization),
    can_manage: bool(d.can_manage),
    has_memories: bool(d.has_memories),
    memory_health_score: num(d.memory_health_score),
    active_memories_count: num(d.active_memories_count),
    approved_memories_count: num(d.approved_memories_count),
    memories: parseMemories(d.memories),
    memory_sources: Array.isArray(d.memory_sources)
      ? d.memory_sources.map((s) => {
          const x = s as Record<string, unknown>;
          return {
            id: str(x.id),
            source_key: str(x.source_key),
            title: str(x.title),
            memory_count: num(x.memory_count),
            last_updated_at: str(x.last_updated_at) || null,
          } satisfies MemorySource;
        })
      : [],
    recently_learned: parseMemories(d.recently_learned),
    timeline,
    usage_examples: Array.isArray(d.usage_examples) ? d.usage_examples.map(String) : [],
    privacy_note: str(d.privacy_note),
    principle: str(d.principle),
  };
}

export function parseCompanionMemoryDetail(data: unknown): { found: boolean; memory?: MemoryRecord; error?: string } {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false, error: str(d.error) };
  const memory = parseMemory(d.memory);
  return memory ? { found: true, memory } : { found: false };
}

export function parseCompanionMemoryReview(data: unknown): { found: boolean; review_items: MemoryReviewItem[] } {
  if (!data || typeof data !== "object") return { found: false, review_items: [] };
  const d = data as Record<string, unknown>;
  const review_items = Array.isArray(d.review_items)
    ? d.review_items.map((i) => {
        const x = i as Record<string, unknown>;
        return {
          id: str(x.id),
          title: str(x.title),
          summary: str(x.summary),
          source_key: str(x.source_key),
          reason: str(x.reason),
          confidence: str(x.confidence),
          approval_status: str(x.approval_status),
          category: str(x.category),
          memory_scope: str(x.memory_scope),
          learned_at: str(x.learned_at),
        } satisfies MemoryReviewItem;
      })
    : [];
  return { found: bool(d.found), review_items };
}

export function parseCompanionMemoryAction(data: unknown): { ok: boolean; memory_id?: string; error?: string } {
  if (!data || typeof data !== "object") return { ok: false };
  const d = data as Record<string, unknown>;
  return {
    ok: bool(d.ok),
    memory_id: str(d.memory_id) || undefined,
    error: str(d.error) || undefined,
  };
}
