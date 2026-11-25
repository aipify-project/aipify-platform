/**
 * CSP locked email templates — partners cannot edit the body; dynamic fields are escaped.
 */
export const CSP_LOCKED_TEMPLATE_FIELDS = [
  "partnerName",
  "productName",
  "trackingUrl",
  "signature",
  "certifiedBadge",
] as const;
export type CspLockedTemplateField = (typeof CSP_LOCKED_TEMPLATE_FIELDS)[number];

export type CspLockedTemplateInput = {
  htmlBody: string;
  fields: Partial<Record<CspLockedTemplateField, string>>;
};

export type CspLockedTemplateResult =
  | { ok: true; html: string }
  | { ok: false; error: string; field?: string };

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SCRIPT_RE = /<\s*\/?\s*script/i;
const PLACEHOLDER_RE = /\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g;

/** Replaces `{{field}}` placeholders in the locked body with escaped values. */
export function renderLockedTemplate(input: CspLockedTemplateInput): CspLockedTemplateResult {
  const body = input?.htmlBody;
  if (typeof body !== "string" || body.length === 0) return { ok: false, error: "template_body_required" };
  const fields = input.fields ?? {};

  for (const name of CSP_LOCKED_TEMPLATE_FIELDS) {
    const v = fields[name];
    if (v == null) continue;
    if (typeof v !== "string") return { ok: false, error: "invalid_field_value", field: name };
    if (SCRIPT_RE.test(v)) return { ok: false, error: "script_tag_rejected", field: name };
  }

  const trackingUrl = fields.trackingUrl;
  if (typeof trackingUrl === "string" && trackingUrl.trim() && !/^https?:\/\//i.test(trackingUrl.trim())) {
    return { ok: false, error: "tracking_url_must_be_http", field: "trackingUrl" };
  }

  let failure = null as CspLockedTemplateResult | null;
  const html = body.replace(PLACEHOLDER_RE, (_m, name: string) => {
    if (failure) return "";
    if (!(CSP_LOCKED_TEMPLATE_FIELDS as readonly string[]).includes(name)) {
      failure = { ok: false, error: "unknown_placeholder", field: name };
      return "";
    }
    const v = fields[name as CspLockedTemplateField];
    if (typeof v !== "string") {
      failure = { ok: false, error: "missing_field", field: name };
      return "";
    }
    return escapeHtml(v);
  });

  return failure ?? { ok: true, html };
}

/** Partners can never edit the locked template body. */
export function partnerCannotEditTemplateBody(): true {
  return true;
}
