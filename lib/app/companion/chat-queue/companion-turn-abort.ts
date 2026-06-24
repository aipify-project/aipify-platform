export function throwIfCompanionTurnAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException("companion_turn_aborted", "AbortError");
  }
}
