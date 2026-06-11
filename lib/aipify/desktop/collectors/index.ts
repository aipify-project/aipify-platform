import type { NormalizedDesktopEvent } from "../types";
import { UNONIGHT_DESKTOP_EVENTS } from "../presets/unonight-desktop";

export function collectPresetDesktopEvents(tenantSlug?: string): NormalizedDesktopEvent[] {
  const events: NormalizedDesktopEvent[] = [];
  if (tenantSlug === "unonight") {
    events.push(...UNONIGHT_DESKTOP_EVENTS);
  }
  return events;
}

export function presetEventsToRpcPayload(events: NormalizedDesktopEvent[]): Record<string, unknown>[] {
  return events.map((e) => ({
    source_module: e.source_module,
    source_type: e.source_type,
    source_id: e.source_id ?? null,
    event_key: e.event_key,
    category: e.category,
    title: e.title,
    summary: e.summary,
    severity: e.severity,
    requires_action: e.requires_action,
    action_url: e.action_url ?? null,
    recommendation: e.recommendation ?? null,
    occurred_at: e.occurred_at ?? new Date().toISOString(),
    metadata: e.metadata ?? {},
  }));
}
