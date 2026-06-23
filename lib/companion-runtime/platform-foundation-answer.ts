import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type {
  PlatformKnowledgeAnswer,
  PlatformKnowledgeSourceRef,
} from "@/lib/companion-platform-knowledge/types";
import { filterCompanionSelfNavigationActions } from "./organization-intelligence-answer";

const BASE = "customerApp.companionPlatformKnowledge.foundation";

export type PlatformFoundationGapReason =
  | "foundation_unavailable"
  | "adapter_missing"
  | "permission_required"
  | "source_unavailable";

function formatTimestamp(value: string | null, locale: CustomerActiveLocale): string {
  if (!value) return "";
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(parsed));
}

function localizeFreshness(freshness: string, t: Translator): string {
  const key = `${BASE}.freshness.${freshness}`;
  const translated = t(key);
  return translated !== key ? translated : freshness;
}

function buildSourceMeta(input: {
  source: string;
  checkedAt: string | null;
  freshness: string;
  t: Translator;
  locale: CustomerActiveLocale;
}): string {
  return input
    .t(`${BASE}.sourceLine`)
    .replace("{source}", input.source)
    .replace(
      "{checkedAt}",
      formatTimestamp(input.checkedAt, input.locale) ||
        input.t("customerApp.companionPlatformKnowledge.grounded.timestampUnavailable"),
    )
    .replace("{freshness}", localizeFreshness(input.freshness, input.t));
}

function groundedAnswer(input: {
  directAnswer: string;
  explanation: string;
  sources: PlatformKnowledgeSourceRef[];
  sourceId: string;
  source: PlatformKnowledgeAnswer["source"];
  confidence: PlatformKnowledgeAnswer["confidence"];
  actions?: PlatformKnowledgeAnswer["actions"];
}): PlatformKnowledgeAnswer {
  return {
    directAnswer: input.directAnswer,
    explanation: input.explanation,
    steps: [],
    actions: filterCompanionSelfNavigationActions(input.actions ?? []),
    sources: input.sources,
    sourceId: input.sourceId,
    source: input.source,
    confidence: input.confidence,
    orgConfirmEligible: false,
    showSupportEscalation: false,
  };
}

export function buildPlatformFoundationGapAnswer(
  t: Translator,
  reason: PlatformFoundationGapReason,
  input?: { topicId?: string | null },
): PlatformKnowledgeAnswer {
  const key =
    reason === "foundation_unavailable"
      ? `${BASE}.foundationUnavailable`
      : reason === "adapter_missing"
        ? `${BASE}.adapterMissing`
        : reason === "permission_required"
          ? `${BASE}.permissionRequired`
          : `${BASE}.sourceUnavailable`;

  const statusLabel = t(`${BASE}.gapStatus.${reason}`);
  const explanation = [
    t(`${BASE}.gapStatusLine`).replace("{status}", statusLabel),
    input?.topicId ? t(`${BASE}.gapTopicLine`).replace("{topic}", input.topicId) : null,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer: t(key),
    explanation,
    steps: [],
    actions: [],
    sources: [],
    sourceId: "platform-foundation-gap",
    source: "customer_context",
    confidence: "low",
    orgConfirmEligible: false,
    showSupportEscalation: false,
  };
}

export function buildSelfLoveFoundationAnswer(input: {
  body: string;
  sourceLabel: string;
  sourceId: string;
  source: PlatformKnowledgeAnswer["source"];
  sourceKind: PlatformKnowledgeSourceRef["kind"];
  t: Translator;
  locale: CustomerActiveLocale;
}): PlatformKnowledgeAnswer {
  const meta = buildSourceMeta({
    source: input.sourceLabel,
    checkedAt: new Date().toISOString(),
    freshness: "fresh",
    t: input.t,
    locale: input.locale,
  });

  return groundedAnswer({
    directAnswer: input.body,
    explanation: meta,
    sources: [
      {
        id: input.sourceId,
        label: input.t(`${BASE}.selfLoveSourceLabel`),
        kind: input.sourceKind,
      },
    ],
    sourceId: input.sourceId,
    source: input.source,
    confidence: "high",
  });
}

export function buildFoxFoundationAnswer(input: {
  response: string;
  followUp: string | null;
  t: Translator;
}): PlatformKnowledgeAnswer {
  const directAnswer = [input.response.trim(), input.followUp?.trim()].filter(Boolean).join("\n\n");

  return groundedAnswer({
    directAnswer,
    explanation: "",
    sources: [],
    sourceId: "playful-fox-exchange",
    source: "platform_corpus",
    confidence: "high",
  });
}
