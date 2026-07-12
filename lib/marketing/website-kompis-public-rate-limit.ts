import "server-only";

import { createHmac } from "node:crypto";
import {
  createWebsiteKompisMemoryRateLimitStore,
  type WebsiteKompisRateLimitBucketScope,
  type WebsiteKompisRateLimitStore,
} from "@/lib/marketing/website-kompis-rate-limit-store";
import {
  isWebsiteKompisProductionLikeRateLimitRuntime,
  resolveWebsiteKompisRateLimitStore,
  resetWebsiteKompisRateLimitStoreForTests,
  setWebsiteKompisRateLimitStoreForTests,
} from "@/lib/marketing/website-kompis-upstash-rate-limit-store";

export type WebsiteKompisPublicRateLimitCategory = "bootstrap" | "launcher" | "ask";

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

/**
 * Vercel forwards the client IP in `x-forwarded-for` (first hop) and `x-real-ip`.
 * Only the first forwarded hop is used; arbitrary tail values are ignored.
 */
export function websiteKompisPublicClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstHop = forwarded.split(",")[0]?.trim();
    if (firstHop && isWebsiteKompisIpLiteral(firstHop)) {
      return normalizeWebsiteKompisIpLiteral(firstHop);
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && isWebsiteKompisIpLiteral(realIp)) {
    return normalizeWebsiteKompisIpLiteral(realIp);
  }

  return null;
}

function isWebsiteKompisIpLiteral(value: string): boolean {
  if (!value || value.length > 128) {
    return false;
  }

  if (value.includes(":")) {
    return /^[0-9a-f:.]+$/i.test(value);
  }

  return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(value);
}

function normalizeWebsiteKompisIpLiteral(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.startsWith("::ffff:")) {
    return trimmed.slice("::ffff:".length);
  }
  return trimmed;
}

function resolveWebsiteKompisRateLimitIpHashSecret(): string | null {
  const dedicated = process.env.WEBSITE_KOMPIS_RATE_LIMIT_IP_HASH_SECRET?.trim();
  if (dedicated) {
    return dedicated;
  }

  const embedSessionSecret = process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET?.trim();
  if (embedSessionSecret) {
    return embedSessionSecret;
  }

  const cronSecret = process.env.CRON_SECRET?.trim();
  return cronSecret || null;
}

export function hashWebsiteKompisRateLimitIpIdentifier(ip: string | null): string | null {
  const secret = resolveWebsiteKompisRateLimitIpHashSecret();
  if (!secret) {
    return null;
  }

  const normalized = ip ? normalizeWebsiteKompisIpLiteral(ip) : "missing-client-ip";
  return createHmac("sha256", secret)
    .update(`website-kompis-rate-limit-ip:v1:${normalized}`)
    .digest("hex");
}

export function resolveWebsiteKompisRateLimitEnvironmentNamespace(): string {
  const vercelEnv = process.env.VERCEL_ENV?.trim();
  if (vercelEnv === "production" || vercelEnv === "preview" || vercelEnv === "development") {
    return vercelEnv;
  }
  if (process.env.NODE_ENV === "production") {
    return "production";
  }
  return "development";
}

export function buildWebsiteKompisRateLimitRedisKey(input: {
  category: WebsiteKompisPublicRateLimitCategory;
  scope: WebsiteKompisRateLimitBucketScope;
  identifier: string;
}): string {
  const env = resolveWebsiteKompisRateLimitEnvironmentNamespace();
  return `website-kompis:${env}:${input.category}:${input.scope}:${input.identifier}`;
}

export type WebsiteKompisPublicRateLimitResult =
  | { allowed: true }
  | { allowed: false; backendUnavailable: true; status: 503 }
  | { allowed: false; bucket: string; retryAfterSeconds: number; status: 429 };

function normalizeInstallReference(installId: string): string {
  return installId.trim().toLowerCase();
}

function normalizeTenantReference(tenantId: string): string {
  return tenantId.trim();
}

