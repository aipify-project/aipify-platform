/**
 * Server-and-client-safe sales email renderer.
 * Resolves an allowlisted placeholder set, escapes every value, and refuses
 * unknown tokens or raw HTML in template sources.
 */
import type { Locale } from "@/lib/i18n/config";
import { buildCspPublicLinkPath } from "../attribution-policy";
import {
  SALES_EMAIL_COMPANY_BRANDING,
  SALES_EMAIL_FROM,
  SALES_EMAIL_PLACEHOLDERS,
  productNameFor,
  type SalesEmailProductKey,
  type SalesEmailTemplateLocale,
} from "./catalog";

const TOKEN_RE = /\{\{\s*([a-z_]+)\s*\}\}/g;
const TAG_RE = /<\/?[a-z][^>]*>/i;
const PUBLIC_ASSET_HOSTS = new Set(["aipify.ai", "www.aipify.ai", "app.aipify.ai"]);

export type SalesEmailSellerContext = {
  displayName: string;
  company: string | null;
  contact: string | null;
  /** Public https asset only. Private or unknown hosts are dropped. */
  avatarUrl: string | null;
};

export type SalesEmailRenderInput = {
  locale: Locale;
  productKey: SalesEmailProductKey;
  source: Pick<SalesEmailTemplateLocale, "subject" | "preheader" | "body" | "cta">;
  seller: SalesEmailSellerContext;
  referralCode: string;
  origin?: string;
  unsubscribeUrl?: string | null;
};

export type SalesEmailRenderResult =
  | {
      ok: true;
      from: string;
      subject: string;
      preheader: string;
      html: string;
      text: string;
      referralUrl: string;
      avatarMode: "image" | "initials";
    }
  | { ok: false; code: "unknown_placeholder" | "html_not_allowed" | "missing_placeholder" | "referral_rejected"; detail?: string };

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function findTemplateTokens(source: string): string[] {
  return [...source.matchAll(TOKEN_RE)].map((match) => match[1]);
}

/**
 * Approved bodies are literal sales copy. The HTML shell always adds seller,
 * product, referral, branding, and unsubscribe. Template sources may also use
 * the allowlisted placeholders, and nothing else.
 */
export function validateTemplateSource(parts: { subject: string; body: string; cta: string }): SalesEmailRenderResult | { ok: true } {
  if (TAG_RE.test(parts.subject) || TAG_RE.test(parts.body) || TAG_RE.test(parts.cta)) {
    return { ok: false, code: "html_not_allowed" };
  }
  if (!parts.body.trim() || !parts.subject.trim() || !parts.cta.trim()) {
    return { ok: false, code: "missing_placeholder", detail: "body" };
  }
  const tokens = findTemplateTokens(`${parts.subject}\n${parts.body}\n${parts.cta}`);
  const unknown = tokens.find((token) => !(SALES_EMAIL_PLACEHOLDERS as readonly string[]).includes(token));
  if (unknown) return { ok: false, code: "unknown_placeholder", detail: unknown };
  return { ok: true };
}

export function publicEmailAssetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return null;
    if (!PUBLIC_ASSET_HOSTS.has(url.hostname)) return null;
    if (url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function sellerInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  const letters = parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  return letters || "A";
}

export function buildSalesReferralUrl(input: {
  code: string;
  productKey: string;
  locale: string;
  origin?: string;
}): string | null {
  const path = buildCspPublicLinkPath({ code: input.code, productKey: input.productKey, channel: "email" });
  if (!path) return null;
  const origin = (input.origin ?? "https://aipify.ai").replace(/\/$/, "");
  const url = new URL(path, `${origin}/`);
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    if (url.protocol !== "https:") return null;
  }
  if (url.hostname !== "aipify.ai" && url.hostname !== "www.aipify.ai" && url.hostname !== "localhost") return null;
  url.searchParams.set("channel", "email");
  url.searchParams.set("lang", input.locale);
  return url.toString();
}

function fill(source: string, values: Record<string, string>): string {
  return source.replace(TOKEN_RE, (_full, name: string) => values[name] ?? "");
}

