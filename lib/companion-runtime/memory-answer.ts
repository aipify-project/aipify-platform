import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import { buildHonestKnowledgeGapAnswer } from "@/lib/companion-platform-knowledge/answer-builder";
import type { CompanionMemoryContext } from "./companion-memory-context";
import type { CompanionMemoryQueryMatch } from "./companion-memory-query-match";
import {
  findTerminologyPreference,
  findWorkflowPreference,
} from "./companion-memory-query-match";

function formatTimestamp(value: string | null, locale: CustomerActiveLocale): string {
  if (!value) return "";
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(parsed));
}

export function buildConfirmedMemoryAnswer(
  match: CompanionMemoryQueryMatch,
  memoryContext: CompanionMemoryContext,
  t: Translator,
  locale: CustomerActiveLocale,
): PlatformKnowledgeAnswer {
  const item = match.item;
  const directAnswer = item.summary || item.title;
  const sourceLine = t("customerApp.companionPlatformKnowledge.memory.sourceLine")
    .replace("{source}", item.source_reference)
    .replace("{effectiveFrom}", formatTimestamp(item.effective_from, locale) || t("customerApp.companionPlatformKnowledge.grounded.timestampUnavailable"))
    .replace("{reviewStatus}", t(`customerApp.companionPlatformKnowledge.memory.reviewStatus.${item.review_status}`));

  const freshnessLine =
    memoryContext.freshness === "stale"
      ? t("customerApp.companionPlatformKnowledge.memory.staleWarning")
      : "";

  return {
    directAnswer,
    explanation: [sourceLine, freshnessLine].filter(Boolean).join("\n"),
    steps: [],
    actions: [],
    sources: [
      {
        id: item.id,
        label: t("customerApp.companionPlatformKnowledge.memory.sourceLabel"),
        kind: "org_knowledge",
        meta: item.review_status,
      },
    ],
    sourceId: item.id,
    source: "organization_knowledge",
    confidence: item.review_status === "confirmed" ? "high" : "moderate",
    showSupportEscalation: false,
  };
}

export function buildMemoryGapAnswer(
  t: Translator,
  reason: "permission_denied" | "empty",
): PlatformKnowledgeAnswer {
  const gap = buildHonestKnowledgeGapAnswer(t);
  const reasonKey =
    reason === "permission_denied"
      ? "customerApp.companionPlatformKnowledge.memory.permissionDenied"
      : "customerApp.companionPlatformKnowledge.memory.emptyConfirmed";

  return {
    ...gap,
    explanation: [gap.explanation, t(reasonKey)].filter(Boolean).join("\n\n"),
    sources: [
      ...gap.sources,
      {
        id: "memory-gap",
        label: t("customerApp.companionPlatformKnowledge.memory.sourceLabel"),
        kind: "customer_context",
      },
    ],
  };
}

export function enrichAnswerWithMemoryContext(
  answer: PlatformKnowledgeAnswer,
  query: string,
  memoryContext: CompanionMemoryContext,
  t: Translator,
  options?: { allowEnrichment?: boolean; liveAnswer?: boolean },
): PlatformKnowledgeAnswer {
  if (options?.liveAnswer) return answer;
  if (options?.allowEnrichment === false) return answer;
  if (memoryContext.permission_status === "denied") return answer;
  if (answer.confidence === "low") return answer;

  const terminology = findTerminologyPreference(query, memoryContext);
  const workflow = findWorkflowPreference(query, memoryContext);
  const enrichmentLines: string[] = [];

  if (terminology) {
    enrichmentLines.push(
      t("customerApp.companionPlatformKnowledge.memory.terminologyLine").replace(
        "{value}",
        terminology,
      ),
    );
  }

  if (workflow) {
    enrichmentLines.push(
      t("customerApp.companionPlatformKnowledge.memory.workflowLine").replace("{value}", workflow),
    );
  }

  if (enrichmentLines.length === 0) return answer;

  return {
    ...answer,
    explanation: [answer.explanation, ...enrichmentLines].filter(Boolean).join("\n"),
    sources: [
      ...answer.sources,
      {
        id: "companion-memory-context",
        label: t("customerApp.companionPlatformKnowledge.memory.sourceLabel"),
        kind: "customer_context",
        meta: memoryContext.review_status,
      },
    ],
  };
}
