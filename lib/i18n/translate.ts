import { humanizeTranslationKey } from "./humanize-key";

export type Dictionary = Record<string, unknown>;

export type TranslatorOptions = {
  /** Log missing keys in development (default: true). */
  devMode?: boolean;
};

export function createTranslator(dict: Dictionary, options: TranslatorOptions = {}) {
  const devMode = options.devMode !== false && process.env.NODE_ENV === "development";

  return function t(key: string): string {
    const parts = key.split(".");
    let current: unknown = dict;

    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        const fallback = humanizeTranslationKey(key);
        if (devMode) {
          console.warn(`[i18n] Missing translation: ${key} → "${fallback}"`);
        }
        return fallback;
      }
    }

    if (typeof current === "string") return current;

    const fallback = humanizeTranslationKey(key);
    if (devMode) {
      console.warn(`[i18n] Missing translation: ${key} → "${fallback}"`);
    }
    return fallback;
  };
}

export type Translator = ReturnType<typeof createTranslator>;
