import type { Translator } from "@/lib/i18n/translate";

const OPERATIONAL_EVENT_TITLE_BASE =
  "customerApp.companionPlatformKnowledge.operational.eventTitles";

function slugifyOperationalEventTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/** Localize known operational feed titles; hide raw English seed strings from customer chat. */
export function resolveOperationalEventTitle(title: string, t: Translator): string {
  const trimmed = title.trim();
  if (!trimmed) return trimmed;

  const slug = slugifyOperationalEventTitle(trimmed);
  const key = `${OPERATIONAL_EVENT_TITLE_BASE}.${slug}`;
  const localized = t(key);
  if (!localized.startsWith("customerApp.")) {
    return localized;
  }

  if (/^[a-z0-9_]+$/.test(trimmed)) {
    const enumKey = `${OPERATIONAL_EVENT_TITLE_BASE}.${trimmed.toLowerCase()}`;
    const enumLabel = t(enumKey);
    if (!enumLabel.startsWith("customerApp.")) {
      return enumLabel;
    }
  }

  return t(`${OPERATIONAL_EVENT_TITLE_BASE}.genericUpdate`);
}
