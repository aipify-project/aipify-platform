type CleanupFn = () => void;

const cleanups = new Set<CleanupFn>();

export function registerPollingCleanup(cleanup: CleanupFn): () => void {
  cleanups.add(cleanup);
  return () => {
    cleanups.delete(cleanup);
  };
}

export function runAllPollingCleanups(): void {
  for (const cleanup of cleanups) {
    try {
      cleanup();
    } catch {
      // Best-effort teardown during logout.
    }
  }
  cleanups.clear();
}
