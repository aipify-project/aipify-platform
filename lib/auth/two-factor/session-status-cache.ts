import type { TwoFactorStatus } from "./requires-2fa";

const CACHE_KEY = "aipify-2fa-status-cache";
const CACHE_TTL_MS = 5 * 60 * 1000;

type CachedTwoFactorStatus = {
  status: TwoFactorStatus;
  cachedAt: number;
};

export async function fetchTwoFactorStatusCached(): Promise<TwoFactorStatus | null> {
  if (typeof window !== "undefined") {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CachedTwoFactorStatus;
        if (Date.now() - parsed.cachedAt < CACHE_TTL_MS) {
          return parsed.status;
        }
      } catch {
        window.sessionStorage.removeItem(CACHE_KEY);
      }
    }
  }

  const res = await fetch("/api/auth/2fa/status");
  if (!res.ok) {
    return null;
  }

  const status = (await res.json()) as TwoFactorStatus;
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ status, cachedAt: Date.now() } satisfies CachedTwoFactorStatus)
    );
  }
  return status;
}

export function invalidateTwoFactorStatusCache(): void {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(CACHE_KEY);
  }
}
