import { WPKF_SOURCE_URL_MAX_LENGTH } from "@/lib/website-kompis-faq/constants";

export type FaqSourceUrlResult = { ok: true; value: string | null } | { ok: false };

/** Optional http(s) source link. Empty is stored as null. Same column as the FAQ editor. */
export function normalizeFaqSourceUrl(value: string): FaqSourceUrlResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > WPKF_SOURCE_URL_MAX_LENGTH) return { ok: false };
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return { ok: false };
  if (parsed.username || parsed.password) return { ok: false };
  return { ok: true, value: trimmed };
}
