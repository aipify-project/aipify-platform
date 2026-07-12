import "server-only";

import {
  buildWebsiteKompisCorsHeaders,
  isWebsiteKompisAllowedDevOriginHostname,
  parseWebsiteKompisRequestOriginHostname,
  websiteKompisOriginHostnamesMatch,
} from "@/lib/marketing/website-kompis-embed-origin";
import {
  embedSessionMatchesInstallContext,
  issueWebsiteKompisEmbedSession,
  verifyWebsiteKompisEmbedSession,
  WEBSITE_KOMPIS_EMBED_SESSION_HEADER,
} from "@/lib/marketing/website-kompis-embed-session";
import { normalizeWebsiteKompisEmbedInstallId } from "@/lib/marketing/website-kompis-embed";
import { assertWebsiteKompisPublicRateLimit } from "@/lib/marketing/website-kompis-public-rate-limit";
import {
  resolveWebsiteKompisLicensedAvailabilityForPublicTenant,
  resolveWebsiteKompisPublicInstallDomainTrust,
} from "@/lib/marketing/website-kompis-licensed-availability-server";
import type { WebsiteKompisPublicInstallDomainTrustResult } from "@/lib/marketing/website-kompis-licensed-availability";

export type WebsiteKompisPublicSecurityFailure = {
  ok: false;
  status: number;
  code: string;
  retryAfterSeconds?: number;
  logEvent: string;
};

export type WebsiteKompisPublicSecuritySuccess = {
  ok: true;
  trust: WebsiteKompisPublicInstallDomainTrustResult;
  logEvent: string;
};

export type WebsiteKompisPublicSecurityResult =
  | WebsiteKompisPublicSecuritySuccess
  | WebsiteKompisPublicSecurityFailure;

export type WebsiteKompisEmbedSessionIssueSuccess = {
  ok: true;
  embedSession: string;
  expiresAt: number;
  validatedOrigin: string;
  corsHeaders: HeadersInit;
  logEvent: "scoped_session_issued";
};

export type WebsiteKompisEmbedSessionIssueResult =
  | WebsiteKompisEmbedSessionIssueSuccess
  | WebsiteKompisPublicSecurityFailure;

function hashInstallReference(installId: string): string {
  return installId.trim().toLowerCase().slice(0, 8);
}

export function logWebsiteKompisPublicSecurityEvent(
  event: string,
  details: Record<string, unknown>,
): void {
  // eslint-disable-next-line no-console
  console.info("[website-kompis:security]", {
    event,
    ...details,
    at: new Date().toISOString(),
  });
}

function failure(input: WebsiteKompisPublicSecurityFailure): WebsiteKompisPublicSecurityFailure {
  logWebsiteKompisPublicSecurityEvent(input.logEvent, {
    code: input.code,
    status: input.status,
    retryAfterSeconds: input.retryAfterSeconds,
  });
  return input;
}

function mapWebsiteKompisRateLimitFailure(
  result: Extract<
    Awaited<ReturnType<typeof assertWebsiteKompisPublicRateLimit>>,
    { allowed: false }
  >,
  input: { limitedCode: string; limitedEvent: string },
): WebsiteKompisPublicSecurityFailure {
  if ("backendUnavailable" in result && result.backendUnavailable) {
    return failure({
      ok: false,
      status: 503,
      code: "rate_limit_backend_unavailable",
      logEvent: "wk_rate_limit_backend_unavailable",
    });
  }

  if (result.status !== 429) {
    return failure({
      ok: false,
      status: 503,
      code: "rate_limit_backend_unavailable",
      logEvent: "wk_rate_limit_backend_unavailable",
    });
  }

  return failure({
    ok: false,
    status: 429,
    code: input.limitedCode,
    retryAfterSeconds: result.retryAfterSeconds,
    logEvent: input.limitedEvent,
  });
}

function parseValidatedBrowserOrigin(request: Request): {
  origin: string | null;
  hostname: string | null;
} {
  const originHeader = request.headers.get("origin");
  const hostname = parseWebsiteKompisRequestOriginHostname(originHeader);
  if (!originHeader || !hostname) {
    return { origin: null, hostname: null };
  }
  return { origin: originHeader, hostname };
}

async function resolveTrustedInstallContext(input: {
  installId: string;
  domain: string;
}): Promise<WebsiteKompisPublicInstallDomainTrustResult> {
  return resolveWebsiteKompisPublicInstallDomainTrust({
    installId: input.installId,
    domain: input.domain,
  });
}

async function assertEntitlementActive(tenantId: string): Promise<boolean> {
  const availability = await resolveWebsiteKompisLicensedAvailabilityForPublicTenant(tenantId);
  return availability.available;
}

