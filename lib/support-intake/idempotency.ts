const SUPPORT_INTAKE_IDEMPOTENCY_KEY = /^[A-Za-z0-9_-]{8,120}$/;

export function isSupportIntakeIdempotencyKey(
  value: string | null | undefined,
): value is string {
  return typeof value === "string" && SUPPORT_INTAKE_IDEMPOTENCY_KEY.test(value);
}

/** Reads the client attempt key. Never invents a new key. */
export function readSupportIntakeIdempotencyKey(
  body: Record<string, unknown>,
): string | null {
  const raw = body.idempotencyKey ?? body.idempotency_key;
  if (typeof raw !== "string") return null;
  const key = raw.trim();
  return isSupportIntakeIdempotencyKey(key) ? key : null;
}
