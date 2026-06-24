import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionIdentityContext } from "./companion-identity-context";
import {
  resolveLightweightConversationalIntent,
  type LightweightConversationalIntent,
} from "./companion-turn-route";

const BASE = "customerApp.companion.lightweightConversational";

function intentKey(intent: LightweightConversationalIntent): string {
  return `${BASE}.${intent}`;
}

export function buildLightweightConversationalAnswer(input: {
  query: string;
  t: Translator;
  identity?: CompanionIdentityContext | null;
}): PlatformKnowledgeAnswer {
  const intent = resolveLightweightConversationalIntent(input.query) ?? "general";

  const name = input.identity?.preferred_name?.trim();
  const namePart = name ? `, ${name}` : "";
  const directAnswer = input.t(intentKey(intent)).replace("{name}", namePart);

  return {
    directAnswer,
    source: "platform_corpus",
    sourceId: "companion-lightweight-conversational",
    confidence: "high",
    sources: [],
    steps: [],
    actions: [],
  };
}
