import {
  CSP_ONBOARDING_EMAIL_COPY,
  resolveCspOnboardingEmailLocale,
  type CspOnboardingEmailKind,
} from "./onboarding-email-copy";

export const CSP_ONBOARDING_EMAIL_FROM = "Aipify Group AS <partners@aipify.ai>";
export const CSP_PARTNER_LOGIN_URL = "https://aipify.ai/login?portal=partner";
export const CSP_APP_LOGIN_URL = "https://app.aipify.ai/login";
export const CSP_VERIFY_EMAIL_PAGE_URL = "https://aipify.ai/certified-sales-partner/verify-email";
export const CSP_PROGRAM_PAGE_URL = "https://aipify.ai/certified-sales-partner";
export const CSP_PLATFORM_PARTNERS_URL = "https://app.aipify.ai/platform/sellers/partners";
export const CSP_FORGOT_PASSWORD_URL = "https://aipify.ai/forgot-password";
/** Official logo mark for CSP lifecycle emails (top-left). */
export const CSP_ONBOARDING_EMAIL_LOGO_URL =
  "https://aipify.ai/website-kompis/design-v1/brand/aipify-logo-light.png";

const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const MAX_ERROR_LENGTH = 300;

export function isCspOnboardingEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

/**
 * `accepted` means Resend accepted the message for delivery (HTTP 2xx). It is NOT proof of inbox delivery.
 */
export type CspOnboardingEmailResult =
  | { status: "not_configured" }
  | { status: "failed"; error: string }
  | { status: "accepted"; providerId?: string };

export type CspOnboardingEmailDeliveryStatus = CspOnboardingEmailResult["status"];

export type SendCspOnboardingEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey?: string;
  /** Set only for sales email. Lifecycle mail leaves this unset. */
  replyTo?: string;
};

function sanitizeError(raw: string, apiKey: string): string {
  let out = raw.replaceAll(apiKey, "[redacted]").replace(/\bre_[A-Za-z0-9_]{8,}\b/g, "[redacted]");
  out = out.replace(/\s+/g, " ").trim();
  return out.length > MAX_ERROR_LENGTH ? `${out.slice(0, MAX_ERROR_LENGTH)}…` : out;
}

export async function sendCspOnboardingEmail(input: SendCspOnboardingEmailInput): Promise<CspOnboardingEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { status: "not_configured" };

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  if (input.idempotencyKey) headers["Idempotency-Key"] = input.idempotencyKey;

  try {
    const res = await fetch(RESEND_EMAILS_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        from: CSP_ONBOARDING_EMAIL_FROM,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { status: "failed", error: sanitizeError(body || `resend_http_${res.status}`, apiKey) };
    }

    const json = (await res.json().catch(() => null)) as { id?: unknown } | null;
    const providerId = typeof json?.id === "string" && json.id ? json.id : undefined;
    return { status: "accepted", ...(providerId ? { providerId } : {}) };
  } catch (error) {
    return { status: "failed", error: sanitizeError(error instanceof Error ? error.message : "send_failed", apiKey) };
  }
}

export type CspOnboardingEmailVars = {
  name?: string | null;
  /** Shown for `needs_information` only. */
  reason?: string | null;
  /** `false` appends the unverified add-on where relevant; `true`/`null` leaves it out. */
  emailVerified?: boolean | null;
  /** Override default CTA URL (e.g. secure one-time activation link). Never log this value. */
  ctaUrl?: string | null;
  /** Override default CTA label when a custom activation/login path is used. */
  ctaLabel?: string | null;
};

export type RenderedCspOnboardingEmail = { subject: string; html: string; text: string };

const UNVERIFIED_ADDON_KINDS: ReadonlySet<CspOnboardingEmailKind> = new Set([
  "application_received",
  "needs_information",
  "approved",
]);

const KIND_STATUS: Partial<Record<CspOnboardingEmailKind, "verified" | "approved" | "pending">> = {
  application_received: "pending",
  email_verified: "verified",
  approved: "approved",
};

