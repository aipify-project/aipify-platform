/** Pure helpers for 2FA verify auto-submit (login challenge form). */

export function isCompleteTotpCode(digits: readonly string[]): boolean {
  if (digits.length !== 6) return false;
  const code = digits.join("");
  return /^\d{6}$/.test(code);
}

export function shouldAutoSubmitTotpCode(input: {
  digits: readonly string[];
  autoAttemptedCode: string | null;
  recoveryMode: boolean;
  booting: boolean;
  loading: boolean;
  submitInFlight: boolean;
}): boolean {
  if (input.recoveryMode || input.booting || input.loading || input.submitInFlight) {
    return false;
  }
  if (!isCompleteTotpCode(input.digits)) return false;
  const code = input.digits.join("");
  return input.autoAttemptedCode !== code;
}

export function normalizeTotpDigitsFromPaste(raw: string): string[] {
  const pasted = raw.replace(/\D/g, "").slice(0, 6);
  return pasted.split("").concat(Array(6).fill("")).slice(0, 6) as string[];
}
