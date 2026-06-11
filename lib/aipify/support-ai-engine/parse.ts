import type { SupportAiEngineCard, SupportAiEngineDashboard } from "./types";

export function parseSupportAiEngineCard(data: unknown): SupportAiEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    open_cases: Number(d.open_cases ?? 0),
    pending_approvals: Number(d.pending_approvals ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseSupportAiEngineDashboard(data: unknown): SupportAiEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as SupportAiEngineDashboard["settings"])
        : undefined,
    open_cases: Array.isArray(d.open_cases) ? (d.open_cases as SupportAiEngineDashboard["open_cases"]) : [],
    pending_approvals: Array.isArray(d.pending_approvals)
      ? (d.pending_approvals as SupportAiEngineDashboard["pending_approvals"])
      : [],
    escalated_cases: Array.isArray(d.escalated_cases)
      ? (d.escalated_cases as SupportAiEngineDashboard["escalated_cases"])
      : [],
    unresolved_issues: Array.isArray(d.unresolved_issues)
      ? (d.unresolved_issues as SupportAiEngineDashboard["unresolved_issues"])
      : [],
    ai_statistics:
      typeof d.ai_statistics === "object" && d.ai_statistics
        ? (d.ai_statistics as SupportAiEngineDashboard["ai_statistics"])
        : undefined,
    metrics: typeof d.metrics === "object" && d.metrics ? (d.metrics as Record<string, unknown>) : undefined,
    knowledge_gaps: Array.isArray(d.knowledge_gaps)
      ? (d.knowledge_gaps as SupportAiEngineDashboard["knowledge_gaps"])
      : [],
    response_modes: Array.isArray(d.response_modes) ? (d.response_modes as string[]) : undefined,
    channels: Array.isArray(d.channels) ? (d.channels as string[]) : undefined,
  };
}
