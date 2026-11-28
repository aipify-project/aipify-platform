/**
 * Shared public-form rate limit.
 *
 * Prefer the Aipify Core Redis Marketplace pair
 * (`AIPIFY_CORE_REDIS_KV_REST_API_URL` + `AIPIFY_CORE_REDIS_KV_REST_API_TOKEN`,
 * write token only). When that pair is present but incomplete or invalid,
 * fail closed — never mix credentials across pairs and never fall through
 * on a partial Core config. When Core is unset, keep legacy compatibility:
 * documented `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, then
 * Marketplace / KV REST aliases. One counter is visible to every Vercel
 * instance. No new service and no new dependency.
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

export type SharedRateLimitRestCredentials = {
  url: string;
  token: string;
};

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

type UpstashPipelineRow = { result?: unknown; error?: unknown };

/** HTTPS Upstash REST base URL only — never redis:// or credential-bearing URLs. */
export function isUpstashRestUrl(value: string | null | undefined): boolean {
  const raw = value?.trim() ?? "";
  if (!raw) return false;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:") return false;
    if (parsed.username || parsed.password) return false;
    const host = parsed.hostname.toLowerCase();
    return host === "upstash.io" || host.endsWith(".upstash.io");
  } catch {
    return false;
  }
}

function normalizeRestToken(token: string): string {
  return token.replace(/^Bearer\s+/i, "").trim();
}

function envPair(
  env: NodeJS.ProcessEnv,
  urlKey: string,
  tokenKey: string,
): { url: string; token: string } {
  const record = env as Record<string, string | undefined>;
  return {
    url: record[urlKey]?.trim() ?? "",
    token: record[tokenKey]?.trim() ?? "",
  };
}

function usableRestPair(pair: {
  url: string;
  token: string;
}): SharedRateLimitRestCredentials | null {
  const token = normalizeRestToken(pair.token);
  if (!isUpstashRestUrl(pair.url) || !token) return null;
  return {
    url: pair.url.replace(/\/$/, ""),
    token,
  };
}

/**
 * Resolve REST credentials. Core Redis pair wins when configured; a partial
 * or invalid Core pair fails closed. Legacy pairs apply only when Core is
 * unset. Never mix URL/token across pairs. Never use READ_ONLY tokens.
 */
export function resolveSharedRateLimitRestCredentials(
  env: NodeJS.ProcessEnv = process.env,
): SharedRateLimitRestCredentials | null {
  const core = envPair(
    env,
    "AIPIFY_CORE_REDIS_KV_REST_API_URL",
    "AIPIFY_CORE_REDIS_KV_REST_API_TOKEN",
  );
  if (core.url || core.token) {
    return usableRestPair(core);
  }

  const legacyCandidates = [
    envPair(env, "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"),
    envPair(
      env,
      "UPSTASH_REDIS_REST_KV_REST_API_URL",
      "UPSTASH_REDIS_REST_KV_REST_API_TOKEN",
    ),
    envPair(env, "KV_REST_API_URL", "KV_REST_API_TOKEN"),
  ];

  for (const candidate of legacyCandidates) {
    const resolved = usableRestPair(candidate);
    if (resolved) return resolved;
  }
  return null;
}

export function createUpstashRestBackend(input: {
  url?: string | null;
  token?: string | null;
  fetchImpl?: typeof fetch;
}): SharedRateLimitBackend | null {
  const url = input.url?.trim().replace(/\/$/, "") ?? "";
  const token = normalizeRestToken(input.token?.trim() ?? "");
  if (!isUpstashRestUrl(url) || !token) return null;
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
          ["EXPIRE", key, windowSeconds, "NX"],
          ["TTL", key],
        ]),
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("shared_rate_limit_unavailable");
      }
      const payload = (await response.json()) as UpstashPipelineRow[];
      if (!Array.isArray(payload) || payload.some((row) => row?.error != null)) {
        throw new Error("shared_rate_limit_unavailable");
      }
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
  const credentials = resolveSharedRateLimitRestCredentials();
  if (!credentials) return null;
  return createUpstashRestBackend(credentials);
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
