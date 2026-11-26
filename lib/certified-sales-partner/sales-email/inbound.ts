/**
 * Inbound reply correlation. Authorization comes from the signed token and the
 * stored send — never from From, Reply-To, Subject, or a client partner id.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { AIPIFY_INTERNAL_SALES_TENANT } from "./catalog";
import { normalizeEmailAddress } from "./gates";

export const SALES_EMAIL_LEAD_STATUSES = [
  "new_enquiry",
  "contacted",
  "interested",
  "meeting_booked",
  "proposal_sent",
  "converted",
  "closed",
] as const;
export type SalesEmailLeadStatus = (typeof SALES_EMAIL_LEAD_STATUSES)[number];

export type ReplyTokenPayload = {
  v: 1;
  sendId: string;
  partnerId: string;
  tenantId: string;
  productKey: string;
  recipient: string;
  exp: number;
};

export type InboundClass = "human" | "auto_reply" | "bounce" | "spam" | "out_of_office" | "loop";

export type EmailLead = {
  id: string;
  tenantId: string;
  partnerId: string;
  productKey: string;
  recipientEmail: string;
  sendId: string;
  status: SalesEmailLeadStatus;
  createdAt: string;
  updatedAt: string;
  messageIds: string[];
};

export type StoredSend = {
  id: string;
  tenantId: string;
  partnerId: string;
  productKey: string;
  recipientEmail: string;
  partnerStatus: string;
};

export type InboundDecision =
  | { outcome: "rejected_signature" }
  | { outcome: "duplicate"; leadId: string | null }
  | { outcome: "transport_event"; class: Exclude<InboundClass, "human"> }
  | { outcome: "quarantine"; reason: string }
  | { outcome: "lead_created"; lead: EmailLead }
  | { outcome: "lead_updated"; lead: EmailLead };

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 120;

function b64url(value: Buffer | string): string {
  return Buffer.from(value).toString("base64url");
}

export function signReplyToken(secret: string, payload: ReplyTokenPayload): string {
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function inspectReplyToken(
  secret: string,
  token: string,
  now = Date.now(),
): { ok: true; payload: ReplyTokenPayload } | { ok: false; error: "invalid" | "expired" } {
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { ok: false, error: "invalid" };
  const expected = createHmac("sha256", secret).update(parts[0]).digest("base64url");
  const given = Buffer.from(parts[1]);
  const expBuf = Buffer.from(expected);
  if (given.length !== expBuf.length || !timingSafeEqual(given, expBuf)) return { ok: false, error: "invalid" };
  try {
    const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8")) as ReplyTokenPayload;
    if (payload.v !== 1 || !payload.sendId || !payload.partnerId || !payload.tenantId) return { ok: false, error: "invalid" };
    if (payload.exp < now) return { ok: false, error: "expired" };
    return { ok: true, payload };
  } catch {
    return { ok: false, error: "invalid" };
  }
}

export function verifyReplyToken(secret: string, token: string, now = Date.now()): ReplyTokenPayload | null {
  const inspected = inspectReplyToken(secret, token, now);
  return inspected.ok ? inspected.payload : null;
}

export function createReplyToken(input: Omit<ReplyTokenPayload, "v" | "exp">, secret: string, now = Date.now()): string {
  return signReplyToken(secret, { ...input, v: 1, exp: now + TOKEN_TTL_MS });
}

export function verifyInboundSignature(secret: string, body: string, signatureHex: string | null): boolean {
  if (!secret || !signatureHex) return false;
  const given = signatureHex.trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(given)) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(given, "hex"));
}

/** Minimal Svix check used by Resend inbound webhooks (`whsec_` secret). */
export function verifySvixSignature(input: {
  secret: string;
  body: string;
  id: string | null;
  timestamp: string | null;
  signature: string | null;
  now?: number;
}): boolean {
  if (!input.secret || !input.id || !input.timestamp || !input.signature) return false;
  const ts = Number(input.timestamp);
  if (!Number.isFinite(ts)) return false;
  const now = input.now ?? Date.now();
  if (Math.abs(now - ts * 1000) > 5 * 60 * 1000) return false;
  const raw = input.secret.startsWith("whsec_") ? input.secret.slice("whsec_".length) : input.secret;
  let key: Buffer;
  try {
    key = Buffer.from(raw, "base64");
  } catch {
    return false;
  }
  if (key.length < 8) return false;
  const expected = createHmac("sha256", key).update(`${input.id}.${input.timestamp}.${input.body}`).digest("base64");
  return input.signature.split(" ").some((part) => {
    const value = part.startsWith("v1,") ? part.slice(3) : "";
    if (!value || value.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
  });
}

export function classifyInbound(input: {
  from: string;
  subject: string;
  headers: Record<string, string>;
  bodyText: string;
}): InboundClass {
  const headers = Object.fromEntries(Object.entries(input.headers).map(([key, value]) => [key.toLowerCase(), value.toLowerCase()]));
  const from = input.from.toLowerCase();
  const subject = input.subject.toLowerCase();
  const auto = headers["auto-submitted"] ?? "";
  if (auto && auto !== "no") return auto.includes("auto-replied") ? "auto_reply" : "auto_reply";
  if ((headers["x-auto-response-suppress"] ?? "").length > 0) return "auto_reply";
  if ((headers.precedence ?? "") === "bulk" || (headers.precedence ?? "") === "junk") return "auto_reply";
  if ((headers["x-spam-flag"] ?? "") === "yes") return "spam";
  if (from.includes("mailer-daemon") || from.includes("postmaster@") || subject.includes("delivery status notification") || subject.includes("undeliverable")) {
    return "bounce";
  }
  if (/^(auto:|automatic reply|out of office|fravær|autosvar|frånvaro|out-of-office)/i.test(input.subject.trim())) {
    return "out_of_office";
  }
  if (from.includes("partners@aipify.ai") || from.startsWith("reply+")) return "loop";
  return "human";
}

export function plainTextFromHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20_000);
}

