import type { ImportantPerson, MemoryDashboard, PersonalMemory } from "./types";
import type { AssistantCenterBundle } from "./types";
import { isPameMemoryType, type PameMemoryType } from "./categories";

export function parsePersonalMemory(raw: unknown): PersonalMemory | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string") return null;
  const category = String(r.category ?? "tasks");
  return {
    id: r.id,
    category: isPameMemoryType(category) ? category : "tasks",
    title: String(r.title ?? ""),
    description: String(r.description ?? r.summary ?? ""),
    memory_date:
      typeof r.memory_date === "string"
        ? r.memory_date
        : typeof r.event_date === "string"
          ? r.event_date
          : null,
    recurring: Boolean(r.recurring ?? r.recurrence),
    recurrence_rule:
      typeof r.recurrence_rule === "string"
        ? r.recurrence_rule
        : typeof r.recurrence === "string"
          ? r.recurrence
          : null,
    status: String(r.status ?? "active") as PersonalMemory["status"],
    confidence_level: (r.confidence_level ?? "medium") as PersonalMemory["confidence_level"],
    reminder_offsets: Array.isArray(r.reminder_offsets)
      ? (r.reminder_offsets as string[])
      : [],
    created_at: String(r.created_at ?? ""),
    updated_at: String(r.updated_at ?? ""),
  };
}

export function parsePersonalMemories(data: unknown): PersonalMemory[] {
  if (!Array.isArray(data)) return [];
  return data.map(parsePersonalMemory).filter((m): m is PersonalMemory => m !== null);
}

export function parseMemoryDashboard(raw: unknown): MemoryDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    important_people: parsePersonalMemories(d.important_people),
    upcoming_events: parsePersonalMemories(d.upcoming_events),
    active_tasks: parsePersonalMemories(d.active_tasks),
    recurring_reminders: parsePersonalMemories(d.recurring_reminders),
    completed_items: parsePersonalMemories(d.completed_items),
    recently_added: parsePersonalMemories(d.recently_added),
  };
}

export function parseAssistantCenter(data: unknown): AssistantCenterBundle {
  const raw = (data ?? {}) as Record<string, unknown>;
  const categories = raw.categories_enabled as Record<string, boolean> | undefined;
  const enabled: Partial<Record<PameMemoryType, boolean>> = {};
  if (categories) {
    for (const key of Object.keys(categories)) {
      if (isPameMemoryType(key)) enabled[key] = Boolean(categories[key]);
    }
  }

  const memories = parsePersonalMemories(raw.memories);
  const dashboard = parseMemoryDashboard(raw.dashboard);

  return {
    has_customer: Boolean(raw.has_customer),
    ask_before_remembering:
      typeof raw.ask_before_remembering === "boolean"
        ? raw.ask_before_remembering
        : true,
    categories_enabled: enabled as Record<PameMemoryType, boolean> | undefined,
    memories,
    dashboard,
    important_people: Array.isArray(raw.important_people)
      ? (raw.important_people as ImportantPerson[])
      : [],
    proactive_suggestions: Array.isArray(raw.proactive_suggestions)
      ? (raw.proactive_suggestions as Array<{ id: string; message: string }>)
      : [],
    pending_count: Number(raw.pending_count ?? 0),
  };
}

/** @deprecated */
export const parseAssistantMemory = parsePersonalMemory;
export const parseAssistantMemories = parsePersonalMemories;
