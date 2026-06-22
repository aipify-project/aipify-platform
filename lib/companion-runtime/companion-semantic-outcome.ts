import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { CompanionResolvedIntent, CompanionSemanticOutcomeType } from "@/lib/integration-intelligence/semantic/types";

function outcomeLeadKey(outcome: CompanionSemanticOutcomeType): string {
  return `customerApp.companionPlatformKnowledge.semanticRouting.outcomes.${outcome}.lead`;
}

function outcomeExplanationKey(outcome: CompanionSemanticOutcomeType): string {
  return `customerApp.companionPlatformKnowledge.semanticRouting.outcomes.${outcome}.explanation`;
}

export function buildSemanticOutcomeAnswer(
  resolved: CompanionResolvedIntent,
  t: Translator,
): PlatformKnowledgeAnswer | null {
  if (resolved.outcome === "intent_resolved_and_grounded") {
    return null;
  }

  if (resolved.outcome === "intent_ambiguous" && resolved.clarification_key) {
    return {
      directAnswer: t(resolved.clarification_key),
      explanation: resolved.ambiguity_reason
        ? t("customerApp.companionPlatformKnowledge.semanticRouting.clarification.contextHint")
        : t(outcomeExplanationKey(resolved.outcome)),
      steps: [],
      actions: [],
      sources: [
        {
          id: resolved.intent_id,
          label: t("customerApp.companionPlatformKnowledge.semanticRouting.sourceLabel"),
          kind: "customer_context",
        },
      ],
      sourceId: resolved.intent_id,
      source: "customer_context",
      confidence: "moderate",
    };
  }

  const metricLabel = resolved.requested_metric
    ? t(
        `customerApp.companionPlatformKnowledge.communityProviderAdapter.requestedMetrics.${resolved.requested_metric}`,
      )
    : t("customerApp.companionPlatformKnowledge.semanticRouting.genericMetric");

  const directAnswer = t(outcomeLeadKey(resolved.outcome)).replace("{metric}", metricLabel);
  const explanation = t(outcomeExplanationKey(resolved.outcome)).replace("{metric}", metricLabel);

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [],
    sources: [
      {
        id: resolved.intent_id,
        label: t("customerApp.companionPlatformKnowledge.semanticRouting.sourceLabel"),
        kind: "customer_context",
        meta: resolved.outcome,
      },
    ],
    sourceId: resolved.intent_id,
    source: "customer_context",
    confidence: resolved.outcome === "intent_unresolved" ? "low" : "moderate",
  };
}

export function updateConversationSemanticContext(
  previous: import("@/lib/integration-intelligence/semantic/types").CompanionConversationSemanticContext | null | undefined,
  resolved: CompanionResolvedIntent,
): import("@/lib/integration-intelligence/semantic/types").CompanionConversationSemanticContext {
  return {
    previous_entity: resolved.entity ?? previous?.previous_entity ?? null,
    previous_domain: resolved.domain ?? previous?.previous_domain ?? null,
    previous_requested_metric: resolved.requested_metric ?? previous?.previous_requested_metric ?? null,
    previous_capability_key: resolved.capability_key ?? previous?.previous_capability_key ?? null,
    previous_provider_key: resolved.provider_key ?? previous?.previous_provider_key ?? null,
  };
}
