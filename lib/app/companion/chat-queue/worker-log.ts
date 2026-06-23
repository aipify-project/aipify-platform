export function logCompanionWorkerEvent(
  event: string,
  details: Record<string, string | number | boolean | undefined>,
): void {
  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(details)) {
    if (value === undefined) continue;
    safe[key] = value;
  }
  console.info("[companion-queue-worker]", event, safe);
}
