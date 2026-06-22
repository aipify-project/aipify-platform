const EVENT_TYPE_LABEL_KEYS: Record<string, string> = {
  customer: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.customer",
  contract: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.contract",
  approval: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.approval",
  knowledge: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.knowledge",
  partner: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.partner",
  risk: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.risk",
  revenue: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.revenue",
  integration: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.integration",
  operational: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.operational",
  business_pack: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.businessPack",
  support: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.support",
  timeline: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.timeline",
  alert: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.alert",
  opportunity: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.opportunity",
  briefing: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.briefing",
  security: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.security",
  billing: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.billing",
  task: "customerApp.executiveCommandCenter.commandBriefOverview.eventTypes.task",
};

function normalizeEventTypeKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function resolveCommandBriefEventTypeLabelKey(eventType: string): string | null {
  const key = normalizeEventTypeKey(eventType);
  if (EVENT_TYPE_LABEL_KEYS[key]) return EVENT_TYPE_LABEL_KEYS[key];

  for (const [needle, labelKey] of Object.entries(EVENT_TYPE_LABEL_KEYS)) {
    if (key.includes(needle)) return labelKey;
  }

  return null;
}

export function resolveCommandBriefEventSourceLabelKey(eventType: string): string | null {
  const labelKey = resolveCommandBriefEventTypeLabelKey(eventType);
  return labelKey;
}
