import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import { buildHonestKnowledgeGapAnswer } from "@/lib/companion-platform-knowledge/answer-builder";
import type {
  CompanionOperationalContext,
  CompanionOperationalItem,
} from "./companion-operational-context";
import type { CompanionOperationalQueryMatch } from "./companion-operational-query-match";

function formatTimestamp(value: string | null, locale: CustomerActiveLocale): string {
  if (!value) return "";
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(parsed));
}

function formatItemLines(items: CompanionOperationalItem[], t: Translator, emptyKey: string): string {
  if (items.length === 0) {
    return t(emptyKey);
  }
  return items
    .slice(0, 6)
    .map((item) =>
      t("customerApp.companionPlatformKnowledge.operational.itemLine")
        .replace("{title}", item.title)
        .replace("{category}", item.category),
    )
    .join("\n");
}

function buildWarningLines(context: CompanionOperationalContext, t: Translator): string[] {
  const warnings: string[] = [];
  if (context.warnings.includes("app_suspended")) {
    warnings.push(t("customerApp.companionPlatformKnowledge.operational.appSuspended"));
  }
  if (context.warnings.includes("permission_denied")) {
    warnings.push(t("customerApp.companionPlatformKnowledge.operational.permissionDenied"));
  }
  if (context.warnings.includes("stale")) {
    warnings.push(t("customerApp.companionPlatformKnowledge.operational.staleWarning"));
  }
  if (context.warnings.includes("partial")) {
    warnings.push(t("customerApp.companionPlatformKnowledge.operational.partialWarning"));
  }
  if (context.warnings.includes("empty")) {
    warnings.push(t("customerApp.companionPlatformKnowledge.operational.emptyWarning"));
  }
  return warnings;
}

function selectItemsForMatch(
  context: CompanionOperationalContext,
  match: CompanionOperationalQueryMatch,
): CompanionOperationalItem[] {
  switch (match.kind) {
    case "since_last":
      return context.operational_events.length > 0
        ? context.operational_events
        : [...context.important_changes, ...context.attention_items, ...context.completed_items];
    case "completed":
      return context.completed_items;
    case "attention":
      return context.attention_items;
    case "changes":
      return context.important_changes;
    case "next_action":
      return [];
    case "overview":
      return [
        ...context.attention_items.slice(0, 2),
        ...context.completed_items.slice(0, 2),
        ...context.important_changes.slice(0, 2),
      ];
    default:
      return [];
  }
}

function leadKeyForMatch(kind: CompanionOperationalQueryMatch["kind"]): string {
  switch (kind) {
    case "since_last":
      return "customerApp.companionPlatformKnowledge.operational.leadSinceLast";
    case "completed":
      return "customerApp.companionPlatformKnowledge.operational.leadCompleted";
    case "attention":
      return "customerApp.companionPlatformKnowledge.operational.leadAttention";
    case "changes":
      return "customerApp.companionPlatformKnowledge.operational.leadChanges";
    case "next_action":
      return "customerApp.companionPlatformKnowledge.operational.leadNextAction";
    case "overview":
    default:
      return "customerApp.companionPlatformKnowledge.operational.leadOverview";
  }
}

function emptyKeyForMatch(kind: CompanionOperationalQueryMatch["kind"]): string {
  switch (kind) {
    case "since_last":
      return "customerApp.companionPlatformKnowledge.operational.emptySinceLast";
    case "completed":
      return "customerApp.companionPlatformKnowledge.operational.emptyCompleted";
    case "attention":
      return "customerApp.companionPlatformKnowledge.operational.emptyAttention";
    case "changes":
      return "customerApp.companionPlatformKnowledge.operational.emptyChanges";
    case "next_action":
      return "customerApp.companionPlatformKnowledge.operational.emptyNextAction";
    case "overview":
    default:
      return "customerApp.companionPlatformKnowledge.operational.emptyOverview";
  }
}

export function buildGroundedOperationalAnswer(
  context: CompanionOperationalContext,
  match: CompanionOperationalQueryMatch,
  t: Translator,
  locale: CustomerActiveLocale,
): PlatformKnowledgeAnswer {
  let directAnswer = t(leadKeyForMatch(match.kind));

  if (match.kind === "next_action") {
    if (context.recommended_next_actions.length > 0) {
      directAnswer = context.recommended_next_actions
        .slice(0, 3)
        .map((action) =>
          t("customerApp.companionPlatformKnowledge.operational.nextActionLine").replace(
            "{title}",
            action.title,
          ),
        )
        .join("\n");
    } else {
      directAnswer = t(emptyKeyForMatch(match.kind));
    }
  } else {
    const items = selectItemsForMatch(context, match);
    const body = formatItemLines(items, t, emptyKeyForMatch(match.kind));
    if (body !== t(emptyKeyForMatch(match.kind))) {
      directAnswer = `${directAnswer}\n${body}`;
    } else {
      directAnswer = body;
    }
  }

  const sourceLine = t("customerApp.companionPlatformKnowledge.operational.sourceLine")
    .replace("{modules}", context.source_modules.join(", ") || t("customerApp.companionPlatformKnowledge.operational.sourceModulesFallback"))
    .replace("{generatedAt}", formatTimestamp(context.generated_at, locale) || t("customerApp.companionPlatformKnowledge.grounded.timestampUnavailable"))
    .replace("{since}", formatTimestamp(context.since, locale) || t("customerApp.companionPlatformKnowledge.grounded.timestampUnavailable"));

  const warningLines = buildWarningLines(context, t);
  const explanation = [sourceLine, ...warningLines].filter(Boolean).join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [],
    sources: [
      {
        id: "companion-operational-context",
        label: t("customerApp.companionPlatformKnowledge.operational.sourceLabel"),
        kind: "customer_context",
        meta: context.freshness,
      },
    ],
    sourceId: "companion-operational-context",
    source: "customer_context",
    confidence: context.completeness === "complete" ? "high" : context.completeness === "partial" ? "moderate" : "low",
    showSupportEscalation: false,
  };
}

export function buildOperationalGapAnswer(
  t: Translator,
  reason: "permission_denied" | "unavailable" | "empty",
): PlatformKnowledgeAnswer {
  const gap = buildHonestKnowledgeGapAnswer(t);
  const reasonKey =
    reason === "permission_denied"
      ? "customerApp.companionPlatformKnowledge.operational.permissionDenied"
      : reason === "empty"
        ? "customerApp.companionPlatformKnowledge.operational.emptyOverview"
        : "customerApp.companionPlatformKnowledge.operational.unavailable";

  return {
    ...gap,
    explanation: [gap.explanation, t(reasonKey)].filter(Boolean).join("\n\n"),
    sources: [
      ...gap.sources,
      {
        id: "operational-gap",
        label: t("customerApp.companionPlatformKnowledge.operational.sourceLabel"),
        kind: "customer_context",
      },
    ],
  };
}
