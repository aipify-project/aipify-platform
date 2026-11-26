import { NextResponse } from "next/server";
import { callCspRpc } from "@/lib/certified-sales-partner";
import { authenticateInboundRequest } from "@/lib/certified-sales-partner/email-crm/authenticate-inbound";
import { prepareInboundEvent } from "@/lib/certified-sales-partner/email-crm/prepare-inbound";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Canonical inbound webhook. Svix or the Aipify HMAC must verify.
 * Lead rows are created only by csp_sales_email_ingest_reply after that check.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const auth = authenticateInboundRequest({ rawBody, headers: request.headers });
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status, headers: NO_STORE });

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ accepted: false, reason: "invalid_payload" }, { status: 400, headers: NO_STORE });
  }

  const prepared = prepareInboundEvent({
    payload,
    tokenSecret: process.env.CSP_SALES_EMAIL_TOKEN_SECRET?.trim() ?? "",
  });
  if (!prepared.ok) return NextResponse.json(prepared.body, { status: prepared.status, headers: NO_STORE });

  try {
    const admin = createServiceRoleClient();
    const ready = await callCspRpc<{ ready?: boolean }>(admin, "csp_sales_email_backend_status");
    if (!ready.ready) {
      return NextResponse.json(
        { code: "persistence_not_ready", real_inbound_e2e: "REAL_INBOUND_E2E_BLOCKED" },
        { status: 503, headers: NO_STORE },
      );
    }
    if (ready.data.ready !== true) {
      return NextResponse.json(
        { code: "persistence_not_ready", real_inbound_e2e: "REAL_INBOUND_E2E_BLOCKED" },
        { status: 503, headers: NO_STORE },
      );
    }
    const stored = await callCspRpc<{
      ok?: boolean;
      outcome?: string;
      lead_id?: string | null;
      reason?: string;
      creates_commission?: boolean;
    }>(admin, "csp_sales_email_ingest_reply", { p_event: prepared.event });
    if (!stored.ready) {
      return NextResponse.json(
        { code: "persistence_not_ready", real_inbound_e2e: "REAL_INBOUND_E2E_BLOCKED" },
        { status: 503, headers: NO_STORE },
      );
    }
    if (stored.data.ok !== true) {
      return NextResponse.json(
        { code: "persistence_not_ready", real_inbound_e2e: "REAL_INBOUND_E2E_BLOCKED" },
        { status: 503, headers: NO_STORE },
      );
    }
    return NextResponse.json(
      {
        accepted: true,
        outcome: stored.data.outcome ?? "stored",
        leadId: stored.data.lead_id ?? null,
        reason: stored.data.reason ?? null,
        createsSale: false,
        createsCommission: false,
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json(
      { code: "persistence_not_ready", real_inbound_e2e: "REAL_INBOUND_E2E_BLOCKED" },
      { status: 503, headers: NO_STORE },
    );
  }
}
