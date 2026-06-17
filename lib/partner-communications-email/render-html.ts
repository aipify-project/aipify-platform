export type PartnerEmailRenderInput = {
  subject: string;
  title: string;
  greeting: string;
  body: string;
  details?: string;
  ctaLabel: string;
  ctaUrl: string;
  senderName?: string;
  preferencesUrl?: string;
  logoUrl?: string;
};

const DEFAULT_LOGO = "https://aipify.ai/brand/aipify-symbol.png";

export function renderPartnerEmailHtml(input: PartnerEmailRenderInput): string {
  const logo = input.logoUrl ?? DEFAULT_LOGO;
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL ?? "https://aipify.ai";
  const ctaHref = input.ctaUrl.startsWith("http") ? input.ctaUrl : `${appOrigin}${input.ctaUrl}`;
  const prefsHref = input.preferencesUrl ?? `${appOrigin}/partner/communications`;
  const sender = input.senderName ?? "Aipify Group AS";

  const detailsBlock = input.details?.trim()
    ? `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
        <tr><td style="padding:20px 24px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#334155;white-space:pre-wrap;">${escapeHtml(input.details)}</td></tr>
      </table>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(input.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#eef2ff;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:#0f172a;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#eef2ff;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img src="${logo}" alt="Aipify" width="48" height="48" style="display:block;border:0;" />
              <p style="margin:12px 0 0;font-size:13px;font-weight:600;letter-spacing:0.04em;color:#4338ca;text-transform:uppercase;">${escapeHtml(sender)}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 10px 30px rgba(15,23,42,0.06);padding:40px 36px;">
              <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;font-weight:700;color:#0f172a;">${escapeHtml(input.title)}</h1>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#334155;">${escapeHtml(input.greeting)}</p>
              <div style="font-size:16px;line-height:1.7;color:#334155;">${formatBody(input.body)}</div>
              ${detailsBlock}
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px 0 8px;">
                <tr>
                  <td style="border-radius:10px;background:linear-gradient(135deg,#4338ca,#6366f1);">
                    <a href="${ctaHref}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${escapeHtml(input.ctaLabel)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:28px 12px 8px;font-size:13px;line-height:1.6;color:#64748b;">
              <p style="margin:0 0 4px;font-weight:600;color:#475569;">Aipify Group AS</p>
              <p style="margin:0 0 12px;">Bergen. Norway. For the world.</p>
              <p style="margin:0;"><a href="${prefsHref}" style="color:#4338ca;text-decoration:none;">Partner communication preferences</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function wrapQueuedPartnerEmailHtml(
  innerHtml: string,
  context: Record<string, unknown>,
  subject: string,
): string {
  if (innerHtml.includes("data-aipify-partner-email")) {
    const senderName = String((context.sender_name as string) ?? "Aipify Group AS");
    const ctaLabel = String((context.cta_label as string) ?? "Open Partner Portal");
    const ctaUrl = String((context.cta_url as string) ?? "/partner/dashboard");

    const titleMatch = innerHtml.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const title = decodeHtml(titleMatch?.[1] ?? subject);
    const greetingMatch = innerHtml.match(/<p>(.*?)<\/p>/i);
    const greeting = decodeHtml(greetingMatch?.[1] ?? "");
    const bodyMatch = innerHtml.match(/<p>(.*?)<\/p>\s*<p>([\s\S]*?)<\/p>/i);
    const body = decodeHtml(bodyMatch?.[2]?.replace(/<br\s*\/?>/gi, "\n") ?? "");
    const detailsMatch = innerHtml.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
    const details = decodeHtml(detailsMatch?.[1] ?? "");

    return renderPartnerEmailHtml({
      subject,
      title,
      greeting,
      body,
      details,
      ctaLabel,
      ctaUrl,
      senderName,
    });
  }

  return innerHtml;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decodeHtml(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function formatBody(body: string): string {
  return escapeHtml(body).replace(/\n/g, "<br/>");
}

export function renderPartnerEmailPlainText(input: PartnerEmailRenderInput): string {
  const lines = [
    input.title,
    "",
    input.greeting,
    "",
    input.body,
    input.details ? `\n${input.details}` : "",
    "",
    `${input.ctaLabel}: ${input.ctaUrl}`,
    "",
    "Aipify Group AS",
    "Bergen. Norway. For the world.",
  ];
  return lines.filter((line, index, arr) => !(line === "" && arr[index - 1] === "")).join("\n");
}
