import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  hasPublicCompanionVisitorContext,
  type PublicCompanionVisitorContext,
} from "@/lib/marketing/public-companion-tenant-faq";
import { resolveWebsiteKompisPublicInstallDomainTrust } from "@/lib/marketing/website-kompis-licensed-availability-server";

/**
 * Public Website Kompis AI cost gate (server-only).
 *
 * Existing APP RPCs (`record_kompis_ai_usage_event`, `get_app_kompis_ai_provider_state`,
 * `check_ai_budget_capacity`) require authenticated operator `auth.uid()` and must not be
 * called for anonymous embed visitors. Until a dedicated public security-definer contract
 * is approved/applied, this gate fail-closes before any provider fetch.
 *
 * Proposed RPC names (not applied in #98):
 * - reserve_website_kompis_public_ai_call
 * - finalize_website_kompis_public_ai_call
 */

export const WEBSITE_KOMPIS_PUBLIC_AI_COST_RPC_RESERVE =
  "reserve_website_kompis_public_ai_call" as const;
export const WEBSITE_KOMPIS_PUBLIC_AI_COST_RPC_FINALIZE =
  "finalize_website_kompis_public_ai_call" as const;

export type WebsiteKompisPublicAiCostDenyReason =
  | "untrusted_binding"
  | "contract_unavailable"
  | "budget_exhausted"
  | "rate_limited"
  | "circuit_open"
  | "reservation_failed";

export type WebsiteKompisPublicAiCostDecision =
  | {
      allowed: true;
      tenantId: string;
      installId: string;
      domain: string;
      reservationId: string | null;
      contract: "public_rpc" | "test_harness";
    }
  | {
      allowed: false;
      reason: WebsiteKompisPublicAiCostDenyReason;
      detail?: string;
    };

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function isMissingRpcError(error: { message?: string; code?: string } | null): boolean {
  if (!error) return false;
  const message = `${error.message ?? ""} ${error.code ?? ""}`.toLowerCase();
  return (
    message.includes("could not find the function") ||
    message.includes("does not exist") ||
    message.includes("pgrst202") ||
    message.includes("42883")
  );
}

/**
 * Server-side cost reservation for public grounded provider calls.
 * Fail-closed when trust fails or the public Core contract is not deployed.
 */
export async function reserveWebsiteKompisPublicAiCostControls(input: {
  visitorContext: PublicCompanionVisitorContext;
  idempotencyKey?: string | null;
  /**
   * Only for isolated unit tests — never wire from request body/query/browser.
   * Requires NODE_ENV=test.
   */
  testHarnessAllow?: boolean;
}): Promise<WebsiteKompisPublicAiCostDecision> {
  if (input.testHarnessAllow === true && process.env.NODE_ENV === "test") {
    return {
      allowed: true,
      tenantId: "00000000-0000-4000-8000-000000000001",
      installId: "00000000-0000-4000-8000-000000000002",
      domain: "customer.example",
      reservationId: "test-reservation",
      contract: "test_harness",
    };
  }

  if (!hasPublicCompanionVisitorContext(input.visitorContext)) {
    return { allowed: false, reason: "untrusted_binding", detail: "visitor_context_missing" };
  }

  const trust = await resolveWebsiteKompisPublicInstallDomainTrust({
    installId: input.visitorContext.installId,
    domain: input.visitorContext.domain,
  });

  if (!trust.trusted || !trust.tenantId || !trust.installId || !trust.domain) {
    return { allowed: false, reason: "untrusted_binding", detail: trust.reason };
  }

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return { allowed: false, reason: "contract_unavailable", detail: "service_role_unavailable" };
  }

  const { data, error } = await admin.rpc(WEBSITE_KOMPIS_PUBLIC_AI_COST_RPC_RESERVE, {
    p_install_id: trust.installId,
    p_domain: trust.domain,
    p_tenant_id: trust.tenantId,
    p_idempotency_key: input.idempotencyKey?.trim() || null,
    p_model_profile: "kompis_result_summary_v1",
  });

  if (error) {
    if (isMissingRpcError(error)) {
      return {
        allowed: false,
        reason: "contract_unavailable",
        detail: "public_ai_cost_rpc_missing",
      };
    }
    return {
      allowed: false,
      reason: "reservation_failed",
      detail: "rpc_error",
    };
  }

  const payload = asRecord(data);
  const status = typeof payload.status === "string" ? payload.status : "";
  if (status === "allowed" || payload.allowed === true) {
    const reservationId =
      typeof payload.reservation_id === "string" ? payload.reservation_id : null;
    return {
      allowed: true,
      tenantId: trust.tenantId,
      installId: trust.installId,
      domain: trust.domain,
      reservationId,
      contract: "public_rpc",
    };
  }

  if (status === "budget_exhausted" || payload.reason === "budget_exhausted") {
    return { allowed: false, reason: "budget_exhausted" };
  }
  if (status === "rate_limited" || payload.reason === "rate_limited") {
    return { allowed: false, reason: "rate_limited" };
  }
  if (status === "circuit_open" || payload.reason === "circuit_open") {
    return { allowed: false, reason: "circuit_open" };
  }

  return {
    allowed: false,
    reason: "reservation_failed",
    detail: typeof payload.reason === "string" ? payload.reason : "denied",
  };
}

export async function finalizeWebsiteKompisPublicAiCostControls(input: {
  decision: WebsiteKompisPublicAiCostDecision;
  result:
    | "success"
    | "provider_error"
    | "timeout"
    | "fallback"
    | "skipped";
  safeErrorCode?: string | null;
  inputUnits?: number | null;
  outputUnits?: number | null;
  totalUnits?: number | null;
  latencyMs?: number | null;
}): Promise<void> {
  if (!input.decision.allowed || input.decision.contract !== "public_rpc") {
    return;
  }
  if (!input.decision.reservationId) {
    return;
  }

  let admin;
  try {
    admin = createServiceRoleClient();
  } catch {
    return;
  }

  await admin.rpc(WEBSITE_KOMPIS_PUBLIC_AI_COST_RPC_FINALIZE, {
    p_reservation_id: input.decision.reservationId,
    p_tenant_id: input.decision.tenantId,
    p_install_id: input.decision.installId,
    p_result: input.result,
    p_safe_error_code: input.safeErrorCode ?? null,
    p_input_units: input.inputUnits ?? null,
    p_output_units: input.outputUnits ?? null,
    p_total_units: input.totalUnits ?? null,
    p_latency_ms: input.latencyMs ?? null,
  });
}
