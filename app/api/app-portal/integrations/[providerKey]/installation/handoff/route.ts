import { NextResponse } from "next/server";
import {
  INSTALLATION_HANDOFF_TYPES,
  type InstallationHandoffType,
} from "@/lib/app-portal/integrations/installation/handoff";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

const HANDOFF_TYPES = new Set<string>(INSTALLATION_HANDOFF_TYPES);

type RouteContext = { params: Promise<{ providerKey: string }> };

function mapHandoffError(message: string): { status: number; code: string } {
  const lower = message.toLowerCase();
  if (lower.includes("permission denied") || lower.includes("access denied")) {
    return { status: 403, code: "permission_denied" };
  }
  if (lower.includes("provider not found")) {
    return { status: 404, code: "provider_not_found" };
  }
  if (lower.includes("session required")) {
    return { status: 409, code: "session_required" };
  }
  if (lower.includes("support mode mismatch")) {
    return { status: 409, code: "support_mode_mismatch" };
  }
  if (lower.includes("invalid lifecycle")) {
    return { status: 409, code: "invalid_lifecycle" };
  }
  if (lower.includes("recipient_email")) {
    return { status: 400, code: "invalid_recipient_email" };
  }
  if (lower.includes("idempotency") || lower.includes("handoff_type") || lower.includes("provider_key")) {
    return { status: 400, code: "invalid_request" };
  }
  if (lower.includes("subscription")) {
    return { status: 403, code: "subscription_required" };
  }
  return { status: 400, code: "handoff_failed" };
}

/**
 * Read current tenant handoff for the provider (resume / V3 false-waiting repair).
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { providerKey: rawKey } = await context.params;
    const providerKey = typeof rawKey === "string" ? decodeURIComponent(rawKey).trim() : "";
    if (!providerKey) {
      return NextResponse.json(
        { error: "provider_key required", error_code: "invalid_request" },
        { status: 400, headers: NO_STORE }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_app_portal_installation_handoff", {
      p_provider_key: providerKey,
    });

    if (error) {
      const mapped = mapHandoffError(error.message ?? "");
      return NextResponse.json(
        { error: error.message, error_code: mapped.code },
        { status: mapped.status, headers: NO_STORE }
      );
    }

    return NextResponse.json(data ?? { handoff: null }, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: "Failed to load handoff", error_code: "handoff_failed" },
      { status: 500, headers: NO_STORE }
    );
  }
}

/**
 * Canonical tenant-bound installation handoff.
 * Organization authority comes from authenticated APP access — never from the client body.
 */
export async function POST(request: Request, context: RouteContext) {
  try {
    const { providerKey: rawKey } = await context.params;
    const providerKey = typeof rawKey === "string" ? decodeURIComponent(rawKey).trim() : "";
    if (!providerKey) {
      return NextResponse.json(
        { error: "provider_key required", error_code: "invalid_request" },
        { status: 400, headers: NO_STORE }
      );
    }

    const body = await request.json().catch(() => ({}));
    if (body?.preview_mode === true || body?.mode === "preview") {
      return NextResponse.json(
        { error: "Preview mode is read-only", error_code: "preview_readonly" },
        { status: 403, headers: NO_STORE }
      );
    }

    // Reject client-supplied organization authority.
    if (body?.organization_id != null || body?.company_id != null) {
      return NextResponse.json(
        { error: "Client organization authority is not allowed", error_code: "client_org_forbidden" },
        { status: 400, headers: NO_STORE }
      );
    }

    const handoffType =
      typeof body?.handoff_type === "string" ? body.handoff_type.trim() : "";
    if (!HANDOFF_TYPES.has(handoffType)) {
      return NextResponse.json(
        { error: "Invalid handoff_type", error_code: "invalid_handoff_type" },
        { status: 400, headers: NO_STORE }
      );
    }

    const idempotencyKey =
      typeof body?.idempotency_key === "string" ? body.idempotency_key.trim() : "";
    if (!idempotencyKey) {
      return NextResponse.json(
        { error: "idempotency_key required", error_code: "idempotency_required" },
        { status: 400, headers: NO_STORE }
      );
    }

    const customerMessage =
      typeof body?.customer_message === "string" ? body.customer_message.trim() : null;
    const recipientEmail =
      typeof body?.recipient_email === "string" ? body.recipient_email.trim() : null;

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_app_portal_installation_handoff", {
      p_provider_key: providerKey,
      p_handoff_type: handoffType as InstallationHandoffType,
      p_idempotency_key: idempotencyKey,
      p_customer_message: customerMessage,
      p_recipient_email: recipientEmail,
      p_internal_context: {},
    });

    if (error) {
      const mapped = mapHandoffError(error.message ?? "");
      return NextResponse.json(
        { error: error.message, error_code: mapped.code },
        { status: mapped.status, headers: NO_STORE }
      );
    }

    return NextResponse.json(data ?? {}, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: "Failed to create handoff", error_code: "handoff_failed" },
      { status: 500, headers: NO_STORE }
    );
  }
}
