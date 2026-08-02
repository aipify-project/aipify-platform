import type { Dictionary } from "@/lib/i18n/translate";

/**
 * Returns a dictionary string only when the key resolves to a real string leaf.
 * Never humanizes missing keys — callers must fail closed.
 */
export function lookupDictionaryString(dict: Dictionary, key: string): string | null {
  const parts = key.split(".");
  let current: unknown = dict;
  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return null;
    }
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current !== "string") return null;
  const value = current.trim();
  return value.length > 0 ? value : null;
}
