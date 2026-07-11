/** Whether a drawer handoff query should populate the expanded composer. */
export function shouldPopulateHandoffComposer(
  query: string | undefined | null,
): query is string {
  return Boolean(query?.trim());
}

/** Whether a drawer handoff query should auto-enqueue (once per distinct query). */
export function shouldAutoSubmitHandoffQuery(
  query: string | undefined | null,
  hydrated: boolean,
  lastSubmitted: string | null
): query is string {
  const trimmed = query?.trim();
  if (!trimmed || !hydrated) return false;
  return trimmed !== lastSubmitted;
}
