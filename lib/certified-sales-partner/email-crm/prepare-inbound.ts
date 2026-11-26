import { classifyInboundEvent, type InboundEventClass } from "./classify";
import type { AuthoritativeReceivedEmail } from "./received-email";
import { extractReplyToken, hashReplyToken, inspectReplyToken } from "./token";

export type PreparedInbound =
  | { ok: false; status: number; body: Record<string, unknown> }
  | {
      ok: true;
      event: {
        provider_event_id: string;
        event_class: InboundEventClass;
        send_id: string | null;
        token_hash: string | null;
        token_expires_at: string | null;
        sender_email: string;
        body_text: string;
        partner_id_claim: string | null;
        tenant_id: string | null;
        provider_message_id: string | null;
      };
    };

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function addressList(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => (typeof item === "string" ? [item] : []));
}

function normalizeEmail(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] ?? value).trim().toLowerCase();
}

/**
 * The webhook event id stays. Addresses, sender, headers, and text come from the
 * received-email API, not from the webhook body.
 */
export function payloadFromReceivedEmail(input: {
  providerEventId: string;
  eventType: string;
  email: AuthoritativeReceivedEmail;
}): Record<string, unknown> {
  return {
    type: input.eventType,
    id: input.providerEventId,
    data: {
      email_id: input.providerEventId,
      from: input.email.from,
      to: input.email.to,
      cc: input.email.cc,
      subject: input.email.subject,
      text: input.email.text,
      headers: input.email.headers,
      message_id: input.email.messageId,
    },
  };
}

/**
 * Turns a verified provider body into the RPC payload.
 * The reply token is only a secret. Partner, tenant, and send are resolved
 * from its hash. Expiry is the timestamp stored with that hash.
 */
export function prepareInboundEvent(input: {
  payload: unknown;
  tokenSecret: string;
}): PreparedInbound {
  const root = asRecord(input.payload);
  if (!root) return { ok: false, status: 400, body: { accepted: false, reason: "invalid_payload" } };
  const data = asRecord(root.data) ?? root;
  const providerEventId = text(data.email_id) || text(data.id) || text(root.id);
  if (!providerEventId) return { ok: false, status: 400, body: { accepted: false, reason: "invalid_payload" } };

  const headers = asRecord(data.headers) ?? {};
  const headerStrings: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === "string") headerStrings[key] = value;
  }
  const eventType = text(root.type) || text(data.type);
  const subject = text(data.subject);
  const eventClass = classifyInboundEvent({ eventType, headers: headerStrings, subject });
  const addresses = [...addressList(data.to), ...addressList(data.cc), text(data.reply_to), subject];
  const token = addresses.map(extractReplyToken).find((item): item is string => Boolean(item)) ?? null;
  const tokenOk = token ? inspectReplyToken(input.tokenSecret, token).ok : false;
  const sender = normalizeEmail(text(data.from) || text(data.sender));
  const bodyText = text(data.text) || text(data.body) || subject;
  const outboundId = eventClass === "human" ? null : text(data.email_id) || text(data.message_id) || null;

  return {
    ok: true,
    event: {
      provider_event_id: providerEventId,
      event_class: eventClass,
      send_id: null,
      token_hash: token && tokenOk ? hashReplyToken(token) : null,
      token_expires_at: null,
      sender_email: sender,
      body_text: bodyText.slice(0, 8000),
      partner_id_claim: null,
      tenant_id: tokenOk ? "aipify_internal" : null,
      provider_message_id: outboundId,
    },
  };
}
