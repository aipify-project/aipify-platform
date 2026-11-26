/**
 * Inbound HTTP contract. Invalid signatures are rejected. Valid events are not
 * acknowledged as stored unless the caller has a persistence adapter.
 * Message bodies are not copied into the response.
 */
import { AIPIFY_INTERNAL_SALES_TENANT } from "./catalog";
import {
  applyInboundReply,
  classifyInbound,
  plainTextFromHtml,
  inspectReplyToken,
  verifyInboundSignature,
  verifySvixSignature,
  type InboundState,
  type ReplyTokenPayload,
} from "./inbound";

export type InboundHttpResult = {
  status: number;
  body: Record<string, unknown>;
  state: InboundState;
};

function header(headers: Record<string, string>, name: string): string | null {
  const found = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
  return found?.[1] ?? null;
}

export function extractReplyToken(to: string | null): string | null {
  if (!to) return null;
  const match = to.match(/reply\+([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)@/i);
  return match?.[1] ?? null;
}

export function authenticateInbound(input: {
  rawBody: string;
  headers: Record<string, string>;
  hmacSecret: string | null;
  svixSecret: string | null;
  now?: number;
}): { ok: true } | { ok: false; status: number; body: Record<string, unknown> } {
  if (!input.hmacSecret && !input.svixSecret) {
    return {
      ok: false,
      status: 503,
      body: { code: "inbound_not_configured", realInboundE2e: "REAL_INBOUND_E2E_BLOCKED" },
    };
  }
  const hmac = header(input.headers, "x-aipify-sales-email-signature");
  const svixOk = verifySvixSignature({
    secret: input.svixSecret ?? "",
    body: input.rawBody,
    id: header(input.headers, "svix-id"),
    timestamp: header(input.headers, "svix-timestamp"),
    signature: header(input.headers, "svix-signature"),
    now: input.now,
  });
  const hmacOk = input.hmacSecret ? verifyInboundSignature(input.hmacSecret, input.rawBody, hmac) : false;
  if (!svixOk && !hmacOk) return { ok: false, status: 401, body: { code: "invalid_signature" } };
  return { ok: true };
}

export function decideInboundHttp(input: {
  rawBody: string;
  headers: Record<string, string>;
  hmacSecret: string | null;
  svixSecret: string | null;
  tokenSecret: string | null;
  state: InboundState;
  now?: number;
}): InboundHttpResult {
  const auth = authenticateInbound(input);
  if (!auth.ok) return { status: auth.status, body: auth.body, state: input.state };
  if (input.rawBody.length > 100_000) {
    return { status: 202, body: { outcome: "quarantine", reason: "too_large" }, state: input.state };
  }
  let parsed: Record<string, unknown>;
  try {
    const value = JSON.parse(input.rawBody) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { status: 400, body: { code: "invalid_event" }, state: input.state };
    }
    parsed = value as Record<string, unknown>;
  } catch {
    return { status: 400, body: { code: "invalid_event" }, state: input.state };
  }
  const providerEventId = typeof parsed.id === "string" ? parsed.id : header(input.headers, "svix-id");
  if (!providerEventId) return { status: 400, body: { code: "missing_event_id" }, state: input.state };
  const from = typeof parsed.from === "string" ? parsed.from : "";
  const subject = typeof parsed.subject === "string" ? parsed.subject : "";
  const to = typeof parsed.to === "string" ? parsed.to : "";
  const text = typeof parsed.text === "string" ? parsed.text : plainTextFromHtml(typeof parsed.html === "string" ? parsed.html : "");
  const rawHeaders = parsed.headers && typeof parsed.headers === "object" && !Array.isArray(parsed.headers)
    ? Object.fromEntries(Object.entries(parsed.headers as Record<string, unknown>).map(([key, value]) => [key, String(value ?? "")]))
    : {};
  const inboundClass = classifyInbound({ from, subject, headers: rawHeaders, bodyText: text });
  const tokenRaw = extractReplyToken(to);
  let token: ReplyTokenPayload | null = null;
  let tokenError: "invalid" | "expired" | null = "invalid";
  if (input.tokenSecret && tokenRaw) {
    const inspected = inspectReplyToken(input.tokenSecret, tokenRaw, input.now);
    if (inspected.ok) {
      token = inspected.payload;
      tokenError = null;
    } else {
      tokenError = inspected.error;
    }
  }
  const applied = applyInboundReply(input.state, {
    providerEventId,
    token,
    tokenError,
    from,
    inboundClass,
    messageId: typeof parsed.message_id === "string" ? parsed.message_id : providerEventId,
    claimedPartnerId: typeof parsed.partner_id === "string" ? parsed.partner_id : null,
  });
  const decision = applied.decision;
  if (decision.outcome === "lead_created" || decision.outcome === "lead_updated") {
    return {
      status: 200,
      body: {
        outcome: decision.outcome,
        leadId: decision.lead.id,
        partnerId: decision.lead.partnerId,
        tenantId: AIPIFY_INTERNAL_SALES_TENANT,
        createsSale: false,
        createsCommission: false,
      },
      state: applied.state,
    };
  }
  if (decision.outcome === "duplicate") {
    return { status: 200, body: { outcome: "duplicate", leadId: decision.leadId }, state: applied.state };
  }
  if (decision.outcome === "transport_event") {
    return { status: 200, body: { outcome: "transport_event", class: decision.class }, state: applied.state };
  }
  return {
    status: 202,
    body: { outcome: "quarantine", reason: decision.outcome === "quarantine" ? decision.reason : "invalid_token" },
    state: applied.state,
  };
}
