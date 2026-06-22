import type { DirectorySearchField } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_MIN = 8;
const NO_ORG_NUMBER_PATTERN = /^\d{9}$/;

export function normalizeDirectorySearchValue(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeDirectoryEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeDirectoryPhone(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

export function normalizeDirectoryOrganizationNumber(value: string): string {
  return value.replace(/\D/g, "");
}

export function normalizeDirectoryName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

/** Detect search field from structural patterns — no customer-specific vocabulary. */
export function detectDirectorySearchField(value: string | null | undefined): DirectorySearchField | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (EMAIL_PATTERN.test(trimmed)) return "email";
  const orgDigits = normalizeDirectoryOrganizationNumber(trimmed);
  if (NO_ORG_NUMBER_PATTERN.test(orgDigits)) return "organization_number";
  const phoneDigits = normalizeDirectoryPhone(trimmed);
  if (phoneDigits.length >= PHONE_DIGITS_MIN && /^[\d+]+$/.test(phoneDigits)) return "phone";
  if (/^[a-z0-9_-]{4,}$/i.test(trimmed) && trimmed.includes("-")) return "external_id";
  return "name";
}

export function normalizeDirectorySearchFieldValue(
  field: DirectorySearchField,
  value: string,
): string {
  switch (field) {
    case "email":
      return normalizeDirectoryEmail(value);
    case "phone":
      return normalizeDirectoryPhone(value);
    case "organization_number":
      return normalizeDirectoryOrganizationNumber(value);
    case "name":
    case "company_name":
      return normalizeDirectoryName(value);
    default:
      return normalizeDirectorySearchValue(value);
  }
}