async function consumeBucket(input: {
  store: WebsiteKompisRateLimitStore;
  key: string;
  windowSeconds: number;
  max: number;
  nowMs?: number;
}): Promise<WebsiteKompisPublicRateLimitResult | { backendUnavailable: true }> {
  const result = await input.store.consume({
    key: input.key,
    windowSeconds: input.windowSeconds,
    max: input.max,
    nowMs: input.nowMs,
  });

  if (!result.ok) {
    return { backendUnavailable: true };
  }

  if (result.count > input.max) {
    return {
      allowed: false,
      bucket: input.key,
      retryAfterSeconds: Math.max(1, result.ttlSeconds),
      status: 429,
    };
  }

  return { allowed: true };
}

export async function assertWebsiteKompisPublicRateLimit(input: {
  category: WebsiteKompisPublicRateLimitCategory;
  request: Request;
  installId?: string | null;
  tenantId?: string | null;
  scopes?: WebsiteKompisRateLimitBucketScope[];
  nowMs?: number;
  store?: WebsiteKompisRateLimitStore;
}): Promise<WebsiteKompisPublicRateLimitResult> {
  const policy = WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY[input.category];
  const windowSeconds = Math.ceil(policy.windowMs / 1000);
  const scopes = input.scopes ?? ["ip", "install", "tenant"];
  const store = input.store ?? resolveWebsiteKompisRateLimitStore();

  const checks: Array<{ scope: WebsiteKompisRateLimitBucketScope; key: string; max: number }> = [];

  if (scopes.includes("ip")) {
    const ipHash = hashWebsiteKompisRateLimitIpIdentifier(websiteKompisPublicClientIp(input.request));
    if (!ipHash) {
      return { allowed: false, backendUnavailable: true, status: 503 };
    }
    checks.push({
      scope: "ip",
      key: buildWebsiteKompisRateLimitRedisKey({
        category: input.category,
        scope: "ip",
        identifier: ipHash,
      }),
      max: policy.ipMax,
    });
  }

  if (scopes.includes("install") && input.installId?.trim()) {
    checks.push({
      scope: "install",
      key: buildWebsiteKompisRateLimitRedisKey({
        category: input.category,
        scope: "install",
        identifier: normalizeInstallReference(input.installId),
      }),
      max: policy.installMax,
    });
  }

  if (scopes.includes("tenant") && "tenantMax" in policy && input.tenantId?.trim()) {
    checks.push({
      scope: "tenant",
      key: buildWebsiteKompisRateLimitRedisKey({
        category: input.category,
        scope: "tenant",
        identifier: normalizeTenantReference(input.tenantId),
      }),
      max: policy.tenantMax,
    });
  }

  for (const check of checks) {
    const result = await consumeBucket({
      store,
      key: check.key,
      windowSeconds,
      max: check.max,
      nowMs: input.nowMs,
    });

    if ("backendUnavailable" in result) {
      return { allowed: false, backendUnavailable: true, status: 503 };
    }

    if (!result.allowed) {
      return result;
    }
  }

  return { allowed: true };
}

export function resetWebsiteKompisPublicRateLimitsForTests(): void {
  resetWebsiteKompisRateLimitStoreForTests();
}

export function configureWebsiteKompisPublicRateLimitsForTests(input: {
  store?: WebsiteKompisRateLimitStore;
  sharedState?: Map<string, { count: number; expiresAt: number }>;
}): WebsiteKompisRateLimitStore {
  const store =
    input.store ??
    createWebsiteKompisMemoryRateLimitStore(
      input.sharedState as Map<string, { count: number; expiresAt: number }> | undefined,
    );
  setWebsiteKompisRateLimitStoreForTests(store);
  return store;
}

export function clearWebsiteKompisPublicRateLimitsForTests(): void {
  resetWebsiteKompisRateLimitStoreForTests();
}

export { isWebsiteKompisProductionLikeRateLimitRuntime };
