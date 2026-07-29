/** Client-safe idempotency helpers for Kompis Operator. */

export function createKompisOperatorIdempotencyKey(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 16)
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return `kor-${rand}`;
}
