import type { CompanionMemoryEvolutionCenter, MemoryItem } from "./types";

function parseMemoryItem(row: Record<string, unknown>): MemoryItem {
  return {
    memory_key: String(row.memory_key ?? ""),
    memory_title: String(row.memory_title ?? ""),
    memory_category: row.memory_category ? String(row.memory_category) : undefined,
    memory_status: row.memory_status ? String(row.memory_status) : undefined,
    summary: row.summary ? String(row.summary) : undefined,
    source_label: row.source_label ? String(row.source_label) : undefined,
  };
}

export function parseCompanionMemoryEvolutionCenter(
  row: Record<string, unknown> | null
): CompanionMemoryEvolutionCenter | null {
  if (!row || typeof row !== "object") return null;
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    section: row.section ? String(row.section) : undefined,
    organization: row.organization as { id: string; name: string } | undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    personal_memory: Array.isArray(row.personal_memory)
      ? row.personal_memory.map((r) => parseMemoryItem(r as Record<string, unknown>))
      : undefined,
    organization_memory: Array.isArray(row.organization_memory)
      ? row.organization_memory.map((r) => parseMemoryItem(r as Record<string, unknown>))
      : undefined,
    preferences: row.preferences as Record<string, unknown> | undefined,
    context: row.context as Record<string, unknown> | undefined,
    learning: row.learning as Record<string, unknown> | undefined,
    memory_governance: row.memory_governance as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    memory_health: row.memory_health as Record<string, unknown> | undefined,
    companion_context_advisor: row.companion_context_advisor as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            event_type: String(e.event_type ?? ""),
            summary: String(e.summary ?? ""),
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
    notifications: row.notifications as Record<string, unknown> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}
