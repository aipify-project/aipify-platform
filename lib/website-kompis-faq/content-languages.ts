/**
 * FAQ content languages. These are stored codes, not the six administration UI locales.
 *
 * Canonical storage is the primary BCP-47 tag. Norwegian remains `no`:
 * `nb`, `nn`, `nb-NO` and `nn-NO` map to `no` on a new write. An unchanged
 * stored value is kept as-is so an existing row is not rewritten.
 *
 * Portuguese stays `pt`. `pt-BR` and `pt-PT` are rejected.
 * Chinese stays `zh`. `zh-Hans`, `zh-Hant`, `zh-CN` and `zh-TW` are rejected.
 * Other primary tags accept a two-letter region (`de-AT`) and store the primary tag.
 */

export const FAQ_CONTENT_LANGUAGE_CODES = [
  "no",
  "en",
  "sv",
  "da",
  "pl",
  "uk",
  "de",
  "fr",
  "es",
  "it",
  "pt",
  "nl",
  "fi",
  "is",
  "et",
  "lv",
  "lt",
  "cs",
  "sk",
  "hu",
  "ro",
  "bg",
  "el",
  "tr",
  "ar",
  "he",
  "hi",
  "ja",
  "ko",
  "zh",
] as const;

export type FaqContentLanguageCode = (typeof FAQ_CONTENT_LANGUAGE_CODES)[number];

const CODE_SET = new Set<string>(FAQ_CONTENT_LANGUAGE_CODES);

const NAME_ALIASES: Record<string, FaqContentLanguageCode> = {
  nb: "no",
  nn: "no",
  "nb-no": "no",
  "nn-no": "no",
  norwegian: "no",
  norsk: "no",
  bokmål: "no",
  bokmal: "no",
  nynorsk: "no",
  english: "en",
  engelsk: "en",
  swedish: "sv",
  svensk: "sv",
  svenska: "sv",
  se: "sv",
  danish: "da",
  dansk: "da",
  dk: "da",
  polish: "pl",
  polski: "pl",
  ukrainian: "uk",
  українська: "uk",
  german: "de",
  deutsch: "de",
  tysk: "de",
  french: "fr",
  français: "fr",
  francais: "fr",
  fransk: "fr",
  spanish: "es",
  español: "es",
  espanol: "es",
  spansk: "es",
  italian: "it",
  italiano: "it",
  italiensk: "it",
  portuguese: "pt",
  português: "pt",
  portugues: "pt",
  portugisisk: "pt",
  dutch: "nl",
  nederlands: "nl",
  nederlandsk: "nl",
  finnish: "fi",
  suomi: "fi",
  finsk: "fi",
  icelandic: "is",
  íslenska: "is",
  islandsk: "is",
  estonian: "et",
  eesti: "et",
  estisk: "et",
  latvian: "lv",
  latviešu: "lv",
  latviesu: "lv",
  latvisk: "lv",
  lithuanian: "lt",
  lietuvių: "lt",
  lietuviu: "lt",
  litauisk: "lt",
  czech: "cs",
  čeština: "cs",
  cestina: "cs",
  tsjekkisk: "cs",
  slovak: "sk",
  slovenčina: "sk",
  slovencina: "sk",
  slovakisk: "sk",
  hungarian: "hu",
  magyar: "hu",
  ungarsk: "hu",
  romanian: "ro",
  română: "ro",
  romana: "ro",
  rumensk: "ro",
  bulgarian: "bg",
  български: "bg",
  bulgarsk: "bg",
  greek: "el",
  ελληνικά: "el",
  gresk: "el",
  turkish: "tr",
  türkçe: "tr",
  turkce: "tr",
  tyrkisk: "tr",
  arabic: "ar",
  العربية: "ar",
  arabisk: "ar",
  hebrew: "he",
  iw: "he",
  עברית: "he",
  hebraisk: "he",
  hindi: "hi",
  हिन्दी: "hi",
  japanese: "ja",
  日本語: "ja",
  japansk: "ja",
  korean: "ko",
  한국어: "ko",
  koreansk: "ko",
  chinese: "zh",
  中文: "zh",
  kinesisk: "zh",
};

const REGION_EXCLUDED = new Set<FaqContentLanguageCode>(["pt", "zh"]);

export function canonicalFaqContentLanguage(value: string): FaqContentLanguageCode | null {
  const key = value.trim().toLowerCase().replace(/_/g, "-");
  if (!key || key.length > 32) return null;
  if (CODE_SET.has(key)) return key as FaqContentLanguageCode;
  const named = NAME_ALIASES[key];
  if (named) return named;
  const region = /^([a-z]{2})-([a-z]{2})$/.exec(key);
  if (!region) return null;
  const primaryAlias = NAME_ALIASES[region[1]];
  if (primaryAlias) return primaryAlias;
  const primary = region[1] as FaqContentLanguageCode;
  if (!CODE_SET.has(primary) || REGION_EXCLUDED.has(primary)) return null;
  return primary;
}

/** Keep an unchanged stored code. A changed value must be one of the 30 canonical tags. */
export function resolveFaqContentLanguageForSave(
  input: string,
  existingLocale: string | null,
): string | null {
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > 32) return null;
  if (existingLocale != null && existingLocale.trim() === trimmed) return trimmed;
  return canonicalFaqContentLanguage(trimmed);
}

export function sortFaqContentLanguageCodes(
  codes: readonly string[],
  label: (code: string) => string,
  locale = "nb",
): string[] {
  const collator = new Intl.Collator(locale, { sensitivity: "base" });
  return [...codes].sort((left, right) => collator.compare(label(left), label(right)) || left.localeCompare(right));
}
