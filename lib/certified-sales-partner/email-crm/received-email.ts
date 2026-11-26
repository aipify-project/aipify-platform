const RECEIVING_URL = "https://api.resend.com/emails/receiving/";
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type AuthoritativeReceivedEmail = {
  id: string;
  from: string;
  to: string[];
  cc: string[];
  subject: string;
  text: string;
  headers: Record<string, string>;
  messageId: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function addressList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function headerMap(value: unknown): Record<string, string> {
  const record = asRecord(value);
  if (!record) return {};
  const headers: Record<string, string> = {};
  for (const [key, item] of Object.entries(record)) {
    if (typeof item === "string") headers[key] = item;
  }
  return headers;
}

/** Turns provider HTML into plain text. Scripts, styles, and tags are not stored. */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d{1,7});/g, (_, digits: string) => {
      const code = Number(digits);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : " ";
    })
    .replace(/&#x([0-9a-f]{1,6});/gi, (_, hex: string) => {
      const code = Number.parseInt(hex, 16);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : " ";
    })
    .replace(/\s+/g, " ")
    .trim();
}

export function messageTextFromReceived(input: { text?: string | null; html?: string | null }): string {
  const plain = (input.text ?? "").replace(/\s+/g, " ").trim();
  const body = plain || htmlToPlainText(input.html ?? "");
  return body.slice(0, 8000);
}

/**
 * Loads one received message from Resend after the webhook signature has been checked.
 * The returned text is plain. HTML is not retained.
 */
export async function fetchResendReceivedEmail(
  id: string,
  apiKey: string,
): Promise<{ ok: true; email: AuthoritativeReceivedEmail } | { ok: false; reason: "not_configured" | "invalid_id" | "provider_rejected" }> {
  if (!apiKey.trim()) return { ok: false, reason: "not_configured" };
  if (!ID_RE.test(id)) return { ok: false, reason: "invalid_id" };
  let response: Response;
  try {
    response = await fetch(`${RECEIVING_URL}${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
    });
  } catch {
    return { ok: false, reason: "provider_rejected" };
  }
  if (!response.ok) return { ok: false, reason: "provider_rejected" };
  const body = asRecord(await response.json().catch(() => null));
  if (!body || text(body.id).toLowerCase() !== id.toLowerCase()) return { ok: false, reason: "provider_rejected" };
  return {
    ok: true,
    email: {
      id,
      from: text(body.from),
      to: addressList(body.to),
      cc: addressList(body.cc),
      subject: text(body.subject),
      text: messageTextFromReceived({ text: text(body.text), html: text(body.html) }),
      headers: headerMap(body.headers),
      messageId: text(body.message_id) || null,
    },
  };
}
