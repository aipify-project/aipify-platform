import {
  CORE_PHILOSOPHY,
  CORE_PRINCIPLE,
  FUNCTION_VOCABULARY,
  RECOMMENDED_CLOSING_PHRASES,
} from "./vocabulary";
import type { AipifyFunctionKey, FunctionVocabularyEntry } from "./types";

function formatCapabilities(capabilities?: string[]): string {
  if (!capabilities?.length) return "";
  return `\n\nCapabilities:\n${capabilities.map((c) => `· ${c}`).join("\n")}`;
}

export function describeAipifyFunction(key: AipifyFunctionKey): string {
  const entry = FUNCTION_VOCABULARY[key];
  return buildFunctionReply(entry);
}

export function buildFunctionReply(entry: FunctionVocabularyEntry): string {
  const parts = [entry.preferredWording];

  if (entry.importantExplanation) {
    parts.push(entry.importantExplanation);
  }

  const capabilities = formatCapabilities(entry.capabilities);
  if (capabilities) parts.push(capabilities.trim());

  if (entry.dashboardPath) {
    parts.push(`You can explore this in your dashboard when ready.`);
  }

  parts.push(CORE_PRINCIPLE);

  return parts.join("\n\n");
}

export function buildReplacementReply(entry: FunctionVocabularyEntry): string {
  return (
    entry.replacementResponse ??
    `${entry.preferredWording}\n\n${CORE_PRINCIPLE}`
  );
}

export function pickClosingPhrase(index = 0): string {
  return RECOMMENDED_CLOSING_PHRASES[index % RECOMMENDED_CLOSING_PHRASES.length];
}

export function getCorePhilosophy(): string {
  return CORE_PHILOSOPHY;
}
