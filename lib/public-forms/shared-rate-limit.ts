/**
 * Shared public-form rate limit.
 *
 * Uses the Upstash Redis REST store already configured for this app
 * (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN). One counter is visible
 * to every Vercel instance. No new service and no new dependency.
 *
 * Missing configuration or a store error fails closed. Callers must not
 * treat that as a stored submission.
 */

export const PUBLIC_SUPPORT_INTAKE_RATE = {
  limit: 8,
  windowSeconds: 15 * 60,
} as const;

export type SharedRateCount = {
  count: number;
  ttlSeconds: number;
};

export type SharedRateLimitBackend = {
  increment(key: string, windowSeconds: number): Promise<SharedRateCount>;
};

export type SharedRateLimitDecision =
  | { ok: true }
  | { ok: false; status: 429; retryAfterSeconds: number }
  | { ok: false; status: 503; unavailable: true };

type MemoryBucket = { count: number; expiresAt: number };

export function createMemoryRateLimitBackend(
  now: () => number = Date.now,
): SharedRateLimitBackend {
  const buckets = new Map<string, MemoryBucket>();
  return {
    async increment(key, windowSeconds) {
      const current = now();
      const existing = buckets.get(key);
      if (!existing || existing.expiresAt <= current) {
        buckets.set(key, { count: 1, expiresAt: current + windowSeconds * 1000 });
        return { count: 1, ttlSeconds: windowSeconds };
      }
      existing.count += 1;
      return {
        count: existing.count,
        ttlSeconds: Math.max(1, Math.ceil((existing.expiresAt - current) / 1000)),
      };
    },
  };
}

type UpstashPipelineRow = { result?: unknown };

export function createUpstashRestBackend(input: {
  url?: string | null;
  token?: string | null;
  fetchImpl?: typeof fetch;
}): SharedRateLimitBackend | null {
  const url = input.url?.trim().replace(/\/$/, "") ?? "";
  const token = input.token?.trim() ?? "";
  if (!url || !token) return null;
  const fetchImpl = input.fetchImpl ?? fetch;
  return {
    async increment(key, windowSeconds) {
      const response = await fetchImpl(`${url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, String(windowSeconds), "NX"],
          ["TTL", key],
        ]),
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("shared_rate_limit_unavailable");
      }
      const payload = (await response.json()) as UpstashPipelineRow[];
      const count = Number(payload[0]?.result);
      const ttl = Number(payload[2]?.result);
      if (!Number.isFinite(count)) {
        throw new Error("shared_rate_limit_unavailable");
      }
      return {
        count,
        ttlSeconds: Number.isFinite(ttl) && ttl > 0 ? ttl : windowSeconds,
      };
    },
  };
}

let testBackend: SharedRateLimitBackend | null | undefined;

/** Test hook. Pass undefined to use the process environment again. */
export function setSharedRateLimitBackendForTests(
  backend: SharedRateLimitBackend | null | undefined,
) {
  testBackend = backend;
}

export function resolveSharedRateLimitBackend(): SharedRateLimitBackend | null {
  if (testBackend !== undefined) return testBackend;
  return createUpstashRestBackend({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export async function consumeSharedRateLimit(input: {
  key: string;
  limit: number;
  windowSeconds: number;
  backend?: SharedRateLimitBackend | null;
}): Promise<SharedRateLimitDecision> {
  const backend =
    input.backend === undefined ? resolveSharedRateLimitBackend() : input.backend;
  if (!backend) return { ok: false, status: 503, unavailable: true };
  try {
    const result = await backend.increment(input.key, input.windowSeconds);
    if (result.count <= input.limit) return { ok: true };
    return { ok: false, status: 429, retryAfterSeconds: result.ttlSeconds };
  } catch {
    return { ok: false, status: 503, unavailable: true };
  }
}
