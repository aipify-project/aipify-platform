export function normalizeIntegrationQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/æ/g, "ae")
    .replace(/\s+/g, " ")
    .replace(/[?!.]+$/, "");
}

export function phraseMatchesQuery(query: string, phrase: string): boolean {
  const normalizedQuery = normalizeIntegrationQuery(query);
  const normalizedPhrase = normalizeIntegrationQuery(phrase);
  if (!normalizedPhrase) return false;
  const escaped = normalizedPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(?:^|\\s)${escaped.replace(/\s+/g, "\\s+")}(?:\\s|$)`, "u");
  return pattern.test(` ${normalizedQuery} `);
}

export function humanizeEntityKey(entityKey: string): string {
  return entityKey
    .trim()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isMissingReportedVersion(value: string | null | undefined): boolean {
  const trimmed = String(value ?? "").trim().toLowerCase();
  return !trimmed || trimmed === "unknown" || trimmed === "undefined" || trimmed === "null";
}
