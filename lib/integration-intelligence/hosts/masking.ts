const FORBIDDEN_FIELDS = new Set([
  "email",
  "phone",
  "guest_name",
  "guest_email",
  "guest_phone",
  "payment_card",
  "card_number",
  "id_document",
  "passport",
  "raw_message",
  "message_body",
  "attachment_content",
]);

export function maskHostsGuestReference(reference: string | null | undefined): string {
  const value = String(reference ?? "").trim();
  if (!value) return "[guest]";
  if (value.includes("@")) {
    const [local, domain] = value.split("@");
    const maskedLocal = local.length <= 2 ? "*" : `${local.slice(0, 1)}***`;
    return `${maskedLocal}@${domain}`;
  }
  if (value.length <= 4) return "****";
  return `${value.slice(0, 2)}${"*".repeat(Math.min(value.length - 3, 6))}${value.slice(-1)}`;
}

export function stripForbiddenHostsFields(record: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (FORBIDDEN_FIELDS.has(key.toLowerCase())) continue;
    sanitized[key] = value;
  }
  return sanitized;
}

export function sanitizeHostsEntityForAudit(input: {
  entity_type: string;
  entity_id: string;
  source_reference: string;
  has_guest: boolean;
}): Record<string, unknown> {
  return {
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    source_reference: input.source_reference,
    has_guest: input.has_guest,
  };
}
