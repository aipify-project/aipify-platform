import type { SelfSupportEngineCard, SelfSupportEngineDashboard } from "./types";

export function parseSelfSupportEngineCard(data: unknown): SelfSupportEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    active_conversations: Number(d.active_conversations ?? 0),
    open_escalations: Number(d.open_escalations ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseSelfSupportEngineDashboard(data: unknown): SelfSupportEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as SelfSupportEngineDashboard["settings"])
        : undefined,
    active_conversations: Array.isArray(d.active_conversations)
      ? (d.active_conversations as SelfSupportEngineDashboard["active_conversations"])
      : [],
    escalation_queue: Array.isArray(d.escalation_queue)
      ? (d.escalation_queue as SelfSupportEngineDashboard["escalation_queue"])
      : [],
    unresolved_issues: Array.isArray(d.unresolved_issues)
      ? (d.unresolved_issues as SelfSupportEngineDashboard["unresolved_issues"])
      : [],
    satisfaction_trends:
      typeof d.satisfaction_trends === "object" && d.satisfaction_trends
        ? (d.satisfaction_trends as SelfSupportEngineDashboard["satisfaction_trends"])
        : undefined,
    statistics:
      typeof d.statistics === "object" && d.statistics
        ? (d.statistics as SelfSupportEngineDashboard["statistics"])
        : undefined,
    knowledge_gaps: Array.isArray(d.knowledge_gaps)
      ? (d.knowledge_gaps as SelfSupportEngineDashboard["knowledge_gaps"])
      : [],
    confidence_levels: Array.isArray(d.confidence_levels) ? (d.confidence_levels as string[]) : undefined,
    channels: Array.isArray(d.channels) ? (d.channels as string[]) : undefined,
    future_channels: Array.isArray(d.future_channels) ? (d.future_channels as string[]) : undefined,
  };
}
