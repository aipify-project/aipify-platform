import { UNONIGHT_BRIEFING_EVENTS } from "../presets/unonight-briefing";
import type { NormalizedBriefingEvent } from "../types";

export type CollectorContext = {
  tenantSlug?: string | null;
  since?: Date;
  modules?: Partial<Record<string, boolean>>;
};

/** TS-side supplemental events (merged via API collect when DB has few events). */
export function collectPresetEvents(ctx: CollectorContext = {}): NormalizedBriefingEvent[] {
  const events: NormalizedBriefingEvent[] = [];

  if (ctx.tenantSlug === "unonight" || !ctx.tenantSlug) {
    events.push(...UNONIGHT_BRIEFING_EVENTS);
  }

  if (ctx.modules?.support !== false) {
    events.push({
      source_module: "support",
      source_type: "support_case",
      event_key: "briefing.support.handled.sample",
      title: "14 support questions handled",
      summary: "2 cases need human review.",
      severity: "info",
      requires_action: false,
      action_url: "/app/assistant",
    });
  }

  if (ctx.modules?.knowledge !== false) {
    events.push({
      source_module: "knowledge",
      source_type: "knowledge_gap",
      event_key: "briefing.knowledge.gaps.sample",
      title: "3 new Knowledge Gaps opened",
      summary: "Most repeated topic: Shopify integration.",
      severity: "medium",
      requires_action: true,
      action_url: "/app/knowledge-center/gaps",
    });
  }

  if (ctx.modules?.governance !== false) {
    events.push({
      source_module: "governance",
      source_type: "approval_request",
      event_key: "briefing.governance.approvals.sample",
      title: "4 approvals waiting",
      summary: "1 high-risk action was blocked pending review.",
      severity: "high",
      requires_action: true,
      action_url: "/app/approvals",
    });
  }

  return events;
}

export function presetEventsToRpcPayload(events: NormalizedBriefingEvent[]) {
  return events.map((e) => ({
    source_module: e.source_module,
    source_type: e.source_type,
    source_id: e.source_id ?? null,
    event_key: e.event_key,
    title: e.title,
    summary: e.summary,
    severity: e.severity,
    requires_action: e.requires_action,
    action_url: e.action_url ?? null,
    occurred_at: e.occurred_at ?? new Date().toISOString(),
    metadata: e.metadata ?? {},
  }));
}
