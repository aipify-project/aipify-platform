/**
 * Pure OpenAI-compatible HTTP error classification for Kompis grounded completion.
 * No secrets, prompts, or full provider message bodies are retained.
 */

export type KompisProviderErrorCategory =
  | "rate_limit"
  | "quota_or_billing"
  | "auth"
  | "server"
  | "client"
  | "unknown";

export type KompisProviderHttpClassification = {
  errorCode: string;
  httpStatus: number;
  category: KompisProviderErrorCategory;
  providerErrorType: string | null;
  providerErrorCode: string | null;
  requestId: string | null;
  retryAfterSeconds: number | null;
  retryable: boolean;
};

const QUOTA_OR_BILLING_CODES = new Set([
  "insufficient_quota",
  "credit_balance_exhausted",
  "organization_spend_limit_exceeded",
  "project_spend_limit_exceeded",
  "organization_usage_limit_exceeded",
  "billing_not_active",
]);

const TRANSIENT_RATE_CODES = new Set([
  "rate_limit_exceeded",
  "slow_down",
  "rate_limit_error",
]);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function sanitizeToken(value: unknown, max = 64): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function parseRetryAfterSeconds(header: string | null): number | null {
  if (!header) return null;
  const trimmed = header.trim();
  if (!trimmed) return null;
  const asNumber = Number(trimmed);
  if (Number.isFinite(asNumber) && asNumber >= 0) {
    return Math.min(Math.floor(asNumber), 3600);
  }
  const asDate = Date.parse(trimmed);
  if (!Number.isFinite(asDate)) return null;
  const seconds = Math.ceil((asDate - Date.now()) / 1000);
  if (!Number.isFinite(seconds) || seconds < 0) return null;
  return Math.min(seconds, 3600);
}

export function classifyKompisProviderHttpError(input: {
  status: number;
  body?: unknown;
  requestIdHeader?: string | null;
  retryAfterHeader?: string | null;
}): KompisProviderHttpClassification {
  const body = asRecord(input.body);
  const error = asRecord(body.error);
  const providerErrorType = sanitizeToken(error.type);
  const providerErrorCode = sanitizeToken(error.code);
  const requestId =
    sanitizeToken(input.requestIdHeader, 80) ||
    sanitizeToken(body.request_id, 80) ||
    sanitizeToken(error.request_id, 80);
  const retryAfterSeconds = parseRetryAfterSeconds(input.retryAfterHeader ?? null);

  if (input.status === 429) {
    const code = providerErrorCode ?? "";
    const type = providerErrorType ?? "";
    const isQuota =
      QUOTA_OR_BILLING_CODES.has(code) ||
      type === "insufficient_quota" ||
      code.includes("spend_limit") ||
      code.includes("usage_limit") ||
      code.includes("credit_balance");

    if (isQuota) {
      return {
        errorCode: "provider_quota_exhausted",
        httpStatus: 429,
        category: "quota_or_billing",
        providerErrorType,
        providerErrorCode,
        requestId,
        retryAfterSeconds,
        retryable: false,
      };
    }

    const isTransientRate =
      TRANSIENT_RATE_CODES.has(code) ||
      type === "rate_limit_error" ||
      code.includes("rate_limit") ||
      // Unknown 429 without quota markers — treat as rate limit but only retry
      // when Retry-After is present and within the caller budget.
      (!providerErrorCode && !providerErrorType);

    return {
      errorCode: "provider_rate_limited",
      httpStatus: 429,
      category: "rate_limit",
      providerErrorType,
      providerErrorCode,
      requestId,
      retryAfterSeconds,
      retryable: isTransientRate && retryAfterSeconds != null && retryAfterSeconds <= 30,
    };
  }

  if (input.status === 401 || input.status === 403) {
    return {
      errorCode: "provider_http_error",
      httpStatus: input.status,
      category: "auth",
      providerErrorType,
      providerErrorCode,
      requestId,
      retryAfterSeconds,
      retryable: false,
    };
  }

  if (input.status >= 500) {
    return {
      errorCode: "provider_http_5xx",
      httpStatus: input.status,
      category: "server",
      providerErrorType,
      providerErrorCode,
      requestId,
      retryAfterSeconds,
      retryable: true,
    };
  }

  if (input.status >= 400) {
    return {
      errorCode: "provider_http_error",
      httpStatus: input.status,
      category: "client",
      providerErrorType,
      providerErrorCode,
      requestId,
      retryAfterSeconds,
      retryable: false,
    };
  }

  return {
    errorCode: "provider_http_error",
    httpStatus: input.status,
    category: "unknown",
    providerErrorType,
    providerErrorCode,
    requestId,
    retryAfterSeconds,
    retryable: false,
  };
}

export function providerHostFromBaseUrl(baseUrl: string): string {
  try {
    return new URL(baseUrl).origin;
  } catch {
    return "invalid-base-url";
  }
}
