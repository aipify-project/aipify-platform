/**
 * Platform Support write operations.
 * Live only when bound to Staging Core. Email send stays separately gated OFF.
 * External replies store drafts as blocked_unconfigured — never send.
 */

import { SUPPORT_EMAIL_SEND_CONFIGURED } from "./channel-status";
import { resolveSupportCenterStagingLiveGates } from "./staging-core-activation";
import { stripUnresolvedTemplatePlaceholders } from "@/lib/support-intake/sanitize";

/** Compile-time Production default — closed. */
export const SUPPORT_WRITE_RPC_CONNECTED = false as const;
/** Compile-time Production default — closed. */
export const SUPPORT_WRITE_FEATURE_GATE = false as const;

export type SupportWriteDenialCode =
  | "core_not_applied"
  | "feature_gate_off"
  | "email_not_configured"
  | "validation"
  | "forbidden"
  | "unknown";

export type SupportWriteResult =
  | {
      ok: true;
      live: true;
      id: string;
      deliveryStatus?: string;
      direction?: string;
      from?: string;
      to?: string;
    }
  | { ok: false; live: false; code: SupportWriteDenialCode; message: string };

type RpcClient = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rpc: (fn: string, args?: Record<string, unknown>) => any;
};

function deny(
  code: SupportWriteDenialCode,
  message: string,
): SupportWriteResult {
  return { ok: false, live: false, code, message };
}

function ensureWriteGates(): SupportWriteResult | null {
  const gates = resolveSupportCenterStagingLiveGates();
  if (!gates.writeRpcConnected) {
    return deny(
      "core_not_applied",
      "Skriveoperasjoner krever Core-oppsett (ikke aktivert).",
    );
  }
  if (!gates.writeFeatureGate) {
    return deny("feature_gate_off", "Support-skriving er deaktivert.");
  }
  return null;
}

