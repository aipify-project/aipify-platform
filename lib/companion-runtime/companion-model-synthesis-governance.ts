import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { CompanionModelContext } from "./companion-model-context";
import { hasSufficientGroundingForSynthesis } from "./companion-model-context";

export type CompanionSynthesisBlockReason =
  | "gap_answer"
  | "fallback_answer"
  | "permission_denied"
  | "high_risk"
  | "insufficient_grounding"
  | "governance_copy"
  | "action_path"
  | "synthesis_disabled";

export function companionModelSynthesisAllowedInPhase12(): boolean {
  return true;
}

export function feedbackMayBecomeCanonicalTruth(): boolean {
  return false;
}

export function isGapOrFallbackAnswer(answer: PlatformKnowledgeAnswer): boolean {
  if (answer.sourceId === "knowledge-gap" || answer.sourceId === "grounded-live-gap") {
    return true;
  }
  if (answer.source === "fallback" && answer.confidence === "low") {
    return true;
  }
  return false;
}

export function isGovernanceLockedAnswer(answer: PlatformKnowledgeAnswer): boolean {
  if (answer.orgConfirmBlockedReason) return true;
  const haystack = `${answer.directAnswer}\n${answer.explanation ?? ""}`.toLowerCase();
  return (
    haystack.includes("approval required") ||
    haystack.includes("godkjenning kreves") ||
    haystack.includes("execution was blocked") ||
    haystack.includes("blocked by trust")
  );
}

export function evaluateCompanionSynthesisEligibility(input: {
  answer: PlatformKnowledgeAnswer;
  modelContext: CompanionModelContext;
  skipSynthesis?: boolean;
}): { eligible: true } | { eligible: false; reason: CompanionSynthesisBlockReason } {
  if (!companionModelSynthesisAllowedInPhase12()) {
    return { eligible: false, reason: "synthesis_disabled" };
  }

  if (input.skipSynthesis) {
    return { eligible: false, reason: "action_path" };
  }

  if (isGapOrFallbackAnswer(input.answer)) {
    return { eligible: false, reason: input.answer.source === "fallback" ? "fallback_answer" : "gap_answer" };
  }

  if (input.modelContext.warnings.includes("permission_denied")) {
    return { eligible: false, reason: "permission_denied" };
  }

  if (input.modelContext.risk_level === "high" || input.modelContext.data_classification === "restricted") {
    return { eligible: false, reason: "high_risk" };
  }

  if (!hasSufficientGroundingForSynthesis(input.modelContext)) {
    return { eligible: false, reason: "insufficient_grounding" };
  }

  if (isGovernanceLockedAnswer(input.answer)) {
    return { eligible: false, reason: "governance_copy" };
  }

  return { eligible: true };
}
