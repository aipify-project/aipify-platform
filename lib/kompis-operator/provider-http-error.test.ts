import assert from "node:assert/strict";
import {
  classifyKompisProviderHttpError,
  providerHostFromBaseUrl,
} from "./provider-http-error";

assert.equal(providerHostFromBaseUrl("https://api.openai.com/v1"), "https://api.openai.com");

{
  const quota = classifyKompisProviderHttpError({
    status: 429,
    body: {
      error: {
        type: "insufficient_quota",
        code: "insufficient_quota",
        message: "You exceeded your current quota",
      },
    },
    requestIdHeader: "req_abc123XYZ",
    retryAfterHeader: "5",
  });
  assert.equal(quota.errorCode, "provider_quota_exhausted");
  assert.equal(quota.category, "quota_or_billing");
  assert.equal(quota.retryable, false);
  assert.equal(quota.providerErrorType, "insufficient_quota");
  assert.equal(quota.providerErrorCode, "insufficient_quota");
  assert.equal(quota.requestId, "req_abc123xyz");
  assert.equal(quota.retryAfterSeconds, 5);
}

{
  const credit = classifyKompisProviderHttpError({
    status: 429,
    body: { error: { code: "credit_balance_exhausted", type: "insufficient_quota" } },
  });
  assert.equal(credit.errorCode, "provider_quota_exhausted");
  assert.equal(credit.retryable, false);
}

{
  const spend = classifyKompisProviderHttpError({
    status: 429,
    body: { error: { code: "project_spend_limit_exceeded" } },
  });
  assert.equal(spend.errorCode, "provider_quota_exhausted");
  assert.equal(spend.category, "quota_or_billing");
}

{
  const rate = classifyKompisProviderHttpError({
    status: 429,
    body: { error: { type: "rate_limit_error", code: "rate_limit_exceeded" } },
    retryAfterHeader: "2",
  });
  assert.equal(rate.errorCode, "provider_rate_limited");
  assert.equal(rate.category, "rate_limit");
  assert.equal(rate.retryable, true);
  assert.equal(rate.retryAfterSeconds, 2);
}

{
  const rateNoRetryAfter = classifyKompisProviderHttpError({
    status: 429,
    body: { error: { type: "rate_limit_error", code: "rate_limit_exceeded" } },
  });
  assert.equal(rateNoRetryAfter.errorCode, "provider_rate_limited");
  assert.equal(rateNoRetryAfter.retryable, false);
}

{
  const unknown429 = classifyKompisProviderHttpError({
    status: 429,
    body: {},
    retryAfterHeader: "1",
  });
  assert.equal(unknown429.errorCode, "provider_rate_limited");
  assert.equal(unknown429.retryable, true);
}

{
  const server = classifyKompisProviderHttpError({ status: 503, body: {} });
  assert.equal(server.errorCode, "provider_http_5xx");
  assert.equal(server.retryable, true);
}

{
  const auth = classifyKompisProviderHttpError({
    status: 401,
    body: { error: { code: "invalid_api_key", type: "invalid_request_error" } },
  });
  assert.equal(auth.errorCode, "provider_http_error");
  assert.equal(auth.category, "auth");
  assert.equal(auth.retryable, false);
}

console.log("ok provider-http-error classification");
