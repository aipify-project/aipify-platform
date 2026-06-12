import { FREE_EMAIL_DOMAINS } from "./constants";

export type PasswordStrength = "weak" | "fair" | "good" | "strong";

export function isBusinessEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf("@");
  if (at < 1) return false;
  const domain = trimmed.slice(at + 1);
  if (!domain || domain.includes(" ")) return false;
  return !FREE_EMAIL_DOMAINS.includes(domain as (typeof FREE_EMAIL_DOMAINS)[number]);
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) return "weak";

  let score = 0;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return "fair";
  if (score === 2) return "good";
  return "strong";
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 15;
}

export function formatPhoneWithCountryCode(dialCode: string, phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const code = dialCode.replace(/\D/g, "");
  return `+${code}${digits}`;
}
