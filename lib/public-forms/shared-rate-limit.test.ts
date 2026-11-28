import assert from "node:assert/strict";
import test from "node:test";
import {
  consumeSharedRateLimit,
  createUpstashRestBackend,
  isUpstashRestUrl,
  resolveSharedRateLimitRestCredentials,
} from "@/lib/public-forms/shared-rate-limit";

test("accepts only HTTPS Upstash REST URLs", () => {
  assert.equal(isUpstashRestUrl("https://example.upstash.io"), true);
  assert.equal(isUpstashRestUrl("https://example.upstash.io/"), true);
  assert.equal(isUpstashRestUrl("rediss://default:secret@example.upstash.io:6379"), false);
  assert.equal(isUpstashRestUrl("redis://localhost:6379"), false);
  assert.equal(isUpstashRestUrl("https://evil.example"), false);
  assert.equal(isUpstashRestUrl(""), false);
});

test("prefers documented REST pair when it is a valid HTTPS Upstash URL", () => {
  const credentials = resolveSharedRateLimitRestCredentials({
    UPSTASH_REDIS_REST_URL: "https://primary.upstash.io/",
    UPSTASH_REDIS_REST_TOKEN: "Bearer primary-token",
    UPSTASH_REDIS_REST_KV_REST_API_URL: "https://marketplace.upstash.io",
    UPSTASH_REDIS_REST_KV_REST_API_TOKEN: "marketplace-token",
  } as unknown as NodeJS.ProcessEnv);
  assert.deepEqual(credentials, {
    url: "https://primary.upstash.io",
    token: "primary-token",
  });
});

test("falls back to Marketplace KV REST names when documented pair is missing or redis URL", () => {
  const missing = resolveSharedRateLimitRestCredentials({
    UPSTASH_REDIS_REST_KV_REST_API_URL: "https://marketplace.upstash.io",
    UPSTASH_REDIS_REST_KV_REST_API_TOKEN: "marketplace-token",
  } as unknown as NodeJS.ProcessEnv);
  assert.deepEqual(missing, {
    url: "https://marketplace.upstash.io",
    token: "marketplace-token",
  });

  const redisDoc = resolveSharedRateLimitRestCredentials({
    UPSTASH_REDIS_REST_URL: "rediss://default:x@example.upstash.io:6379",
    UPSTASH_REDIS_REST_TOKEN: "ignored",
    UPSTASH_REDIS_REST_KV_REST_API_URL: "https://marketplace.upstash.io",
    UPSTASH_REDIS_REST_KV_REST_API_TOKEN: "marketplace-token",
  } as unknown as NodeJS.ProcessEnv);
  assert.deepEqual(redisDoc, {
    url: "https://marketplace.upstash.io",
    token: "marketplace-token",
  });
});

test("fails closed when no usable REST credentials exist", () => {
  assert.equal(resolveSharedRateLimitRestCredentials({} as unknown as NodeJS.ProcessEnv), null);
  assert.equal(
    createUpstashRestBackend({
      url: "rediss://default:x@example.upstash.io:6379",
      token: "token",
    }),
    null,
  );
});

test("valid Redis pipeline response allows the request", async () => {
  const backend = createUpstashRestBackend({
    url: "https://example.upstash.io",
    token: "test-token",
    fetchImpl: async () =>
      new Response(
        JSON.stringify([{ result: 1 }, { result: 1 }, { result: 900 }]),
        { status: 200 },
      ),
  });
  assert.ok(backend);
  const decision = await consumeSharedRateLimit({
    key: "k",
    limit: 8,
    windowSeconds: 900,
    backend,
  });
  assert.deepEqual(decision, { ok: true });
});

test("over-limit Redis response becomes 429", async () => {
  const backend = createUpstashRestBackend({
    url: "https://example.upstash.io",
    token: "test-token",
    fetchImpl: async () =>
      new Response(
        JSON.stringify([{ result: 9 }, { result: 0 }, { result: 120 }]),
        { status: 200 },
      ),
  });
  assert.ok(backend);
  const decision = await consumeSharedRateLimit({
    key: "k",
    limit: 8,
    windowSeconds: 900,
    backend,
  });
  assert.deepEqual(decision, { ok: false, status: 429, retryAfterSeconds: 120 });
});

test("provider HTTP error or pipeline error fails closed with 503", async () => {
  const httpFail = createUpstashRestBackend({
    url: "https://example.upstash.io",
    token: "test-token",
    fetchImpl: async () => new Response("nope", { status: 401 }),
  });
  assert.ok(httpFail);
  assert.deepEqual(
    await consumeSharedRateLimit({
      key: "k",
      limit: 8,
      windowSeconds: 900,
      backend: httpFail,
    }),
    { ok: false, status: 503, unavailable: true },
  );

  const rowFail = createUpstashRestBackend({
    url: "https://example.upstash.io",
    token: "test-token",
    fetchImpl: async () =>
      new Response(
        JSON.stringify([{ result: 1 }, { error: "ERR" }, { result: -1 }]),
        { status: 200 },
      ),
  });
  assert.ok(rowFail);
  assert.deepEqual(
    await consumeSharedRateLimit({
      key: "k",
      limit: 8,
      windowSeconds: 900,
      backend: rowFail,
    }),
    { ok: false, status: 503, unavailable: true },
  );

  const timeout = createUpstashRestBackend({
    url: "https://example.upstash.io",
    token: "test-token",
    fetchImpl: async () => {
      throw new Error("timeout");
    },
  });
  assert.ok(timeout);
  assert.deepEqual(
    await consumeSharedRateLimit({
      key: "k",
      limit: 8,
      windowSeconds: 900,
      backend: timeout,
    }),
    { ok: false, status: 503, unavailable: true },
  );

  assert.deepEqual(
    await consumeSharedRateLimit({
      key: "k",
      limit: 8,
      windowSeconds: 900,
      backend: null,
    }),
    { ok: false, status: 503, unavailable: true },
  );
});
