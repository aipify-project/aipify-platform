const FORBIDDEN_FIELDS = new Set([
  "email",
  "phone",
  "password",
  "token",
  "secret",
  "api_key",
  "payment_instrument",
  "attachment_content",
  "raw_message",
  "internal_note",
  "chat_content",
]);

export function maskSupportCustomerReference(reference: string | null | undefined): string {
  const value = String(reference ?? "").trim();
  if (!value) return "[customer]";
  if (value.includes("@")) {
    const [local, domain] = value.split("@");
    const maskedLocal = local.length <= 2 ? "*" : `${local.slice(0, 1)}***`;
    return `${maskedLocal}@${domain}`;
  }
  if (value.length <= 4) return "****";
  return `${value.slice(0, 2)}${"*".repeat(Math.min(value.length - 3, 6))}${value.slice(-1)}`;
}

export function stripForbiddenSupportFields(
  record: Record<string, unknown>,
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (FORBIDDEN_FIELDS.has(key.toLowerCase())) continue;
    sanitized[key] = value;
  }
  return sanitized;
}

export function sanitizeSupportCaseForAudit(input: {
  case_id: string;
  status: string;
  source_reference: string;
  has_customer: boolean;
}): Record<string, unknown> {
  return {
    case_id: input.case_id,
    status: input.status,
    source_reference: input.source_reference,
    has_customer: input.has_customer,
  };
}
