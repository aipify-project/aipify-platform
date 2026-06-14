import { generateSecret, generateURI, verify } from "otplib";

const ISSUER = "Aipify";
/** Allow ±1 TOTP window (30s) for clock drift between server and authenticator apps. */
const EPOCH_TOLERANCE_SECONDS = 30;

export function generateTotpSecret(): string {
  return generateSecret();
}

export function buildOtpAuthUrl(email: string, secret: string): string {
  return generateURI({
    issuer: ISSUER,
    label: email,
    secret: normalizeTotpSecret(secret),
    algorithm: "sha1",
    digits: 6,
    period: 30,
  });
}

export function normalizeTotpSecret(secret: string): string {
  return secret.replace(/\s+/g, "").toUpperCase();
}

export async function verifyTotpCode(secret: string, code: string): Promise<boolean> {
  const normalized = code.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(normalized)) return false;

  const result = await verify({
    secret: normalizeTotpSecret(secret),
    token: normalized,
    strategy: "totp",
    algorithm: "sha1",
    digits: 6,
    period: 30,
    epochTolerance: EPOCH_TOLERANCE_SECONDS,
  });
  return result.valid;
}
