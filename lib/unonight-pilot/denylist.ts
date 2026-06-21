/** Sensitive field deny list — metadata-only pilot ingestion. */

export const PILOT_SENSITIVE_FIELD_DENYLIST = [
  "message_body",
  "private_message",
  "chat_content",
  "chat_body",
  "album_content",
  "image_url",
  "image_data",
  "verification_document",
  "verification_doc",
  "payment_card",
  "card_number",
  "password",
  "intimate_profile",
  "private_photos",
  "dm_content",
] as const;

export type PilotSensitiveField = (typeof PILOT_SENSITIVE_FIELD_DENYLIST)[number];

export function isDeniedPilotField(field: string): boolean {
  const normalized = field.trim().toLowerCase();
  return PILOT_SENSITIVE_FIELD_DENYLIST.some(
    (denied) => normalized === denied || normalized.includes(denied)
  );
}

export function filterDeniedFields<T extends Record<string, unknown>>(
  payload: T,
  deniedFields: readonly string[] = PILOT_SENSITIVE_FIELD_DENYLIST
): { allowed: Partial<T>; deniedHits: string[] } {
  const allowed: Partial<T> = {};
  const deniedHits: string[] = [];

  for (const [key, value] of Object.entries(payload)) {
    const isDenied =
      deniedFields.some((d) => key.toLowerCase().includes(d.toLowerCase())) ||
      isDeniedPilotField(key);

    if (isDenied) {
      deniedHits.push(key);
    } else {
      (allowed as Record<string, unknown>)[key] = value;
    }
  }

  return { allowed, deniedHits };
}
