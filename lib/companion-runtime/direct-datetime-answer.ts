import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import { resolveDirectDateTimeKind, type DirectDateTimeKind } from "./direct-datetime-kind";

export type { DirectDateTimeKind };
export { resolveDirectDateTimeKind };

function formatDirectDateTime(input: {
  kind: DirectDateTimeKind;
  locale: string;
  timeZone: string;
  now?: Date;
}): string {
  const now = input.now ?? new Date();
  const locale = input.locale || "en";
  const timeZone = input.timeZone || "UTC";

  if (input.kind === "date") {
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone,
    }).format(now);
  }

  if (input.kind === "time") {
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
      hour12: locale.startsWith("en"),
    }).format(now);
  }

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    hour12: locale.startsWith("en"),
  }).format(now);
}

export function buildDirectDateTimeAnswer(input: {
  query: string;
  locale: string;
  timeZone: string;
  now?: Date;
}): PlatformKnowledgeAnswer | null {
  const kind = resolveDirectDateTimeKind(input.query);
  if (!kind) return null;

  const formatted = formatDirectDateTime({
    kind,
    locale: input.locale,
    timeZone: input.timeZone,
    now: input.now,
  });

  return {
    directAnswer: formatted,
    source: "platform_corpus",
    sourceId: `companion-direct-${kind}`,
    confidence: "high",
    sources: [],
    steps: [],
    actions: [],
  };
}