export function getSupportWriteGateState() {
  const gates = resolveSupportCenterStagingLiveGates();
  return {
    rpcConnected: gates.writeRpcConnected,
    featureGate: gates.writeFeatureGate,
    live: Boolean(gates.writeRpcConnected && gates.writeFeatureGate),
    stagingBound: gates.stagingBound,
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

function mapRpcError(message: string): SupportWriteResult {
  const lower = message.toLowerCase();
  if (lower.includes("platform portal access denied") || lower.includes("forbidden")) {
    return deny("forbidden", "Ingen tilgang.");
  }
  if (lower.includes("invalid") || lower.includes("not found")) {
    return deny("validation", message);
  }
  return deny("unknown", "Skriveoperasjon feilet.");
}

export async function postInternalNote(input: {
  ticketId: string;
  body: string;
  agentUserId: string;
  rpc?: RpcClient;
}): Promise<SupportWriteResult> {
  const gated = ensureWriteGates();
  if (gated) return gated;
  if (!input.rpc) {
    return deny("unknown", "Intern notat-RPC er ikke tilgjengelig.");
  }
  const cleaned = btrim(input.body);
  if (cleaned.length < 1) {
    return deny("validation", "Notattekst mangler.");
  }
  const { data, error } = await input.rpc.rpc("platform_support_post_internal_note", {
    p_ticket_id: input.ticketId,
    p_body: cleaned,
  });
  if (error) return mapRpcError(error.message ?? "");
  const row = asObject(data);
  if (!row || row.ok !== true || typeof row.id !== "string") {
    return deny("unknown", "Intern notat-RPC returnerte ugyldig svar.");
  }
  return {
    ok: true,
    live: true,
    id: row.id,
    direction: typeof row.direction === "string" ? row.direction : "internal_note",
  };
}

/**
 * Stores an external reply DRAFT. Email send stays OFF — Core returns
 * delivery_status blocked_unconfigured. Never claims the message was sent.
 */
export async function postExternalReply(input: {
  ticketId: string;
  body: string;
  agentUserId: string;
  templateId?: string | null;
  templateVersion?: number | null;
  includeSignature: boolean;
  signatureText?: string | null;
  rpc?: RpcClient;
}): Promise<SupportWriteResult> {
  const gated = ensureWriteGates();
  if (gated) return gated;

  const cleaned = stripUnresolvedTemplatePlaceholders(input.body);
  if (cleaned.length < 1) {
    return deny("validation", "Svartekst mangler.");
  }

  // Signature may be appended for draft preview text only — never triggers send.
  const bodyWithOptionalSignature =
    input.includeSignature && input.signatureText
      ? `${cleaned}\n\n${input.signatureText}`
      : cleaned;

  if (!input.rpc) {
    return deny("unknown", "Svar-RPC er ikke tilgjengelig.");
  }

  // Email OFF: always draft path. SUPPORT_EMAIL_SEND_CONFIGURED stays false.
  void SUPPORT_EMAIL_SEND_CONFIGURED;
  const { data, error } = await input.rpc.rpc(
    "platform_support_post_external_reply_draft",
    {
      p_ticket_id: input.ticketId,
      p_body: bodyWithOptionalSignature,
      p_template_id: input.templateId ?? null,
      p_template_version: input.templateVersion ?? null,
      p_signature_version: null,
    },
  );
  if (error) return mapRpcError(error.message ?? "");
  const row = asObject(data);
  if (!row || row.ok !== true || typeof row.id !== "string") {
    return deny("unknown", "Svarutkast-RPC returnerte ugyldig svar.");
  }
  return {
    ok: true,
    live: true,
    id: row.id,
    direction: typeof row.direction === "string" ? row.direction : "outbound",
    deliveryStatus:
      typeof row.delivery_status === "string"
        ? row.delivery_status
        : "blocked_unconfigured",
  };
}

export async function updateSupportTicketStatus(input: {
  ticketId: string;
  fromStatus: string;
  toStatus: string;
  agentUserId: string;
  rpc?: RpcClient;
}): Promise<SupportWriteResult> {
  const gated = ensureWriteGates();
  if (gated) return gated;
  if (!canTransitionSupportStatus(input.fromStatus, input.toStatus)) {
    return deny("validation", "Ugyldig statusovergang.");
  }
  if (!input.rpc) {
    return deny("unknown", "Status-RPC er ikke tilgjengelig.");
  }
  const { data, error } = await input.rpc.rpc("platform_support_update_ticket_status", {
    p_ticket_id: input.ticketId,
    p_to_status: input.toStatus,
  });
  if (error) return mapRpcError(error.message ?? "");
  const row = asObject(data);
  if (!row || row.ok !== true) {
    return deny("unknown", "Status-RPC returnerte ugyldig svar.");
  }
  return {
    ok: true,
    live: true,
    id: input.ticketId,
    from: typeof row.from === "string" ? row.from : input.fromStatus,
    to: typeof row.to === "string" ? row.to : input.toStatus,
  };
}

export async function assignSupportTicket(input: {
  ticketId: string;
  assigneeUserId: string | null;
  agentUserId: string;
  rpc?: RpcClient;
}): Promise<SupportWriteResult> {
  const gated = ensureWriteGates();
  if (gated) return gated;
  if (!input.rpc) {
    return deny("unknown", "Tildelings-RPC er ikke tilgjengelig.");
  }
  const { data, error } = await input.rpc.rpc("platform_support_assign_ticket", {
    p_ticket_id: input.ticketId,
    p_assignee_user_id: input.assigneeUserId,
  });
  if (error) return mapRpcError(error.message ?? "");
  const row = asObject(data);
  if (!row || row.ok !== true) {
    return deny("unknown", "Tildelings-RPC returnerte ugyldig svar.");
  }
  return {
    ok: true,
    live: true,
    id: input.ticketId,
  };
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

function btrim(value: string): string {
  return value.trim();
}

function asObject(data: unknown): Record<string, unknown> | null {
  return data && typeof data === "object" && !Array.isArray(data)
    ? (data as Record<string, unknown>)
    : null;
}