export async function issueWebsiteKompisEmbedSessionForRequest(
  request: Request,
  body: { installId?: unknown },
): Promise<WebsiteKompisEmbedSessionIssueResult> {
  const { origin, hostname: originHostname } = parseValidatedBrowserOrigin(request);
  if (!origin || !originHostname) {
    return failure({
      ok: false,
      status: 403,
      code: "origin_rejected",
      logEvent: "origin_rejected",
    });
  }

  if (
    !isWebsiteKompisAllowedDevOriginHostname(originHostname) &&
    !/^[a-z0-9.-]+$/.test(originHostname)
  ) {
    return failure({
      ok: false,
      status: 403,
      code: "origin_rejected",
      logEvent: "origin_rejected",
    });
  }

  const installId = normalizeWebsiteKompisEmbedInstallId(body.installId);
  if (!installId) {
    return failure({
      ok: false,
      status: 400,
      code: "installation_rejected",
      logEvent: "installation_rejected",
    });
  }

  const bootstrapIpLimit = await assertWebsiteKompisPublicRateLimit({
    category: "bootstrap",
    request,
    scopes: ["ip"],
  });
  if (!bootstrapIpLimit.allowed) {
    return mapWebsiteKompisRateLimitFailure(bootstrapIpLimit, {
      limitedCode: "bootstrap_rate_limited",
      limitedEvent: "bootstrap_rate_limited",
    });
  }

  const trust = await resolveTrustedInstallContext({
    installId,
    domain: originHostname,
  });

  if (
    !trust.trusted ||
    !trust.tenantId ||
    !trust.installId ||
    !trust.domain ||
    !websiteKompisOriginHostnamesMatch(originHostname, trust.domain)
  ) {
    return failure({
      ok: false,
      status: 403,
      code: "origin_rejected",
      logEvent: "origin_rejected",
    });
  }

  const entitled = await assertEntitlementActive(trust.tenantId);
  if (!entitled) {
    return failure({
      ok: false,
      status: 403,
      code: "entitlement_rejected",
      logEvent: "entitlement_rejected",
    });
  }

  const bootstrapInstallLimit = await assertWebsiteKompisPublicRateLimit({
    category: "bootstrap",
    request,
    installId: trust.installId,
    scopes: ["install"],
  });
  if (!bootstrapInstallLimit.allowed) {
    return mapWebsiteKompisRateLimitFailure(bootstrapInstallLimit, {
      limitedCode: "bootstrap_rate_limited",
      limitedEvent: "bootstrap_rate_limited",
    });
  }

  const issued = issueWebsiteKompisEmbedSession({
    installId: trust.installId,
    domain: trust.domain,
    tenantId: trust.tenantId,
  });

  if (!issued.ok) {
    return failure({
      ok: false,
      status: 503,
      code: "scoped_session_rejected",
      logEvent: "scoped_session_rejected",
    });
  }

  logWebsiteKompisPublicSecurityEvent("scoped_session_issued", {
    installRef: hashInstallReference(trust.installId),
    originHostname,
  });

  return {
    ok: true,
    embedSession: issued.token,
    expiresAt: issued.expiresAt,
    validatedOrigin: origin,
    corsHeaders: buildWebsiteKompisCorsHeaders(origin),
    logEvent: "scoped_session_issued",
  };
}

export async function assertWebsiteKompisEmbedProtectedRequest(
  request: Request,
  input: {
    installId?: string | null;
    domain?: string | null;
    category: "launcher" | "ask";
  },
): Promise<WebsiteKompisPublicSecurityResult> {
  const installId = normalizeWebsiteKompisEmbedInstallId(input.installId);
  const domain = typeof input.domain === "string" ? input.domain.trim().toLowerCase() : null;

  if (!installId || !domain) {
    return failure({
      ok: false,
      status: 403,
      code: "installation_rejected",
      logEvent: "installation_rejected",
    });
  }

  const sessionHeader = request.headers.get(WEBSITE_KOMPIS_EMBED_SESSION_HEADER);
  const verified = verifyWebsiteKompisEmbedSession(sessionHeader);
  if (!verified.ok) {
    return failure({
      ok: false,
      status: 403,
      code: "scoped_session_rejected",
      logEvent: "scoped_session_rejected",
    });
  }

  const trust = await resolveTrustedInstallContext({ installId, domain });
  if (
    !trust.trusted ||
    !trust.tenantId ||
    !trust.installId ||
    !trust.domain ||
    !embedSessionMatchesInstallContext({
      claims: verified.claims,
      installId,
      domain,
      tenantId: trust.tenantId,
    })
  ) {
    return failure({
      ok: false,
      status: 403,
      code: "scoped_session_rejected",
      logEvent: "scoped_session_rejected",
    });
  }

  const entitled = await assertEntitlementActive(trust.tenantId);
  if (!entitled) {
    return failure({
      ok: false,
      status: 403,
      code: "entitlement_rejected",
      logEvent: "entitlement_rejected",
    });
  }

  const rateLimit = await assertWebsiteKompisPublicRateLimit({
    category: input.category,
    request,
    installId: trust.installId,
    tenantId: trust.tenantId,
  });

  if (!rateLimit.allowed) {
    return mapWebsiteKompisRateLimitFailure(rateLimit, {
      limitedCode: input.category === "ask" ? "ask_rate_limited" : "launcher_rate_limited",
      limitedEvent: input.category === "ask" ? "ask_rate_limited" : "launcher_rate_limited",
    });
  }

  logWebsiteKompisPublicSecurityEvent(
    input.category === "ask" ? "ask_accepted" : "origin_validated",
    {
      installRef: hashInstallReference(trust.installId),
      originHostname: trust.domain,
    },
  );

  return {
    ok: true,
    trust,
    logEvent: input.category === "ask" ? "ask_accepted" : "origin_validated",
  };
}

export function websiteKompisPublicSecurityErrorResponse(
  result: WebsiteKompisPublicSecurityFailure,
): Response {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (result.retryAfterSeconds) {
    headers.set("Retry-After", String(result.retryAfterSeconds));
  }
  return Response.json({ error: "Request not allowed", code: result.code }, {
    status: result.status,
    headers,
  });
}
