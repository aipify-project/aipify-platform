import { generateSecret, generateURI, verifySync } from "otplib";

const ISSUER = "Aipify";

export function generateTotpSecret(): string {
  return generateSecret();
}

export function buildOtpAuthUrl(email: string, secret: string): string {
  return generateURI({
    issuer: ISSUER,
    label: email,
    secret,
  });
}

export function verifyTotpCode(secret: string, code: string): boolean {
  const normalized = code.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(normalized)) return false;
  const result = verifySync({ secret, token: normalized });
  return result.valid;
}
