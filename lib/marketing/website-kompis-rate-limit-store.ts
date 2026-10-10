/** Shared rate-limit store contract for Website Kompis public surfaces. */

export type WebsiteKompisRateLimitBucketScope = "ip" | "install" | "tenant";

export type WebsiteKompisRateLimitStoreConsumeInput = {
  key: string;
  windowSeconds: number;
  max: number;
  nowMs?: number;
};

export type WebsiteKompisRateLimitStoreConsumeSuccess = {
  ok: true;
  count: number;
  ttlSeconds: number;
};

export type WebsiteKompisRateLimitStoreConsumeFailure = {
  ok: false;
  reason: "unavailable" | "timeout" | "invalid_response";
};

export type WebsiteKompisRateLimitStoreConsumeResult =
  | WebsiteKompisRateLimitStoreConsumeSuccess
  | WebsiteKompisRateLimitStoreConsumeFailure;

export type WebsiteKompisRateLimitStore = {
  consume(input: WebsiteKompisRateLimitStoreConsumeInput): Promise<WebsiteKompisRateLimitStoreConsumeResult>;
};

type MemoryEntry = { count: number; expiresAt: number };

export function createWebsiteKompisMemoryRateLimitStore(
  sharedState?: Map<string, MemoryEntry>,
): WebsiteKompisRateLimitStore {
  const buckets = sharedState ?? new Map<string, MemoryEntry>();

  return {
    async consume(input) {
      const nowMs = input.nowMs ?? Date.now();
      const windowMs = input.windowSeconds * 1000;
      const entry = buckets.get(input.key);

      if (!entry || entry.expiresAt <= nowMs) {
        buckets.set(input.key, { count: 1, expiresAt: nowMs + windowMs });
        return { ok: true, count: 1, ttlSeconds: input.windowSeconds };
      }

      entry.count += 1;
      const ttlSeconds = Math.max(1, Math.ceil((entry.expiresAt - nowMs) / 1000));
      return { ok: true, count: entry.count, ttlSeconds };
    },
  };
}

export function createWebsiteKompisUnavailableRateLimitStore(): WebsiteKompisRateLimitStore {
  return {
    async consume() {
      return { ok: false, reason: "unavailable" };
    },
  };
}