function ctaUrlForKind(kind: CspOnboardingEmailKind): string {
  if (kind === "verify_email_nudge") return CSP_VERIFY_EMAIL_PAGE_URL;
  if (kind === "rejected") return CSP_PROGRAM_PAGE_URL;
  if (kind === "admin_new_application") return CSP_PLATFORM_PARTNERS_URL;
  return CSP_PARTNER_LOGIN_URL;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cleanText(value: string | null | undefined, max: number): string {
  return (value ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

export function renderCspOnboardingEmail(
  kind: CspOnboardingEmailKind,
  locale: string,
  vars: CspOnboardingEmailVars = {},
): RenderedCspOnboardingEmail {
  const copy = CSP_ONBOARDING_EMAIL_COPY[resolveCspOnboardingEmailLocale(locale)];
  const kindCopy = copy.kinds[kind];
  const name = cleanText(vars.name, 120);
  const greeting = name ? copy.greeting.replace("{name}", name) : copy.greetingAnonymous;

  const paragraphs = [...kindCopy.paragraphs];
  if (vars.emailVerified === false && UNVERIFIED_ADDON_KINDS.has(kind)) paragraphs.push(copy.unverifiedAddon);

  const reason =
    kind === "needs_information" || kind === "admin_new_application"
      ? cleanText(vars.reason, 1000)
      : "";
  const statusKey = KIND_STATUS[kind];
  const statusLine = statusKey ? `${copy.statusLabel}: ${copy.statuses[statusKey]}` : "";
  const customUrl = cleanText(vars.ctaUrl, 2000);
  const url = customUrl || ctaUrlForKind(kind);
  const ctaLabel = cleanText(vars.ctaLabel, 120) || kindCopy.cta;

  const htmlParts = [
    `<p style="margin:0 0 16px">${escapeHtml(greeting)}</p>`,
    ...paragraphs.map((p) => `<p style="margin:0 0 16px">${escapeHtml(p)}</p>`),
    ...(reason
      ? [
          `<p style="margin:0 0 16px;padding:12px 16px;background:#F7F6F3;border-left:3px solid #7C3AED"><strong>${escapeHtml(copy.reasonLabel)}</strong><br>${escapeHtml(reason)}</p>`,
        ]
      : []),
    ...(statusLine ? [`<p style="margin:0 0 16px"><strong>${escapeHtml(statusLine)}</strong></p>`] : []),
    `<p style="margin:24px 0"><a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 20px;background:#7C3AED;color:#FFFFFF;text-decoration:none;border-radius:8px;font-weight:600">${escapeHtml(ctaLabel)}</a></p>`,
    `<p style="margin:24px 0 0;font-size:12px;color:#6B7280">${escapeHtml(copy.footerNote)}<br>Aipify Group AS</p>`,
  ];

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#F7F6F3;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1F2937"><div style="max-width:560px;margin:0 auto;padding:32px;background:#FFFFFF;border-radius:12px"><div style="margin:0 0 24px;text-align:left"><img src="${CSP_ONBOARDING_EMAIL_LOGO_URL}" alt="Aipify" width="140" height="36" style="display:block;border:0;height:36px;width:auto" /></div><h1 style="margin:0 0 20px;font-size:20px">${escapeHtml(kindCopy.subject)}</h1>${htmlParts.join("")}</div></body></html>`;

  const text = [
    greeting,
    "",
    ...paragraphs.flatMap((p) => [p, ""]),
    ...(reason ? [`${copy.reasonLabel}: ${reason}`, ""] : []),
    ...(statusLine ? [statusLine, ""] : []),
    `${ctaLabel}: ${url}`,
    "",
    copy.footerNote,
    "Aipify Group AS",
  ].join("\n");

  return { subject: kindCopy.subject, html, text };
}

/** Render + send one onboarding email. Never reports `accepted` unless Resend accepted it. */
export async function deliverCspOnboardingEmail(input: {
  kind: CspOnboardingEmailKind;
  to: string;
  locale?: string | null;
  vars?: CspOnboardingEmailVars;
  idempotencyKey?: string;
}): Promise<CspOnboardingEmailResult> {
  const rendered = renderCspOnboardingEmail(input.kind, input.locale ?? "en", input.vars);
  return sendCspOnboardingEmail({
    to: input.to,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    idempotencyKey: input.idempotencyKey,
  });
}

export const CSP_EMAIL_RESEND_MIN_INTERVAL_MS = 60_000;

/**
 * In-memory limiter keyed by `${kind}:${email}`. LIMITATION: state is per server instance and resets on
 * cold start/deploy, so on serverless it only dampens bursts. Durable limits need a shared store.
 */
const resendAttempts = new Map<string, number>();

export function checkCspOnboardingEmailRateLimit(
  kind: CspOnboardingEmailKind | "resend_verification",
  email: string,
  now: number = Date.now(),
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const key = `${kind}:${email.trim().toLowerCase()}`;
  const last = resendAttempts.get(key);
  if (last !== undefined && now - last < CSP_EMAIL_RESEND_MIN_INTERVAL_MS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((CSP_EMAIL_RESEND_MIN_INTERVAL_MS - (now - last)) / 1000) };
  }
  resendAttempts.set(key, now);
  if (resendAttempts.size > 5000) {
    for (const [k, t] of resendAttempts) {
      if (now - t >= CSP_EMAIL_RESEND_MIN_INTERVAL_MS) resendAttempts.delete(k);
    }
  }
  return { allowed: true };
}

export function resetCspOnboardingEmailRateLimit(): void {
  resendAttempts.clear();
}

export type CspOnboardingEmailOutcome = CspOnboardingEmailDeliveryStatus | "rate_limited";

/**
 * Route-level helper: skips the limiter when email is not configured, throttles repeats, and never
 * throws — callers report the outcome and must not fail the underlying action because of it.
 */
export async function deliverCspOnboardingEmailThrottled(
  input: Parameters<typeof deliverCspOnboardingEmail>[0],
): Promise<{ outcome: CspOnboardingEmailOutcome; providerId?: string }> {
  if (!isCspOnboardingEmailConfigured()) return { outcome: "not_configured" };
  if (!checkCspOnboardingEmailRateLimit(input.kind, input.to).allowed) return { outcome: "rate_limited" };
  try {
    const result = await deliverCspOnboardingEmail(input);
    return result.status === "accepted"
      ? { outcome: "accepted", ...(result.providerId ? { providerId: result.providerId } : {}) }
      : { outcome: result.status };
  } catch {
    return { outcome: "failed" };
  }
}
