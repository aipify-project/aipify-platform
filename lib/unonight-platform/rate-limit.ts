type RateBucket = { count: number; firstAt: number };

const buckets = new Map<string, RateBucket>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_SUCCESS = 120;
const MAX_FAILURE = 30;

export function clientIpFromRequest(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

function checkLimit(key: string, max: number): RateLimitResult {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now - entry.firstAt > WINDOW_MS) {
    buckets.set(key, { count: 1, firstAt: now });
    return { allowed: true };
  }

  entry.count += 1;
  if (entry.count <= max) {
    return { allowed: true };
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((WINDOW_MS - (now - entry.firstAt)) / 1000)
  );
  return { allowed: false, retryAfterSeconds };
}

export function checkUnonightConnectionRateLimit(
  ip: string,
  outcome: "success" | "failure"
): RateLimitResult {
  const max = outcome === "failure" ? MAX_FAILURE : MAX_SUCCESS;
  return checkLimit(`unonight-connection:${outcome}:${ip}`, max);
}
