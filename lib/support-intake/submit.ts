/**
 * Unified intake submit — fail-closed until Core write RPCs are applied.
 * Never accepts tenant_id / partner_id / company_id from the client.
 */

import {
  SUPPORT_INTAKE_FEATURE_GATE,
  SUPPORT_INTAKE_RPC_CONNECTED,
  type SupportIntakePayload,
  type SupportIntakeResult,
  type SupportIntakeSource,
} from "./types";
import {
  mapIntakeCategoryToAppCategory,
  mapIntakePriorityToAppPriority,
} from "./categories";

export type IntakeActor =
  | { kind: "guest" }
  | { kind: "app_user"; userId: string; companyId: string }
  | { kind: "partner"; userId: string; partnerId: string }
  | { kind: "platform_agent"; userId: string };

export type IntakeRpcClient = {
  rpc: (
    fn: string,
    args?: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: { message?: string; code?: string } | null }>;
};

export function getSupportIntakeGateState() {
  return {
    rpcConnected: SUPPORT_INTAKE_RPC_CONNECTED,
    featureGate: SUPPORT_INTAKE_FEATURE_GATE,
    live: Boolean(SUPPORT_INTAKE_RPC_CONNECTED && SUPPORT_INTAKE_FEATURE_GATE),
    emailTransportEnabled: false as const,
    rpcNames: {
      web: "platform_support_intake_web_create",
      partner: "platform_support_intake_partner_create",
    } as const,
  };
}

function channelActivated(source: SupportIntakeSource): boolean {
  if (!SUPPORT_INTAKE_RPC_CONNECTED || !SUPPORT_INTAKE_FEATURE_GATE) return false;
  return source === "web" || source === "partner";
}

function ticketNumberFromId(id: string): string {
  return `SUP-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function parseCreateResult(
  data: unknown,
  source: SupportIntakeSource,
): SupportIntakeResult {
  const row =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;
  if (!row || row.ok === false) {
    return {
      ok: false,
      live: false,
      code: "unknown",
      message: "Supportinntak returnerte ikke et gyldig saksnummer.",
    };
  }
  const ticketId =
    typeof row.ticket_id === "string"
      ? row.ticket_id
      : typeof row.ticketId === "string"
        ? row.ticketId
        : null;
  if (!ticketId) {
    return {
      ok: false,
      live: false,
      code: "unknown",
      message: "Supportinntak returnerte ikke et gyldig saksnummer.",
    };
  }
  const ticketNumber =
    typeof row.ticket_number === "string" && row.ticket_number.trim()
      ? row.ticket_number.trim()
      : ticketNumberFromId(ticketId);
  return {
    ok: true,
    live: true,
    ticketId,
    ticketNumber,
    source,
  };
}

/**
 * Submit a support ticket through the unified Core intake path.
 * Actor identity must be server-derived (never from request body IDs).
 */
export async function submitSupportIntake(input: {
  payload: SupportIntakePayload;
  actor: IntakeActor;
  rpc?: IntakeRpcClient;
  idempotencyKey?: string | null;
}): Promise<SupportIntakeResult> {
  const { payload, actor } = input;

  if (!SUPPORT_INTAKE_RPC_CONNECTED) {
    return {
      ok: false,
      live: false,
      code: "core_not_applied",
      message:
        "Supportinntak krever Core-oppsett. Ticket-skriving er ikke aktivert ennå.",
    };
  }
  if (!SUPPORT_INTAKE_FEATURE_GATE) {
    return {
      ok: false,
      live: false,
      code: "feature_gate_off",
      message: "Supportinntak er midlertidig deaktivert.",
    };
  }
  if (!channelActivated(payload.source)) {
    return {
      ok: false,
      live: false,
      code: "channel_not_activated",
      message: "Denne kanalen er ikke aktivert for tickets.",
    };
  }

  if (payload.source === "web" && actor.kind !== "guest") {
    return {
      ok: false,
      live: false,
      code: "validation",
      message: "Nettstedskanal krever gjesteaktor.",
    };
  }
  if (payload.source === "app" && actor.kind !== "app_user") {
    return {
      ok: false,
      live: false,
      code: "unauthorized",
      message: "APP-kanal krever innlogget kunde.",
    };
  }
  if (payload.source === "partner" && actor.kind !== "partner") {
    return {
      ok: false,
      live: false,
      code: "unauthorized",
      message: "Partnerkanal krever innlogget Sales Partner.",
    };
  }
  if (payload.source === "kompis" || payload.source === "manual" || payload.source === "app") {
    return {
      ok: false,
      live: false,
      code: "channel_not_activated",
      message: "Denne kanalen bruker egen opprettelsessti.",
    };
  }

  if (!input.rpc) {
    return {
      ok: false,
      live: false,
      code: "unknown",
      message: "Supportinntak mangler sikker serverklient.",
    };
  }

  const category = mapIntakeCategoryToAppCategory(payload.category);
  const priority = mapIntakePriorityToAppPriority(payload.priority ?? "normal");
  const related =
    typeof payload.productName === "string" && payload.productName.trim()
      ? payload.productName.trim().slice(0, 80)
      : null;
  const idem = input.idempotencyKey?.trim() || null;

  if (payload.source === "web") {
    const { data, error } = await input.rpc.rpc("platform_support_intake_web_create", {
      p_email: payload.contactEmail,
      p_display_name: payload.contactName,
      p_title: payload.subject,
      p_body: payload.message,
      p_category: payload.category ?? category,
      p_priority: payload.priority ?? "normal",
      p_related_module: related,
      p_invoice_reference: null,
      p_idempotency_key: idem,
    });
    if (error) {
      return {
        ok: false,
        live: false,
        code: "unknown",
        message: error.message || "Kunne ikke opprette supportsak.",
      };
    }
    return parseCreateResult(data, "web");
  }

  if (payload.source === "partner") {
    // Partner id is enforced inside the RPC via auth.uid() — never pass client partner_id.
    void actor;
    void priority;
    const { data, error } = await input.rpc.rpc("platform_support_intake_partner_create", {
      p_title: payload.subject,
      p_body: payload.message,
      p_category: payload.category ?? category,
      p_priority: payload.priority ?? "normal",
      p_related_module: related,
      p_invoice_reference: null,
      p_idempotency_key: idem,
    });
    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("unauthorized")) {
        return { ok: false, live: false, code: "unauthorized", message: "Ikke innlogget." };
      }
      if (msg.includes("forbidden")) {
        return { ok: false, live: false, code: "forbidden", message: "Partnerkontoen har ikke tilgang." };
      }
      return {
        ok: false,
        live: false,
        code: "unknown",
        message: error.message || "Kunne ikke opprette supportsak.",
      };
    }
    return parseCreateResult(data, "partner");
  }

  return {
    ok: false,
    live: false,
    code: "channel_not_activated",
    message: "Denne kanalen er ikke aktivert for tickets.",
  };
}

export function httpStatusForIntakeDenial(
  code: import("./types").SupportIntakeDenialCode,
): number {
  switch (code) {
    case "unauthorized":
      return 401;
    case "forbidden":
      return 403;
    case "rate_limited":
      return 429;
    case "validation":
    case "spam_rejected":
      return 400;
    case "core_not_applied":
    case "feature_gate_off":
    case "channel_not_activated":
      return 503;
    default:
      return 500;
  }
}
