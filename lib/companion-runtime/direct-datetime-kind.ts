/** Zero-dependency datetime intent probe for enqueue fast path. */
export type DirectDateTimeKind = "date" | "time" | "datetime";

export function resolveDirectDateTimeKind(query: string): DirectDateTimeKind | null {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  const wantsDate =
    /\b(dato|date|datoen|today|i dag|idag|hvilken dag|which day|what day)\b/i.test(normalized) ||
    /\b(hva er datoen|what is the date|what's the date)\b/i.test(normalized);

  const wantsTime =
    /\b(klokken|klokka|time|tid|what time|hva er klokken|what is the time|what's the time)\b/i.test(
      normalized,
    ) ||
    (/\b(nå|now|currently)\b/i.test(normalized) &&
      /\b(klok|time|tid)\b/i.test(normalized));

  if (wantsDate && wantsTime) return "datetime";
  if (wantsDate) return "date";
  if (wantsTime) return "time";
  return null;
}
