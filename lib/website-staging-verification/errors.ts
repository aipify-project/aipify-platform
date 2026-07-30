/**
 * Maps the exception messages raised by the staging verification RPCs
 * (`errcode = 'P0001'`, message = safe error token) to an HTTP status and a
 * safe error code for API responses. Never surfaces raw Postgres error text.
 */

const STATUS_BY_CODE: Record<string, number> = {
  PLATFORM_SUPER_ADMIN_REQUIRED: 403,
  CONFIRMATION_REQUIRED: 400,
  INVALID_INTERNAL_REASON: 400,
  INVALID_IDEMPOTENCY_KEY: 400,
  INVALID_FIXTURE_KEY: 400,
  INVALID_LOCALE: 400,
  INVALID_ENVIRONMENT: 400,
  INVALID_PAGE_PATH: 400,
  INVALID_HOSTNAME: 500,
  ENVIRONMENT_NOT_AVAILABLE: 409,
  FIXTURE_ARCHIVED: 409,
  FIXTURE_NOT_AVAILABLE: 409,
  FIXTURE_NOT_FOUND: 404,
  RUN_ALREADY_ACTIVE: 409,
  RUN_NOT_FOUND: 404,
  ACTIVE_RUN_BLOCKING: 409,
  STAGING_CUSTOMER_CREATE_FAILED: 500,
  STAGING_DOMAIN_MUST_BE_INTERNAL: 500,
  HOSTNAME_COLLISION: 500,
};

export function mapWebsiteStagingRpcError(rawMessage: string): { status: number; code: string } {
  const code = (rawMessage || "").trim().toUpperCase();
  const status = STATUS_BY_CODE[code];
  if (status) {
    return { status, code: code.toLowerCase() };
  }
  return { status: 500, code: "unknown" };
}
