const ALLOWED_BOOKING_RESUME_CONTINUATION_PHRASES = new Set<string>([
  // Norwegian
  "ja",
  "bekreft",
  "ja bekreft",
  "fortsett",
  "ja fortsett",
  "utfør",
  "gjør det",
  "fullfør",
  // English
  "yes",
  "confirm",
  "yes confirm",
  "continue",
  "yes continue",
  "proceed",
  "do it",
  "complete",
  // Swedish
  "bekräfta",
  "fortsätt",
  "ja fortsätt",
  "utför",
  "gör det",
  "slutför",
  // Danish
  "bekræft",
  "fortsæt",
  "ja fortsæt",
  "udfør",
  "gør det",
  "fuldfør",
]);

const BOOKING_RESUME_UUID_PATTERN =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

export function normalizeBookingResumeContinuationQuery(query: string): string {
  const collapsed = query.trim().toLowerCase().replace(/\s+/g, " ");
  return collapsed.replace(/[.!?]+$/u, "").trim();
}

/**
 * Detects short, explicit booking-resume continuation replies.
 * Whole-message match only — never approval proof; callers must still require a structured pointer.
 */
export function detectBookingResumeContinuationIntent(query: string): boolean {
  const normalized = normalizeBookingResumeContinuationQuery(query);
  if (!normalized) {
    return false;
  }

  if (BOOKING_RESUME_UUID_PATTERN.test(normalized)) {
    return false;
  }

  return ALLOWED_BOOKING_RESUME_CONTINUATION_PHRASES.has(normalized);
}

export const BOOKING_RESUME_CONTINUATION_PHRASES = [
  ...ALLOWED_BOOKING_RESUME_CONTINUATION_PHRASES,
] as const;
