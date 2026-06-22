import { selectModelProfile } from "@/lib/intelligence/router";
import type { IntelligenceTask } from "@/lib/intelligence/tasks";
import type { ModelSelection, TenantModelPolicy } from "@/lib/intelligence/types";
import type { CompanionModelContext } from "./companion-model-context";

export type CompanionModelRoutingInput = {
  modelContext: CompanionModelContext;
  policy?: TenantModelPolicy | null;
};

export function resolveCompanionIntelligenceTask(
  modelContext: CompanionModelContext,
): IntelligenceTask {
  if (modelContext.risk_level === "medium" && modelContext.warnings.includes("support_escalation")) {
    return "risk_explanation";
  }

  if (modelContext.complexity === "high" || modelContext.operational_context.length > 0) {
    return "executive_summary";
  }

  if (modelContext.source_metadata.some((source) => source.priority === "live")) {
    return "knowledge_retrieval";
  }

  if (modelContext.approved_memory.length > 0) {
    return "support_response";
  }

  return "knowledge_retrieval";
}

export function resolveCompanionModelCostProfile(
  complexity: CompanionModelContext["complexity"],
): "fast" | "balanced" | "reasoning" {
  if (complexity === "high") return "reasoning";
  if (complexity === "medium") return "balanced";
  return "fast";
}

export function selectCompanionModelProfile(
  input: CompanionModelRoutingInput,
): ModelSelection | null {
  const task = resolveCompanionIntelligenceTask(input.modelContext);

  return selectModelProfile({
    task,
    policy: input.policy ?? { mode: "aipify_managed" },
  });
}
