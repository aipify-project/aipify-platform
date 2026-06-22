import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import { buildHonestKnowledgeGapAnswer } from "@/lib/companion-platform-knowledge/answer-builder";

export type CompanionToolGapReason =
  | "missing_tool"
  | "capability_denied"
  | "invalid_input"
  | "invalid_output"
  | "tool_unavailable"
  | "unknown_capability";

const GAP_REASON_KEYS: Record<CompanionToolGapReason, string> = {
  missing_tool: "customerApp.companionPlatformKnowledge.tools.missingTool",
  capability_denied: "customerApp.companionPlatformKnowledge.tools.capabilityDenied",
  invalid_input: "customerApp.companionPlatformKnowledge.tools.invalidInput",
  invalid_output: "customerApp.companionPlatformKnowledge.tools.invalidOutput",
  tool_unavailable: "customerApp.companionPlatformKnowledge.tools.unavailable",
  unknown_capability: "customerApp.companionPlatformKnowledge.tools.unknownCapability",
};

export function buildHonestToolGapAnswer(
  t: Translator,
  reason: CompanionToolGapReason,
): PlatformKnowledgeAnswer {
  const gap = buildHonestKnowledgeGapAnswer(t);
  const reasonLine = t(GAP_REASON_KEYS[reason]);
  return {
    ...gap,
    explanation: [gap.explanation, reasonLine].filter(Boolean).join("\n\n"),
    sources: [
      ...gap.sources,
      {
        id: "companion-tool-gap",
        label: t("customerApp.companionPlatformKnowledge.tools.sourceLabel"),
        kind: "customer_context",
      },
    ],
  };
}

export function mapDispatchCodeToGapReason(code: string): CompanionToolGapReason {
  switch (code) {
    case "capability_denied":
    case "approval_required":
      return "capability_denied";
    case "invalid_input":
      return "invalid_input";
    case "invalid_output":
      return "invalid_output";
    case "unknown_capability":
      return "unknown_capability";
    case "tool_unavailable":
      return "tool_unavailable";
    default:
      return "missing_tool";
  }
}
