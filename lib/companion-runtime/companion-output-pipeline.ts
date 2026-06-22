import { containsUnsafePhrase } from "@/lib/aipify/assistant-identity/safety";
import { adaptReplyToIdentity } from "@/lib/identity-engine/adapt";
import { adaptReplyToBrandIdentity } from "@/lib/internal-language-model/brand-identity";
import { SELF_LOVE_HUMOR_NOTE } from "@/lib/internal-language-model/humor-personal-connection-vocabulary";
import { resolveEffectiveMode } from "@/lib/aipify/personality/context";
import type { PersonalityMode } from "@/lib/aipify/personality/types";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { CompanionIdentityContext } from "./companion-identity-context";

export type CompanionOutputPipelineOptions = {
  locale: CustomerActiveLocale;
  userName?: string | null;
  context?: string;
};

const SERIOUS_SOURCE_MARKERS = [
  "permission",
  "denied",
  "forbidden",
  "security",
  "legal",
  "billing",
  "payment",
  "license",
  "suspended",
  "provider_failure",
  "missing_tool",
  "gap",
  "unavailable",
];

const NUMERIC_TOKEN_PATTERN = /\b\d+(?:[.,]\d+)?%?\b/g;
const FIELD_VALUE_PATTERN = /^[\w\s.-]+:\s*.+$/;

export function extractPreservedTokens(text: string): string[] {
  const tokens = new Set<string>();
  for (const match of text.match(NUMERIC_TOKEN_PATTERN) ?? []) {
    tokens.add(match);
  }
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (FIELD_VALUE_PATTERN.test(trimmed)) tokens.add(trimmed);
    if (trimmed.startsWith("•")) tokens.add(trimmed);
    if (/^Source:|^Kilder:|^Sources:/i.test(trimmed)) tokens.add(trimmed);
  }
  return [...tokens];
}

export function validateFactIntegrity(before: string, after: string, preservedTokens: string[]): boolean {
  for (const token of preservedTokens) {
    if (!after.includes(token)) return false;
  }
  const beforeNumbers = before.match(NUMERIC_TOKEN_PATTERN) ?? [];
  const afterNumbers = after.match(NUMERIC_TOKEN_PATTERN) ?? [];
  if (beforeNumbers.length !== afterNumbers.length) return false;
  for (let i = 0; i < beforeNumbers.length; i += 1) {
    if (beforeNumbers[i] !== afterNumbers[i]) return false;
  }
  return true;
}

export function isSeriousAnswerContext(answer: PlatformKnowledgeAnswer): boolean {
  if (answer.confidence === "low") return true;
  if (answer.showSupportEscalation) return true;
  if (answer.orgConfirmBlockedReason) return true;

  const haystack = `${answer.directAnswer}\n${answer.explanation ?? ""}\n${answer.sourceId}`.toLowerCase();
  return SERIOUS_SOURCE_MARKERS.some((marker) => haystack.includes(marker));
}

function isFactualLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (FIELD_VALUE_PATTERN.test(trimmed)) return true;
  if (trimmed.startsWith("•")) return true;
  if (/^Source:|^Kilder:|^Sources:/i.test(trimmed)) return true;
  return (trimmed.match(NUMERIC_TOKEN_PATTERN) ?? []).length > 0;
}

function applyLeadAdaptation(
  directAnswer: string,
  identityContext: CompanionIdentityContext,
  options: CompanionOutputPipelineOptions,
): string {
  const lines = directAnswer.split("\n");
  if (lines.length === 0) return directAnswer;

  const factualLines = lines.filter((line) => isFactualLine(line));
  if (factualLines.length === lines.length) {
    return adaptReplyToBrandIdentity(directAnswer);
  }

  const proseLines = lines.filter((line) => !isFactualLine(line));
  const factualBlock = lines.filter((line) => isFactualLine(line));

  let adaptedProse = proseLines.join("\n").trim();
  if (!adaptedProse) {
    return adaptReplyToBrandIdentity(directAnswer);
  }

  if (
    identityContext.personalization_enabled &&
    identityContext.identity_profile &&
    identityContext.empathy_enabled
  ) {
    adaptedProse = adaptReplyToIdentity(
      adaptedProse,
      identityContext.identity_profile,
      options.userName,
    );
  }

  adaptedProse = adaptReplyToBrandIdentity(adaptedProse);

  if (containsUnsafePhrase(adaptedProse)) {
    return directAnswer;
  }

  return [...(adaptedProse ? [adaptedProse] : []), ...factualBlock].join("\n").trim();
}

function resolveHumorAllowed(
  identityContext: CompanionIdentityContext,
  options: CompanionOutputPipelineOptions,
  serious: boolean,
): boolean {
  if (serious || identityContext.crisis_mode_active) return false;
  if (!identityContext.humor_enabled) return false;

  const mode = (identityContext.warmth_level === "high"
    ? "playful"
    : identityContext.warmth_level === "low"
      ? "professional"
      : "warm_professional") as PersonalityMode;

  return resolveEffectiveMode(
    mode,
    options.context ?? "companion_runtime",
    identityContext.crisis_mode_active,
  ).humorAllowed;
}

function allowsSelfLoveWarmth(
  identityContext: CompanionIdentityContext,
  serious: boolean,
): boolean {
  if (serious) return false;
  if (!identityContext.empathy_enabled) return false;
  if (!SELF_LOVE_HUMOR_NOTE) return false;
  return identityContext.warmth_level !== "low";
}

export function applyCompanionOutputPipeline(
  answer: PlatformKnowledgeAnswer,
  identityContext: CompanionIdentityContext,
  options: CompanionOutputPipelineOptions,
): PlatformKnowledgeAnswer {
  const serious = isSeriousAnswerContext(answer) || identityContext.serious_context_only;
  const humorAllowed = resolveHumorAllowed(identityContext, options, serious);
  const warmthAllowed = allowsSelfLoveWarmth(identityContext, serious);

  const preservedTokens = extractPreservedTokens(
    `${answer.directAnswer}\n${answer.explanation ?? ""}`,
  );

  let directAnswer = answer.directAnswer;
  if (serious || !identityContext.personalization_enabled) {
    directAnswer = adaptReplyToBrandIdentity(directAnswer);
  } else if (warmthAllowed || humorAllowed || identityContext.empathy_enabled) {
    directAnswer = applyLeadAdaptation(directAnswer, identityContext, options);
  } else {
    directAnswer = adaptReplyToBrandIdentity(directAnswer);
  }

  if (!validateFactIntegrity(answer.directAnswer, directAnswer, preservedTokens)) {
    directAnswer = adaptReplyToBrandIdentity(answer.directAnswer);
  }

  if (containsUnsafePhrase(`${directAnswer}\n${answer.explanation ?? ""}`)) {
    return {
      ...answer,
      directAnswer: adaptReplyToBrandIdentity(answer.directAnswer),
      explanation: answer.explanation,
      sources: answer.sources,
    };
  }

  return {
    ...answer,
    directAnswer,
    explanation: answer.explanation,
    sources: answer.sources,
    steps: answer.steps,
    actions: answer.actions,
  };
}

export function finalizeCompanionSearchResult<
  T extends { answer: PlatformKnowledgeAnswer },
>(
  result: T,
  identityContext: CompanionIdentityContext,
  options: CompanionOutputPipelineOptions,
): T {
  return {
    ...result,
    answer: applyCompanionOutputPipeline(result.answer, identityContext, options),
  };
}
