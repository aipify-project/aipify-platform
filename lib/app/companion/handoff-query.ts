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
