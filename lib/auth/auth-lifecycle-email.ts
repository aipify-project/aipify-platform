/**
 * Localized Auth lifecycle delivery via Resend (password reset + partner activation).
 * Uses official brand mark — never a generic letter "A".
 */

import {
  getAuthLifecycleEmailCopy,
  resolveAuthLifecycleEmailLocale,
  type AuthLifecycleEmailKind,
} from "@/lib/auth/auth-lifecycle-email-copy";

export const AUTH_LIFECYCLE_EMAIL_FROM = "Aipify Support <partners@aipify.ai>";
/** Official mark hosted on the marketing apex (not a letter glyph). */
export const AUTH_LIFECYCLE_LOGO_URL =
  "https://aipify.ai/website-kompis/design-v1/brand/aipify-logo-light.png";

const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const MAX_ERROR_LENGTH = 300;

export type AuthLifecycleEmailResult =
  | { status: "not_configured" }
  | { status: "failed"; error: string }
  | { status: "accepted"; providerId?: string };

export function isAuthLifecycleEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function sanitizeError(raw: string, apiKey: string): string {
  let out = raw.replaceAll(apiKey, "[redacted]").replace(/\bre_[A-Za-z0-9_]{8,}\b/g, "[redacted]");
  out = out.replace(/\s+/g, " ").trim();
  return out.length > MAX_ERROR_LENGTH ? `${out.slice(0, MAX_ERROR_LENGTH)}…` : out;
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

export type RenderedAuthLifecycleEmail = {
  subject: string;
  html: string;
  text: string;
  locale: string;
};

export function renderAuthLifecycleEmail(input: {
  kind: AuthLifecycleEmailKind;
  locale?: string | null;
  name?: string | null;
  /** Absolute one-time URL — never logged by callers. */
  actionUrl: string;
}): RenderedAuthLifecycleEmail {
  const locale = resolveAuthLifecycleEmailLocale(input.locale);
  const copy = getAuthLifecycleEmailCopy(input.kind, locale);
  const name = cleanText(input.name, 120);
  const greeting = name ? copy.greeting.replace("{name}", name) : copy.greetingAnonymous;
  const actionUrl = input.actionUrl.trim();

  const html = `<!doctype html>
<html lang="${locale}">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(copy.subject)}</title>
<span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden">${escapeHtml(copy.preheader)}</span>
</head>
<body style="margin:0;padding:24px;background:#F7F6F3;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1F2937">
  <div style="max-width:560px;margin:0 auto;padding:32px;background:#FFFFFF;border-radius:12px">
    <div style="margin:0 0 24px;text-align:left">
      <img src="${AUTH_LIFECYCLE_LOGO_URL}" alt="Aipify" width="140" height="36" style="display:block;border:0;height:36px;width:auto" />
    </div>
    <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#7C3AED">${escapeHtml(copy.supportName)}</p>
    <h1 style="margin:0 0 20px;font-size:20px;line-height:1.3">${escapeHtml(copy.subject)}</h1>
    <p style="margin:0 0 16px">${escapeHtml(greeting)}</p>
    ${copy.paragraphs.map((p) => `<p style="margin:0 0 16px">${escapeHtml(p)}</p>`).join("")}
    <p style="margin:24px 0">
      <a href="${escapeHtml(actionUrl)}" style="display:inline-block;padding:12px 20px;background:#7C3AED;color:#FFFFFF;text-decoration:none;border-radius:8px;font-weight:600">${escapeHtml(copy.cta)}</a>
    </p>
    <p style="margin:24px 0 0;font-size:12px;color:#6B7280">${escapeHtml(copy.footer)}<br>Aipify Group AS</p>
  </div>
</body>
</html>`;

  const text = [
    copy.supportName,
    copy.subject,
    "",
    greeting,
    "",
    ...copy.paragraphs.flatMap((p) => [p, ""]),
    `${copy.cta}: ${actionUrl}`,
    "",
    copy.footer,
    "Aipify Group AS",
  ].join("\n");

  return { subject: copy.subject, html, text, locale };
}

export async function sendAuthLifecycleEmail(input: {
  to: string;
  kind: AuthLifecycleEmailKind;
  locale?: string | null;
  name?: string | null;
  actionUrl: string;
  idempotencyKey?: string;
}): Promise<AuthLifecycleEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { status: "not_configured" };

  const rendered = renderAuthLifecycleEmail({
    kind: input.kind,
    locale: input.locale,
    name: input.name,
    actionUrl: input.actionUrl,
  });

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
        from: AUTH_LIFECYCLE_EMAIL_FROM,
        to: [input.to],
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
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
    return {
      status: "failed",
      error: sanitizeError(error instanceof Error ? error.message : "send_failed", apiKey),
    };
  }
}
