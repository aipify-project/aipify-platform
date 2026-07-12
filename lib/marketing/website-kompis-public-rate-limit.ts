/** In-memory layered rate limits for public Website Kompis embed operations. */

export type WebsiteKompisPublicRateLimitCategory = "bootstrap" | "launcher" | "ask";

type RateBucket = { count: number; firstAt: number };

const buckets = new Map<string, RateBucket>();

export const WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY = {
  bootstrap: {
    windowMs: 15 * 60 * 1000,
    ipMax: 60,
    installMax: 30,
  },
  launcher: {
    windowMs: 60 * 1000,
    ipMax: 120,
    installMax: 60,
    tenantMax: 300,
  },
  ask: {
    windowMs: 60 * 1000,
    ipMax: 30,
    installMax: 20,
    tenantMax: 100,
  },
} as const;

export function websiteKompisPublicClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "unknown"
  );
}

export type WebsiteKompisPublicRateLimitResult =
  | { allowed: true }
  | { allowed: false; bucket: string; retryAfterSeconds: number };

function consumeLimit(input: {
  key: string;
  windowMs: number;
  max: number;
  now?: number;
}): WebsiteKompisPublicRateLimitResult {
  const now = input.now ?? Date.now();
  const entry = buckets.get(input.key);

  if (!entry || now - entry.firstAt > input.windowMs) {
    buckets.set(input.key, { count: 1, firstAt: now });
    return { allowed: true };
  }

  entry.count += 1;
  if (entry.count <= input.max) {
    return { allowed: true };
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((input.windowMs - (now - entry.firstAt)) / 1000),
  );
  return { allowed: false, bucket: input.key, retryAfterSeconds };
}

export function resetWebsiteKompisPublicRateLimitsForTests(): void {
  buckets.clear();
}

export function assertWebsiteKompisPublicRateLimit(input: {
  category: WebsiteKompisPublicRateLimitCategory;
  ip: string;
  installId?: string | null;
  tenantId?: string | null;
  now?: number;
}): WebsiteKompisPublicRateLimitResult {
  const policy = WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY[input.category];
  const checks: Array<{ key: string; windowMs: number; max: number }> = [
    {
      key: `${input.category}:ip:${input.ip}`,
      windowMs: policy.windowMs,
      max: policy.ipMax,
    },
  ];

  if (input.installId?.trim()) {
    checks.push({
      key: `${input.category}:install:${input.installId.trim().toLowerCase()}`,
      windowMs: policy.windowMs,
      max: policy.installMax,
    });
  }

  if ("tenantMax" in policy && input.tenantId?.trim()) {
    checks.push({
      key: `${input.category}:tenant:${input.tenantId.trim()}`,
      windowMs: policy.windowMs,
      max: policy.tenantMax,
    });
  }

  for (const check of checks) {
    const result = consumeLimit({
      key: check.key,
      windowMs: check.windowMs,
      max: check.max,
      now: input.now,
    });
    if (!result.allowed) {
      return result;
    }
  }

  return { allowed: true };
}
