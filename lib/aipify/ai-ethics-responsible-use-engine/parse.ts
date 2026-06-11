import type {
  AiEthicsResponsibleUseEngineCard,
  AiEthicsResponsibleUseEngineDashboard,
  AiUseCaseRecord,
} from "./types";

function parseUseCaseList(data: unknown): AiUseCaseRecord[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AiUseCaseRecord[];
}

function parseObjectList(data: unknown): Array<Record<string, unknown>> | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as Array<Record<string, unknown>>;
}

export function parseAiEthicsResponsibleUseEngineCard(data: unknown): AiEthicsResponsibleUseEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as AiEthicsResponsibleUseEngineCard;
}

export function parseAiEthicsResponsibleUseEngineDashboard(data: unknown): AiEthicsResponsibleUseEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ethics_policy: typeof d.ethics_policy === "object" && d.ethics_policy ? (d.ethics_policy as Record<string, unknown>) : undefined,
    prohibited_examples: parseObjectList(d.prohibited_examples),
    explainability_requirements:
      typeof d.explainability_requirements === "object" && d.explainability_requirements
        ? (d.explainability_requirements as Record<string, unknown>)
        : undefined,
    approved_use_cases: parseUseCaseList(d.approved_use_cases),
    restricted_use_cases: parseUseCaseList(d.restricted_use_cases),
    proposed_use_cases: parseUseCaseList(d.proposed_use_cases),
    review_schedules: parseObjectList(d.review_schedules),
    policy_exceptions: parseObjectList(d.policy_exceptions),
    oversight_trends:
      typeof d.oversight_trends === "object" && d.oversight_trends
        ? (d.oversight_trends as Record<string, unknown>)
        : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, unknown>)
        : undefined,
    ...d,
  } as AiEthicsResponsibleUseEngineDashboard;
}
