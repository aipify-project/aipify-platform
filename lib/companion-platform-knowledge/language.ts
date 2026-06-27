import { CORE_LOCALES, type CoreLocale } from "@/lib/i18n/config";

const LOCALE_HINTS: Record<CoreLocale, RegExp[]> = {
  en: [
    /\b(what|how|where|when|why|who|the|is|are|my|your|find|help|does|say|can|could|would|should|please|thanks|hello|hi)\b/i,
  ],
  no: [
    /\b(hva|hvordan|hvor|når|hvorfor|min|mitt|mine|finner|hjelp|abonnement|faktura|ansatte|koble|nøkkel|si|sier|takk|hei|kan|jeg|du|ja|bekreft|bestill|avtale|kunde|tjeneste|booking|opprett)\b/i,
  ],
  sv: [
    /\b(vad|hur|var|när|varför|min|mitt|mina|hitta|hjälp|abonnemang|faktura|anslut|nyckel|säger|säg|tack|hej|kan|jag|du)\b/i,
  ],
  da: [
    /\b(hvad|hvordan|hvor|hvornår|hvorfor|min|mit|mine|finder|hjælp|abonnement|faktura|tilslut|nøgle|siger|sig|tak|hej|kan|jeg|du)\b/i,
  ],
  pl: [
    /\b(co|jak|gdzie|kiedy|dlaczego|mój|moja|moje|znaleźć|pomoc|abonament|faktura|połączyć|klucz|mówi|powiedz|dziękuję|cześć|proszę|czy|ja|ty)\b/i,
  ],
  uk: [
    /\b(що|як|де|коли|чому|мій|моя|моє|знайти|допомога|підписка|рахунок|підключити|ключ|каже|скажи|дякую|привіт|будь|ласка|чи|я|ти)\b/i,
  ],
};

function normalizeLocale(value: string): CoreLocale | null {
  const base = value.split("-")[0]?.toLowerCase();
  return CORE_LOCALES.includes(base as CoreLocale) ? (base as CoreLocale) : null;
}

function scoreLocaleHints(question: string): Array<{ locale: CoreLocale; hits: number }> {
  return CORE_LOCALES.map((locale) => {
    const patterns = LOCALE_HINTS[locale];
    const hits = patterns.reduce(
      (count, pattern) => count + (pattern.test(question) ? 1 : 0),
      0,
    );
    return { locale, hits };
  }).sort((a, b) => b.hits - a.hits);
}

/**
 * Prefer the language used in the user's message when clearly detected;
 * otherwise fall back to the active APP locale (never force org locale over message).
 */
export function resolveAnswerLocale(appLocale: string, question: string): CoreLocale {
  const app = normalizeLocale(appLocale) ?? "en";
  const trimmed = question.trim();
  if (!trimmed) return app;

  const scores = scoreLocaleHints(trimmed);
  const best = scores[0];
  const second = scores[1] ?? { locale: app, hits: 0 };
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const shortMessage = wordCount <= 4;

  if (!best || best.hits === 0) {
    return app;
  }

  if (best.locale === app) {
    return app;
  }

  if (best.hits >= 2) {
    return best.locale;
  }

  if (best.hits >= 1 && best.hits > second.hits) {
    return best.locale;
  }

  if (best.hits >= 1 && best.hits === second.hits) {
    return app;
  }

  if (best.hits >= 1 && best.locale !== app) {
    return app;
  }

  if (shortMessage && best.hits >= 1) {
    return best.locale;
  }

  return app;
}

export function resolveCompanionResponseLocale(
  appLocale: string,
  message: string,
): CoreLocale {
  return resolveAnswerLocale(appLocale, message);
}
