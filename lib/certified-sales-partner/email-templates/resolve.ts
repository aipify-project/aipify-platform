import { getCspEmailTemplateById } from "./registry";
import {
  CSP_EMAIL_PLACEHOLDERS,
  CSP_EMAIL_TEMPLATE_LOCALES,
  type CspEmailLocalizedFields,
  type CspEmailPlaceholder,
  type CspEmailPlaceholderValues,
  type CspEmailTemplateLocale,
} from "./types";

const PLACEHOLDER_RE = /\{\{\s*([a-z0-9_]+)\s*\}\}/gi;

export function isCspEmailTemplateLocale(value: string): value is CspEmailTemplateLocale {
  return (CSP_EMAIL_TEMPLATE_LOCALES as readonly string[]).includes(value);
}

/** Escape text for HTML email bodies — never allow raw HTML/JS from placeholders. */
export function escapeCspEmailHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function assertKnownPlaceholders(text: string): string[] {
  const unknown: string[] = [];
  for (const match of text.matchAll(PLACEHOLDER_RE)) {
    const key = match[1]!;
    if (!(CSP_EMAIL_PLACEHOLDERS as readonly string[]).includes(key)) {
      unknown.push(key);
    }
  }
  return [...new Set(unknown)];
}

export function replaceCspEmailPlaceholders(
  text: string,
  values: CspEmailPlaceholderValues,
  mode: "text" | "html",
): string {
  return text.replace(PLACEHOLDER_RE, (_full, key: string) => {
    if (!(CSP_EMAIL_PLACEHOLDERS as readonly string[]).includes(key)) return "";
    const raw = values[key as CspEmailPlaceholder] ?? "";
    return mode === "html" ? escapeCspEmailHtml(raw) : raw;
  });
}

export type CspEmailResolvedTemplate =
  | {
      ok: true;
      templateId: string;
      locale: CspEmailTemplateLocale;
      fields: CspEmailLocalizedFields;
      textBody: string;
      htmlBody: string;
      subject: string;
      preheader: string;
      ctaLabel: string;
    }
  | {
      ok: false;
      reason:
        | "template_not_found"
        | "template_not_published"
        | "locale_unavailable"
        | "unknown_placeholder"
        | "missing_required_values";
      detail?: string;
    };

const REQUIRED: CspEmailPlaceholder[] = [
  "seller_display_name",
  "seller_company",
  "product_name",
  "product_description",
  "referral_url",
];

/**
 * Resolve a published template for one marketing locale.
 * Never falls back to English when the requested locale is missing.
 */
export function resolveCspEmailTemplate(input: {
  templateId: string;
  locale: string;
  values: CspEmailPlaceholderValues;
}): CspEmailResolvedTemplate {
  const template = getCspEmailTemplateById(input.templateId);
  if (!template) return { ok: false, reason: "template_not_found" };
  if (!template.published) return { ok: false, reason: "template_not_published" };
  if (!isCspEmailTemplateLocale(input.locale)) {
    return { ok: false, reason: "locale_unavailable", detail: input.locale };
  }
  const fields = template.locales[input.locale];
  if (!fields) return { ok: false, reason: "locale_unavailable", detail: input.locale };

  const unknown = [
    ...assertKnownPlaceholders(fields.subject),
    ...assertKnownPlaceholders(fields.preheader),
    ...assertKnownPlaceholders(fields.body),
    ...assertKnownPlaceholders(fields.ctaLabel),
  ];
  if (unknown.length > 0) {
    return { ok: false, reason: "unknown_placeholder", detail: unknown.join(",") };
  }

  for (const key of REQUIRED) {
    if (!String(input.values[key] ?? "").trim()) {
      return { ok: false, reason: "missing_required_values", detail: key };
    }
  }

  const subject = replaceCspEmailPlaceholders(fields.subject, input.values, "text");
  const preheader = replaceCspEmailPlaceholders(fields.preheader, input.values, "text");
  const textBody = replaceCspEmailPlaceholders(fields.body, input.values, "text");
  const ctaLabel = replaceCspEmailPlaceholders(fields.ctaLabel, input.values, "text");
  const safeUrl = escapeCspEmailHtml(input.values.referral_url.trim());
  const htmlParagraphs = escapeCspEmailHtml(textBody)
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 1em;line-height:1.5;color:#1E293B;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
  const avatar = input.values.seller_avatar_url.trim();
  const avatarBlock =
    avatar.startsWith("https://") && !avatar.includes("<")
      ? `<img src="${escapeCspEmailHtml(avatar)}" width="48" height="48" alt="" style="border-radius:999px;display:block;margin:0 0 12px;" />`
      : `<div style="width:48px;height:48px;border-radius:999px;background:#F3EDFF;color:#7C3AED;font-weight:700;font-size:16px;line-height:48px;text-align:center;margin:0 0 12px;">${escapeCspEmailHtml(
          (input.values.seller_display_name.trim().slice(0, 1) || "A").toUpperCase(),
        )}</div>`;

  const htmlBody = `<!DOCTYPE html><html><body style="margin:0;padding:24px;font-family:system-ui,sans-serif;background:#F7F6F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:24px;border:1px solid #E8E4F2;">
    <tr><td>
      ${avatarBlock}
      <p style="margin:0 0 8px;font-size:12px;color:#94A3B8;">${escapeCspEmailHtml(input.values.company_branding || "Aipify")}</p>
      <p style="margin:0 0 16px;font-size:12px;color:#94A3B8;">${escapeCspEmailHtml(preheader)}</p>
      ${htmlParagraphs}
      <p style="margin:24px 0 0;"><a href="${safeUrl}" style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:600;">${escapeCspEmailHtml(ctaLabel)}</a></p>
      <p style="margin:24px 0 0;font-size:12px;color:#94A3B8;word-break:break-all;">${safeUrl}</p>
    </td></tr>
  </table>
</body></html>`;

  return {
    ok: true,
    templateId: template.id,
    locale: input.locale,
    fields,
    textBody: `${textBody}\n\n${input.values.referral_url.trim()}`,
    htmlBody,
    subject,
    preheader,
    ctaLabel,
  };
}
