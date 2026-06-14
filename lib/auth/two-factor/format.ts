/** Format a TOTP secret for manual entry (groups of 4). */
export function formatManualSetupKey(secret: string): string {
  const normalized = secret.replace(/\s+/g, "").toUpperCase();
  return normalized.match(/.{1,4}/g)?.join("-") ?? normalized;
}
