const inFlight = new Map<string, Promise<unknown>>();

export async function dedupeFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const pending = inFlight.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  const promise = fetcher().finally(() => {
    inFlight.delete(key);
  });

  inFlight.set(key, promise);
  return promise;
}

export function cancelPendingFetches(): void {
  inFlight.clear();
}