export function renderSalesEmail(input: SalesEmailRenderInput): SalesEmailRenderResult {
  const structural = validateTemplateSource({
    subject: input.source.subject,
    body: input.source.body,
    cta: input.source.cta,
  });
  if (!structural.ok) return structural;

  const referralUrl = buildSalesReferralUrl({
    code: input.referralCode,
    productKey: input.productKey,
    locale: input.locale,
    origin: input.origin,
  });
  if (!referralUrl) return { ok: false, code: "referral_rejected" };

  const avatar = publicEmailAssetUrl(input.seller.avatarUrl);
  const initials = sellerInitials(input.seller.displayName);
  const company = input.seller.company?.trim() || "";
  const contact = input.seller.contact?.trim() || "";
  const unsubscribeUrl = input.unsubscribeUrl?.trim() || "https://aipify.ai/email/unsubscribe";
  const values: Record<string, string> = {
    seller_display_name: input.seller.displayName.trim(),
    seller_avatar_url: avatar ?? "",
    seller_company: company,
    seller_contact: contact,
    product_name: productNameFor(input.productKey, input.locale),
    product_description: input.source.body.trim(),
    referral_url: referralUrl,
    company_branding: SALES_EMAIL_COMPANY_BRANDING,
    unsubscribe_url: unsubscribeUrl,
  };

  const subject = fill(input.source.subject, values).trim();
  const preheader = fill(input.source.preheader, values).trim();
  const body = fill(input.source.body, values).trim();
  const cta = fill(input.source.cta, values).trim();
  const text = [
    subject,
    "",
    body,
    "",
    `${cta}: ${referralUrl}`,
    "",
    input.seller.displayName.trim(),
    company,
    contact,
    SALES_EMAIL_COMPANY_BRANDING,
    unsubscribeUrl,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const avatarHtml = avatar
    ? `<img src="${escapeHtml(avatar)}" alt="" width="40" height="40" style="border-radius:20px;display:block" />`
    : `<div style="width:40px;height:40px;border-radius:20px;background:#F3EDFF;color:#5538D3;font-family:Arial,sans-serif;font-size:14px;line-height:40px;text-align:center;font-weight:700">${escapeHtml(initials)}</div>`;

  const html = `<!doctype html><html><body style="margin:0;background:#F8F7FB;color:#1E293B">
<div style="display:none;max-height:0;overflow:hidden">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #E8E4F2;border-radius:16px" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px;font-family:Arial,sans-serif;font-size:15px;line-height:1.5">
<table role="presentation"><tr><td style="padding-right:12px;vertical-align:middle">${avatarHtml}</td>
<td style="font-family:Arial,sans-serif;vertical-align:middle"><strong>${escapeHtml(input.seller.displayName.trim())}</strong><br />
<span style="color:#64748B;font-size:13px">${escapeHtml(company)}</span></td></tr></table>
<p style="margin:20px 0">${escapeHtml(body).replaceAll("\n", "<br />")}</p>
<p style="margin:20px 0"><a href="${escapeHtml(referralUrl)}" style="display:inline-block;background:#7C3AED;color:#ffffff;text-decoration:none;border-radius:10px;padding:10px 16px;font-weight:600">${escapeHtml(cta)}</a></p>
<p style="margin:0;color:#64748B;font-size:12px">${escapeHtml(contact)}</p>
<p style="margin:12px 0 0;color:#94A3B8;font-size:12px">${escapeHtml(SALES_EMAIL_COMPANY_BRANDING)} · <a href="${escapeHtml(unsubscribeUrl)}" style="color:#64748B">${escapeHtml(unsubscribeUrl)}</a></p>
</td></tr></table></td></tr></table></body></html>`;

  return {
    ok: true,
    from: SALES_EMAIL_FROM,
    subject,
    preheader,
    html,
    text,
    referralUrl,
    avatarMode: avatar ? "image" : "initials",
  };
}

/** Fixed dummy used by Platform Admin preview. Not a real seller and not a send recipient. */
export const SALES_EMAIL_DUMMY_SELLER: SalesEmailSellerContext = {
  displayName: "Alex Example",
  company: "Example Company",
  contact: "alex@example.com",
  avatarUrl: null,
};

export const SALES_EMAIL_DUMMY_CODE = "csp-0123456789ab";
