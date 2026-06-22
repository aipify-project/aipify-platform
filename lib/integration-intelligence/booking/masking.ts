export function maskBookingCustomerReference(value: string | null | undefined): string {
  if (!value) return "customer";
  const trimmed = value.trim();
  if (trimmed.length <= 1) return "*";
  if (trimmed.length <= 3) return `${trimmed[0]}**`;
  return `${trimmed[0]}${"*".repeat(Math.min(trimmed.length - 1, 8))}`;
}

export function maskEmployeeDisplayName(value: string | null | undefined): string {
  if (!value) return "resource";
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) return maskBookingCustomerReference(parts[0]);
  return `${parts[0]!.charAt(0)}. ${parts[parts.length - 1]!.charAt(0)}***`;
}

export const BOOKING_FORBIDDEN_PAYLOAD_KEYS = [
  "email",
  "phone",
  "full_name",
  "address",
  "national_id",
  "birth_number",
  "customer_email",
  "customer_phone",
  "calendar_title",
  "private_note",
] as const;

export function stripForbiddenBookingFields(
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    const normalizedKey = key.toLowerCase();
    if (
      BOOKING_FORBIDDEN_PAYLOAD_KEYS.some(
        (forbidden) => normalizedKey === forbidden || normalizedKey.includes(forbidden),
      )
    ) {
      continue;
    }
    sanitized[key] = value;
  }
  return sanitized;
}

export function sanitizeBookingForAudit(input: {
  booking_id: string;
  status: string;
  source_reference: string;
  has_customer: boolean;
}): Record<string, unknown> {
  return {
    booking_id: input.booking_id,
    status: input.status,
    source_reference: input.source_reference,
    has_customer: input.has_customer,
  };
}
