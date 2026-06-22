import { CORE_LOCALES, type CoreLocale } from "@/lib/i18n/config";

const LOCALE_HINTS: Record<CoreLocale, RegExp[]> = {
  en: [/\b(what|how|where|when|why|the|is|are|my|find|help)\b/i],
  no: [/\b(hva|hvordan|hvor|når|hvorfor|min|mitt|finner|hjelp|abonnement|faktura|ansatte|koble|nøkkel)\b/i],
  sv: [/\b(vad|hur|var|när|varför|min|mitt|hitta|hjälp|abonnemang|faktura|anslut|nyckel)\b/i],
  da: [/\b(hvad|hvordan|hvor|hvornår|hvorfor|min|mit|finder|hjælp|abonnement|faktura|tilslut|nøgle)\b/i],
  pl: [/\b(co|jak|gdzie|kiedy|dlaczego|mój|moja|znaleźć|pomoc|abonament|faktura|połączyć|klucz)\b/i],
  uk: [/\b(що|як|де|коли|чому|мій|моя|знайти|допомога|підписка|рахунок|підключити|ключ)\b/i],
};

function normalizeLocale(value: string): CoreLocale | null {
  const base = value.split("-")[0]?.toLowerCase();
  return CORE_LOCALES.includes(base as CoreLocale) ? (base as CoreLocale) : null;
}

/** Prefer the user's question language when clearly detected; otherwise use active APP locale. */
export function resolveAnswerLocale(appLocale: string, question: string): CoreLocale {
  const app = normalizeLocale(appLocale) ?? "en";
  const scores = CORE_LOCALES.map((locale) => {
    const patterns = LOCALE_HINTS[locale];
    const hits = patterns.reduce(
      (count, pattern) => count + (pattern.test(question) ? 1 : 0),
      0,
    );
    return { locale, hits };
  }).sort((a, b) => b.hits - a.hits);

  const best = scores[0];
  if (best && best.hits >= 2 && best.locale !== app) {
    return best.locale;
  }

  return app;
}
