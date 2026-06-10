export type Dictionary = Record<string, unknown>;

export function createTranslator(dict: Dictionary) {
  return function t(key: string): string {
    const parts = key.split(".");
    let current: unknown = dict;

    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }

    return typeof current === "string" ? current : key;
  };
}

export type Translator = ReturnType<typeof createTranslator>;
