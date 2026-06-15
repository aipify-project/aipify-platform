const TECHNICAL_PATTERNS = [
  /cannot execute/i,
  /read-only transaction/i,
  /permission denied/i,
  /violates row-level security/i,
  /duplicate key/i,
  /syntax error/i,
  /relation .* does not exist/i,
  /function .* does not exist/i,
  /invalid input syntax/i,
  /jwt/i,
  /rpc/i,
  /postgres/i,
  /supabase/i,
  /pgrst/i,
];

export function isTechnicalErrorMessage(message: string | null | undefined): boolean {
  if (!message) return false;
  const trimmed = message.trim();
  if (trimmed.length < 3) return false;
  return TECHNICAL_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function sanitizePlatformErrorMessage(message: string | null | undefined): string | null {
  if (!message || isTechnicalErrorMessage(message)) return null;
  return message;
}