export type InboundState = {
  sends: StoredSend[];
  leads: EmailLead[];
  seenEventIds: string[];
};

export function applyInboundReply(
  state: InboundState,
  input: {
    providerEventId: string;
    token: ReplyTokenPayload | null;
    tokenError?: "invalid" | "expired" | null;
    from: string;
    inboundClass: InboundClass;
    messageId: string;
    claimedPartnerId?: string | null;
    now?: string;
  },
): { state: InboundState; decision: InboundDecision } {
  if (state.seenEventIds.includes(input.providerEventId)) {
    const existing = state.leads.find((lead) => lead.messageIds.includes(input.messageId));
    return { state, decision: { outcome: "duplicate", leadId: existing?.id ?? null } };
  }
  const seenEventIds = [...state.seenEventIds, input.providerEventId];
  const base = { ...state, seenEventIds };
  if (input.inboundClass !== "human") {
    return { state: base, decision: { outcome: "transport_event", class: input.inboundClass } };
  }
  if (input.tokenError === "expired") return { state: base, decision: { outcome: "quarantine", reason: "expired_token" } };
  if (!input.token) return { state: base, decision: { outcome: "quarantine", reason: "invalid_token" } };
  if (input.token.tenantId !== AIPIFY_INTERNAL_SALES_TENANT) {
    return { state: base, decision: { outcome: "quarantine", reason: "tenant_mismatch" } };
  }
  const send = base.sends.find((row) => row.id === input.token?.sendId);
  if (!send) return { state: base, decision: { outcome: "quarantine", reason: "unknown_send" } };
  if (send.partnerId !== input.token.partnerId || send.tenantId !== input.token.tenantId) {
    return { state: base, decision: { outcome: "quarantine", reason: "token_send_mismatch" } };
  }
  if (input.claimedPartnerId && input.claimedPartnerId !== send.partnerId) {
    return { state: base, decision: { outcome: "quarantine", reason: "spoofed_partner" } };
  }
  if (send.partnerStatus === "suspended" || send.partnerStatus === "rejected") {
    return { state: base, decision: { outcome: "quarantine", reason: "partner_not_eligible" } };
  }
  const from = normalizeEmailAddress(input.from);
  if (from !== normalizeEmailAddress(send.recipientEmail)) {
    return { state: base, decision: { outcome: "quarantine", reason: "sender_not_original_recipient" } };
  }
  const now = input.now ?? new Date().toISOString();
  const existing = base.leads.find(
    (lead) =>
      lead.tenantId === send.tenantId &&
      lead.partnerId === send.partnerId &&
      lead.productKey === send.productKey &&
      lead.recipientEmail === normalizeEmailAddress(send.recipientEmail),
  );
  if (existing) {
    const lead: EmailLead = {
      ...existing,
      updatedAt: now,
      messageIds: existing.messageIds.includes(input.messageId) ? existing.messageIds : [...existing.messageIds, input.messageId],
    };
    return {
      state: { ...base, leads: base.leads.map((row) => (row.id === lead.id ? lead : row)) },
      decision: { outcome: "lead_updated", lead },
    };
  }
  const lead: EmailLead = {
    id: `lead_${randomBytes(8).toString("hex")}`,
    tenantId: send.tenantId,
    partnerId: send.partnerId,
    productKey: send.productKey,
    recipientEmail: normalizeEmailAddress(send.recipientEmail),
    sendId: send.id,
    status: "new_enquiry",
    createdAt: now,
    updatedAt: now,
    messageIds: [input.messageId],
  };
  return { state: { ...base, leads: [...base.leads, lead] }, decision: { outcome: "lead_created", lead } };
}

export function transitionLeadStatus(current: SalesEmailLeadStatus, next: SalesEmailLeadStatus): SalesEmailLeadStatus {
  if (!(SALES_EMAIL_LEAD_STATUSES as readonly string[]).includes(next)) return current;
  return next;
}
