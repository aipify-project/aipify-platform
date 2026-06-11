import { defaultLifeAreaToggles, isLifeArea } from "./life-areas";
import { isLifePriority } from "./priorities";
import {
  isLifePersonality,
  NOTIFICATION_FREQUENCIES,
  PROACTIVITY_LEVELS,
} from "./personality";
import type {
  LifeCenterBundle,
  LifeChecklist,
  LifeMemoryItem,
  LifeOsSettings,
} from "./types";

function parseMemoryItem(raw: unknown): LifeMemoryItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const priority = String(r.priority ?? "routine");
  const lifeArea = String(r.life_area ?? "personal");
  return {
    id: String(r.id ?? ""),
    title: String(r.title ?? ""),
    description: r.description ? String(r.description) : undefined,
    category: r.category ? String(r.category) : undefined,
    memory_date: r.memory_date ? String(r.memory_date) : null,
    priority: isLifePriority(priority) ? priority : "routine",
    life_area: isLifeArea(lifeArea) ? lifeArea : "personal",
    status: r.status ? String(r.status) : undefined,
    postponed_count:
      typeof r.postponed_count === "number" ? r.postponed_count : undefined,
    reschedule_suggested:
      typeof r.reschedule_suggested === "boolean" ? r.reschedule_suggested : undefined,
  };
}

function parseSettings(raw: unknown): LifeOsSettings | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const s = raw as Record<string, unknown>;
  const areasRaw = s.life_areas_enabled;
  const areas = defaultLifeAreaToggles();
  if (areasRaw && typeof areasRaw === "object") {
    for (const [key, val] of Object.entries(areasRaw as Record<string, unknown>)) {
      if (isLifeArea(key)) areas[key] = Boolean(val);
    }
  }
  const personality = String(s.personality ?? "supportive");
  const proactivity = String(s.proactivity_level ?? "balanced");
  const frequency = String(s.notification_frequency ?? "balanced");

  return {
    proactivity_level: (PROACTIVITY_LEVELS as readonly string[]).includes(proactivity)
      ? (proactivity as LifeOsSettings["proactivity_level"])
      : "balanced",
    notification_frequency: (NOTIFICATION_FREQUENCIES as readonly string[]).includes(
      frequency
    )
      ? (frequency as LifeOsSettings["notification_frequency"])
      : "balanced",
    personality: isLifePersonality(personality) ? personality : "supportive",
    life_areas_enabled: areas,
    daily_briefing_enabled: Boolean(s.daily_briefing_enabled ?? true),
    evening_review_enabled: Boolean(s.evening_review_enabled ?? true),
    quiet_hours_start: s.quiet_hours_start ? String(s.quiet_hours_start) : null,
    quiet_hours_end: s.quiet_hours_end ? String(s.quiet_hours_end) : null,
    energy_aware_enabled: Boolean(s.energy_aware_enabled ?? false),
  };
}

function parseChecklist(raw: unknown): LifeChecklist | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  const items = Array.isArray(c.items)
    ? c.items
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const i = item as Record<string, unknown>;
          return {
            id: String(i.id ?? ""),
            title: String(i.title ?? ""),
            sort_order: Number(i.sort_order ?? 0),
            completed_at: i.completed_at ? String(i.completed_at) : null,
          };
        })
        .filter((x): x is LifeChecklist["items"][number] => x !== null)
    : [];
  return {
    id: String(c.id ?? ""),
    title: String(c.title ?? ""),
    description: String(c.description ?? ""),
    checklist_type: String(c.checklist_type ?? "custom"),
    status: String(c.status ?? "active"),
    items,
    progress: Number(c.progress ?? 0),
  };
}

