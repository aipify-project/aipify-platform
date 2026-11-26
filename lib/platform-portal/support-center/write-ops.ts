/**
 * Platform Support write operations — fail-closed until Core Staging batch apply.
 * Internal notes never go to customers. Signature only on manual external replies.
 */

import { SUPPORT_EMAIL_SEND_CONFIGURED } from "./channel-status";
import { stripUnresolvedTemplatePlaceholders } from "@/lib/support-intake/sanitize";

export const SUPPORT_WRITE_RPC_CONNECTED = false as const;
export const SUPPORT_WRITE_FEATURE_GATE = false as const;

export type SupportWriteDenialCode =
  | "core_not_applied"
  | "feature_gate_off"
  | "email_not_configured"
  | "validation"
  | "forbidden"
  | "unknown";

export type SupportWriteResult =
  | { ok: true; live: true; id: string }
  | { ok: false; live: false; code: SupportWriteDenialCode; message: string };

function deny(
  code: SupportWriteDenialCode,
  message: string,
): SupportWriteResult {
  return { ok: false, live: false, code, message };
}

function ensureWriteGates(): SupportWriteResult | null {
  if (!SUPPORT_WRITE_RPC_CONNECTED) {
    return deny(
      "core_not_applied",
      "Skriveoperasjoner krever Core-oppsett (ikke aktivert).",
    );
  }
  if (!SUPPORT_WRITE_FEATURE_GATE) {
    return deny("feature_gate_off", "Support-skriving er deaktivert.");
  }
  return null;
}

export function getSupportWriteGateState() {
  return {
    rpcConnected: SUPPORT_WRITE_RPC_CONNECTED,
    featureGate: SUPPORT_WRITE_FEATURE_GATE,
    live: Boolean(SUPPORT_WRITE_RPC_CONNECTED && SUPPORT_WRITE_FEATURE_GATE),
    emailSendConfigured: SUPPORT_EMAIL_SEND_CONFIGURED,
  };
}

/** Allowed status transitions for Platform agents. */
export const SUPPORT_STATUS_TRANSITIONS: Record<string, readonly string[]> = {
  new: ["open", "in_progress", "closed"],
  open: ["in_progress", "waiting_for_customer", "waiting_internal", "resolved", "closed"],
  in_progress: ["waiting_for_customer", "waiting_internal", "resolved", "closed"],
  waiting_for_customer: ["in_progress", "resolved", "closed"],
  waiting_internal: ["in_progress", "resolved", "closed"],
  resolved: ["closed", "reopened"],
  closed: ["reopened"],
  reopened: ["in_progress", "waiting_for_customer", "resolved", "closed"],
  archived: [],
};

export function canTransitionSupportStatus(
  from: string,
  to: string,
): boolean {
  const allowed = SUPPORT_STATUS_TRANSITIONS[from] ?? [];
  return allowed.includes(to);
}

export async function postInternalNote(_input: {
  ticketId: string;
  body: string;
  agentUserId: string;
}): Promise<SupportWriteResult> {
  const gated = ensureWriteGates();
  if (gated) return gated;
  return deny("unknown", "Intern notat-RPC er ikke tilgjengelig.");
}

export async function postExternalReply(input: {
  ticketId: string;
  body: string;
  agentUserId: string;
  templateId?: string | null;
  templateVersion?: number | null;
  includeSignature: boolean;
  /** Signature HTML/text already rendered server-side — never from raw client HTML. */
  signatureText?: string | null;
}): Promise<SupportWriteResult> {
  const gated = ensureWriteGates();
  if (gated) return gated;
  if (!SUPPORT_EMAIL_SEND_CONFIGURED) {
    return deny(
      "email_not_configured",
      "E-postsending er ikke konfigurert. Svaret ble ikke sendt.",
    );
  }
  const cleaned = stripUnresolvedTemplatePlaceholders(input.body);
  if (cleaned.length < 1) {
    return deny("validation", "Svartekst mangler.");
  }
  // Signature is appended only for external replies when requested.
  void input.includeSignature;
  void input.signatureText;
  return deny("unknown", "Svar-RPC er ikke tilgjengelig.");
}

export async function updateSupportTicketStatus(input: {
  ticketId: string;
  fromStatus: string;
  toStatus: string;
  agentUserId: string;
}): Promise<SupportWriteResult> {
  const gated = ensureWriteGates();
  if (gated) return gated;
  if (!canTransitionSupportStatus(input.fromStatus, input.toStatus)) {
    return deny("validation", "Ugyldig statusovergang.");
  }
  return deny("unknown", "Status-RPC er ikke tilgjengelig.");
}

export async function assignSupportTicket(_input: {
  ticketId: string;
  assigneeUserId: string | null;
  agentUserId: string;
}): Promise<SupportWriteResult> {
  const gated = ensureWriteGates();
  if (gated) return gated;
  return deny("unknown", "Tildelings-RPC er ikke tilgjengelig.");
}

export function httpStatusForWriteDenial(code: SupportWriteDenialCode): number {
  switch (code) {
    case "forbidden":
      return 403;
    case "validation":
      return 400;
    case "email_not_configured":
    case "core_not_applied":
    case "feature_gate_off":
      return 503;
    default:
      return 500;
  }
}
