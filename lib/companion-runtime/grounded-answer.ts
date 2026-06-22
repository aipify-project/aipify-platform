import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import { buildHonestKnowledgeGapAnswer } from "@/lib/companion-platform-knowledge/answer-builder";
import type { CompanionLiveResult } from "./companion-live-result";
import type { CompanionLiveQueryMatch } from "./companion-query-match";
import {
  extractMetricFromData,
  formatMetricStateLabel,
  type MetricExtraction,
} from "./companion-metric-format";
import type { CompanionToolGapReason } from "./tool-answer";

function formatTimestamp(value: string | null, locale: CustomerActiveLocale): string {
  if (!value) return "";
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(parsed));
}

function formatSummaryLines(
  liveResult: CompanionLiveResult,
  t: Translator,
): string[] {
  return liveResult.summary_fields
    .slice(0, 6)
    .map((field) => {
      const raw = liveResult.data[field];
      if (raw === undefined) {
        return `${field}: ${t("customerApp.companionPlatformKnowledge.grounded.valueMissing")}`;
      }
      if (raw === null) {
        return `${field}: ${t("customerApp.companionPlatformKnowledge.grounded.valueNull")}`;
      }
      if (Array.isArray(raw)) {
        return `${field}: ${raw.length === 0 ? t("customerApp.companionPlatformKnowledge.grounded.valueZero") : raw.join(", ")}`;
      }
      return `${field}: ${String(raw)}`;
    });
}

function formatMetricLine(metric: MetricExtraction, t: Translator): string {
  const stateLabel = formatMetricStateLabel(metric.state, t);
  if (metric.state !== "value") {
    return t("customerApp.companionPlatformKnowledge.grounded.metricLine")
      .replace("{label}", metric.label)
      .replace("{value}", stateLabel);
  }

  if (metric.items) {
    return t("customerApp.companionPlatformKnowledge.grounded.metricList")
      .replace("{label}", metric.label)
      .replace("{items}", metric.items.join(", "));
  }

  if (metric.groups) {
    const grouped = metric.groups.map((group) => `${group.key}=${group.count}`).join(", ");
    return t("customerApp.companionPlatformKnowledge.grounded.metricGrouped")
      .replace("{label}", metric.label)
      .replace("{items}", grouped);
  }

  return t("customerApp.companionPlatformKnowledge.grounded.metricLine")
    .replace("{label}", metric.label)
    .replace("{value}", String(metric.value ?? ""));
}

function buildWarningLines(liveResult: CompanionLiveResult, t: Translator): string[] {
  const warnings: string[] = [];
  if (liveResult.warnings.includes("stale")) {
    warnings.push(t("customerApp.companionPlatformKnowledge.grounded.staleWarning"));
  }
  if (liveResult.warnings.includes("partial")) {
    warnings.push(t("customerApp.companionPlatformKnowledge.grounded.partialWarning"));
  }
  if (liveResult.completeness === "missing") {
    warnings.push(t("customerApp.companionPlatformKnowledge.grounded.valueMissing"));
  }
  return warnings;
}

export function buildGroundedLiveAnswer(
  liveResult: CompanionLiveResult,
  match: CompanionLiveQueryMatch,
  t: Translator,
  locale: CustomerActiveLocale,
): PlatformKnowledgeAnswer {
  let directAnswer = t("customerApp.companionPlatformKnowledge.grounded.defaultLead");

  if (match.metric_kind) {
    const metric = extractMetricFromData(liveResult.data, match.metric_kind, match.field);
    directAnswer = formatMetricLine(metric, t);
  } else if (liveResult.summary_fields.length > 0) {
    directAnswer = formatSummaryLines(liveResult, t).join("\n");
  }

  const sourceLine = t("customerApp.companionPlatformKnowledge.grounded.sourceLine")
    .replace("{source}", liveResult.source)
    .replace("{checkedAt}", formatTimestamp(liveResult.checked_at, locale) || t("customerApp.companionPlatformKnowledge.grounded.timestampUnavailable"));

  const warningLines = buildWarningLines(liveResult, t);
  const explanation = [sourceLine, ...warningLines].filter(Boolean).join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [],
    sources: [
      {
        id: liveResult.capability_id,
        label: t("customerApp.companionPlatformKnowledge.grounded.sourceLabel"),
        kind: "verified_integration",
        meta: liveResult.freshness,
      },
    ],
    sourceId: liveResult.capability_id,
    source: "verified_integration",
    confidence: liveResult.completeness === "complete" ? "high" : "moderate",
    liveIntegrationToolUsed: true,
    orgConfirmEligible: true,
    requestedLiveIntegration: true,
    integrationToolName: liveResult.capability_id,
  };
}

export function buildGroundedLiveGapAnswer(
  t: Translator,
  reason: CompanionToolGapReason | "unknown_entity" | "permission_denied" | "provider_failure",
): PlatformKnowledgeAnswer {
  const gap = buildHonestKnowledgeGapAnswer(t);
  const reasonKey =
    reason === "unknown_entity"
      ? "customerApp.companionPlatformKnowledge.grounded.unknownEntity"
      : reason === "permission_denied"
        ? "customerApp.companionPlatformKnowledge.grounded.permissionDenied"
        : reason === "provider_failure"
          ? "customerApp.companionPlatformKnowledge.grounded.providerFailure"
          : `customerApp.companionPlatformKnowledge.tools.${reason === "missing_tool" ? "missingTool" : reason === "capability_denied" ? "capabilityDenied" : reason === "invalid_input" ? "invalidInput" : reason === "invalid_output" ? "invalidOutput" : reason === "tool_unavailable" ? "unavailable" : "unknownCapability"}`;

  return {
    ...gap,
    explanation: [gap.explanation, t(reasonKey)].filter(Boolean).join("\n\n"),
    sources: [
      ...gap.sources,
      {
        id: "grounded-live-gap",
        label: t("customerApp.companionPlatformKnowledge.grounded.sourceLabel"),
        kind: "customer_context",
      },
    ],
  };
}

export function buildGroundedLiveFailureAnswer(
  t: Translator,
  code: string,
): PlatformKnowledgeAnswer {
  return buildGroundedLiveGapAnswer(t, "provider_failure");
}