export function parseLifeCenter(data: unknown): LifeCenterBundle {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;

  const briefingRaw = d.daily_briefing;
  const eveningRaw = d.evening_review;

  return {
    has_customer: Boolean(d.has_customer),
    user_name: d.user_name ? String(d.user_name) : undefined,
    settings: parseSettings(d.settings),
    daily_briefing:
      briefingRaw && typeof briefingRaw === "object"
        ? {
            greeting: String((briefingRaw as Record<string, unknown>).greeting ?? ""),
            highlights: Array.isArray((briefingRaw as Record<string, unknown>).highlights)
              ? ((briefingRaw as Record<string, unknown>).highlights as unknown[]).map(String)
              : [],
            prompt: String((briefingRaw as Record<string, unknown>).prompt ?? ""),
          }
        : null,
    evening_review:
      eveningRaw && typeof eveningRaw === "object"
        ? {
            completed_today: Array.isArray(
              (eveningRaw as Record<string, unknown>).completed_today
            )
              ? ((eveningRaw as Record<string, unknown>).completed_today as unknown[]).map(
                  (x) => {
                    const r = x as Record<string, unknown>;
                    return { id: String(r.id ?? ""), title: String(r.title ?? "") };
                  }
                )
              : [],
            still_pending: Array.isArray(
              (eveningRaw as Record<string, unknown>).still_pending
            )
              ? ((eveningRaw as Record<string, unknown>).still_pending as unknown[]).map(
                  (x) => {
                    const r = x as Record<string, unknown>;
                    return { id: String(r.id ?? ""), title: String(r.title ?? "") };
                  }
                )
              : [],
            prompt: String((eveningRaw as Record<string, unknown>).prompt ?? ""),
          }
        : null,
    today_overview: Array.isArray(d.today_overview)
      ? d.today_overview.map(parseMemoryItem).filter((x): x is LifeMemoryItem => x !== null)
      : [],
    upcoming_events: Array.isArray(d.upcoming_events)
      ? d.upcoming_events.map(parseMemoryItem).filter((x): x is LifeMemoryItem => x !== null)
      : [],
    priority_tasks: Array.isArray(d.priority_tasks)
      ? d.priority_tasks.map(parseMemoryItem).filter((x): x is LifeMemoryItem => x !== null)
      : [],
    family_reminders: Array.isArray(d.family_reminders)
      ? (d.family_reminders as unknown[]).map((x) => {
          const r = x as Record<string, unknown>;
          return {
            id: String(r.id ?? ""),
            title: String(r.title ?? ""),
            memory_date: r.memory_date ? String(r.memory_date) : null,
            description: String(r.description ?? ""),
          };
        })
      : [],
    suggested_actions: Array.isArray(d.suggested_actions)
      ? (d.suggested_actions as unknown[]).map((x) => {
          const r = x as Record<string, unknown>;
          return { id: String(r.id ?? ""), message: String(r.message ?? "") };
        })
      : [],
    life_balance:
      d.life_balance && typeof d.life_balance === "object"
        ? {
            by_area: (d.life_balance as Record<string, unknown>).by_area as Record<
              string,
              number
            >,
            overload_days: Array.isArray(
              (d.life_balance as Record<string, unknown>).overload_days
            )
              ? ((d.life_balance as Record<string, unknown>).overload_days as unknown[]).map(
                  (x) => {
                    const r = x as Record<string, unknown>;
                    return {
                      date: String(r.date ?? ""),
                      count: Number(r.count ?? 0),
                      message: String(r.message ?? ""),
                    };
                  }
                )
              : [],
          }
        : undefined,
    conflicts: Array.isArray(d.conflicts)
      ? (d.conflicts as unknown[]).map((x) => {
          const r = x as Record<string, unknown>;
          return { type: String(r.type ?? ""), message: String(r.message ?? "") };
        })
      : [],
    proactive_questions: Array.isArray(d.proactive_questions)
      ? (d.proactive_questions as unknown[]).map((x) => {
          const r = x as Record<string, unknown>;
          return { id: String(r.id ?? ""), message: String(r.message ?? "") };
        })
      : [],
    checklists: Array.isArray(d.checklists)
      ? d.checklists.map(parseChecklist).filter((x): x is LifeChecklist => x !== null)
      : [],
    energy_hint: d.energy_hint ? String(d.energy_hint) : null,
    privacy_note: d.privacy_note ? String(d.privacy_note) : undefined,
  };
}
