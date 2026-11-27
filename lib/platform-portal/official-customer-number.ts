/**
 * Human customer number stored on customers.customer_number (AIP-000001).
 * This is not the organization UUID and must never be generated here.
 */
const OFFICIAL_CUSTOMER_NUMBER = /^AIP-\d{6}$/;

export function readOfficialCustomerNumber(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim().toUpperCase();
  return OFFICIAL_CUSTOMER_NUMBER.test(text) ? text : null;
}
