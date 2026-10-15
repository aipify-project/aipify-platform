/**
 * Client-side UX helpers for Platform Super Admin insight (Konsernoversikt).
 * Timeout is a presentation fallback only — not proof of Core/RPC failure.
 */
export const PLATFORM_SUPER_ADMIN_INSIGHT_FETCH_TIMEOUT_MS = 12_000;

export function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = "name" in error ? String((error as { name?: unknown }).name) : "";
  return name === "AbortError";
}

/** Starts a timeout that aborts the controller; caller must clear on settle. */
export function armInsightFetchTimeout(
  controller: AbortController,
  timeoutMs: number = PLATFORM_SUPER_ADMIN_INSIGHT_FETCH_TIMEOUT_MS,
): () => void {
  const timer = setTimeout(() => {
    if (!controller.signal.aborted) {
      controller.abort();
    }
  }, timeoutMs);
  return () => clearTimeout(timer);
}
