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

export type IntakeActor =
  | { kind: "guest" }
  | { kind: "app_user"; userId: string; companyId: string }
  | { kind: "partner"; userId: string; partnerId: string }
  | { kind: "platform_agent"; userId: string };

export function getSupportIntakeGateState() {
  return {
    rpcConnected: SUPPORT_INTAKE_RPC_CONNECTED,
    featureGate: SUPPORT_INTAKE_FEATURE_GATE,
    live: Boolean(SUPPORT_INTAKE_RPC_CONNECTED && SUPPORT_INTAKE_FEATURE_GATE),
    emailTransportEnabled: false as const,
  };
}

function channelActivated(source: SupportIntakeSource): boolean {
  // APP create already exists via create_app_portal_support_request — but Platform
  // unified intake write RPC is still gated. Keep honest: only mark activated after
  // SUPPORT_INTAKE_RPC_CONNECTED flips.
  if (!SUPPORT_INTAKE_RPC_CONNECTED || !SUPPORT_INTAKE_FEATURE_GATE) return false;
  return source === "app" || source === "web" || source === "partner" || source === "manual";
}

/**
 * Submit a support ticket through the unified Core intake path.
 * Until Core apply: always returns core_not_applied / channel_not_activated.
 * Actor identity must be server-derived (never from request body IDs).
 */
export async function submitSupportIntake(input: {
  payload: SupportIntakePayload;
  actor: IntakeActor;
  /** Optional RPC client when live — unused while gated. */
  rpc?: { rpc: (fn: string, args?: Record<string, unknown>) => PromiseLike<{ data: unknown; error: { message?: string } | null }> };
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
  if (payload.source === "kompis") {
    return {
      ok: false,
      live: false,
      code: "channel_not_activated",
      message: "Kompis-handoff er ikke aktivert i denne versjonen.",
    };
  }

  // Live path reserved for post-apply activation job.
  void input.rpc;
  return {
    ok: false,
    live: false,
    code: "unknown",
    message: "Supportinntak er ikke tilgjengelig.",
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
