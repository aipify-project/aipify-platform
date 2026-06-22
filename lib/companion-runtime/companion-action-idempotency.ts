const executedKeys = new Map<string, string>();

function buildIdempotencyScope(organizationId: string | null, idempotencyKey: string): string {
  return `${organizationId ?? "unknown"}::${idempotencyKey}`;
}

export function isValidIdempotencyKey(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length >= 8 && trimmed.length <= 128;
}

export function hasDuplicateIdempotencyKey(
  organizationId: string | null,
  idempotencyKey: string | null | undefined,
): boolean {
  if (!idempotencyKey || !isValidIdempotencyKey(idempotencyKey)) return false;
  return executedKeys.has(buildIdempotencyScope(organizationId, idempotencyKey));
}

export function recordIdempotentExecution(
  organizationId: string | null,
  idempotencyKey: string,
  executionId: string,
): void {
  executedKeys.set(buildIdempotencyScope(organizationId, idempotencyKey), executionId);
}

export function getIdempotentExecutionId(
  organizationId: string | null,
  idempotencyKey: string,
): string | null {
  return executedKeys.get(buildIdempotencyScope(organizationId, idempotencyKey)) ?? null;
}

export function clearIdempotencyRegistryForTests(): void {
  executedKeys.clear();
}
