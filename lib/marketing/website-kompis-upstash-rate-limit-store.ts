import "server-only";

import { Redis } from "@upstash/redis";
import {
  createWebsiteKompisMemoryRateLimitStore,
  createWebsiteKompisUnavailableRateLimitStore,
  type WebsiteKompisRateLimitStore,
  type WebsiteKompisRateLimitStoreConsumeResult,
} from "@/lib/marketing/website-kompis-rate-limit-store";

const ATOMIC_INCR_WITH_EXPIRE_SCRIPT = `
local current = redis.call("INCR", KEYS[1])
if tonumber(current) == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end
local ttl = redis.call("TTL", KEYS[1])
return {current, ttl}
`;

const REDIS_TIMEOUT_MS = 2_000;

let redisClient: Redis | null | undefined;
let unavailableStore: WebsiteKompisRateLimitStore | null = null;

function hasUpstashEnvConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

function getRedisClient(): Redis | null {
  if (redisClient !== undefined) {
    return redisClient;
  }

  if (!hasUpstashEnvConfigured()) {
    redisClient = null;
    return redisClient;
  }

  redisClient = Redis.fromEnv();
  return redisClient;
}

function parseConsumeResult(value: unknown): WebsiteKompisRateLimitStoreConsumeResult {
  if (!Array.isArray(value) || value.length !== 2) {
    return { ok: false, reason: "invalid_response" };
  }

  const count = Number(value[0]);
  const ttlSeconds = Number(value[1]);
  if (!Number.isFinite(count) || !Number.isFinite(ttlSeconds) || count < 1 || ttlSeconds < 1) {
    return { ok: false, reason: "invalid_response" };
  }

  return { ok: true, count, ttlSeconds };
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("timeout")), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export function isWebsiteKompisProductionLikeRateLimitRuntime(): boolean {
  const vercelEnv = process.env.VERCEL_ENV?.trim();
  if (vercelEnv === "production" || vercelEnv === "preview") {
    return true;
  }
  return process.env.NODE_ENV === "production";
}

export function createWebsiteKompisUpstashRateLimitStore(): WebsiteKompisRateLimitStore {
  const redis = getRedisClient();
  if (!redis) {
    return createWebsiteKompisUnavailableRateLimitStore();
  }

  return {
    async consume(input) {
      try {
        const result = await withTimeout(
          redis.eval(ATOMIC_INCR_WITH_EXPIRE_SCRIPT, [input.key], [
            String(input.windowSeconds),
          ]),
          REDIS_TIMEOUT_MS,
        );
        return parseConsumeResult(result);
      } catch {
        return { ok: false, reason: "timeout" };
      }
    },
  };
}

let injectedStore: WebsiteKompisRateLimitStore | null | undefined;

export function setWebsiteKompisRateLimitStoreForTests(
  store: WebsiteKompisRateLimitStore | null,
): void {
  injectedStore = store;
}

export function resetWebsiteKompisRateLimitStoreForTests(): void {
  injectedStore = undefined;
  redisClient = undefined;
  unavailableStore = null;
}

export function resolveWebsiteKompisRateLimitStore(): WebsiteKompisRateLimitStore {
  if (injectedStore !== undefined) {
    return injectedStore ?? createWebsiteKompisUnavailableRateLimitStore();
  }

  if (hasUpstashEnvConfigured()) {
    return createWebsiteKompisUpstashRateLimitStore();
  }

  if (isWebsiteKompisProductionLikeRateLimitRuntime()) {
    if (!unavailableStore) {
      unavailableStore = createWebsiteKompisUnavailableRateLimitStore();
    }
    return unavailableStore;
  }

  return createWebsiteKompisMemoryRateLimitStore();
}
