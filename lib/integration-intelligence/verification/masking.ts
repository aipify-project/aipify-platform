/** Mask subject references for verification cases — no full names or contact data by default. */
export function maskVerificationSubjectReference(value: string | null | undefined): string {
  if (!value) return "subject";
  const trimmed = value.trim();
  if (trimmed.length <= 1) return "*";
  if (trimmed.length <= 3) return `${trimmed[0]}**`;
  return `${trimmed[0]}${"*".repeat(Math.min(trimmed.length - 1, 8))}`;
}

export function sanitizeVerificationCaseForAudit(input: {
  case_id: string;
  status: string;
  source_reference: string;
  has_subject: boolean;
}): Record<string, unknown> {
  return {
    case_id: input.case_id,
    status: input.status,
    source_reference: input.source_reference,
    has_subject: input.has_subject,
  };
}

/** Strip forbidden verification payload keys before logging or audit. */
export const VERIFICATION_FORBIDDEN_PAYLOAD_KEYS = [
  "document",
  "document_url",
  "document_image",
  "id_number",
  "national_id",
  "passport",
  "birth_number",
  "ssn",
  "address_proof",
  "biometric",
  "moderator_note",
  "private_message",
  "email",
  "phone",
  "full_name",
] as const;

export function stripForbiddenVerificationFields(
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    const normalizedKey = key.toLowerCase();
    if (
      VERIFICATION_FORBIDDEN_PAYLOAD_KEYS.some(
        (forbidden) => normalizedKey === forbidden || normalizedKey.includes(forbidden),
      )
    ) {
      continue;
    }
    sanitized[key] = value;
  }
  return sanitized;
}
