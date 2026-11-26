import { NextResponse } from "next/server";
import { callCspRpc } from "@/lib/certified-sales-partner";
import { authenticateInboundRequest } from "@/lib/certified-sales-partner/email-crm/authenticate-inbound";
import { payloadFromReceivedEmail, prepareInboundEvent } from "@/lib/certified-sales-partner/email-crm/prepare-inbound";
import { fetchResendReceivedEmail } from "@/lib/certified-sales-partner/email-crm/received-email";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Canonical inbound webhook. The signature is checked before any provider read.
 * Message text, sender, and Reply-To come from the received-email API.
 * Lead rows are created only by csp_sales_email_ingest_reply after that.
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

  const root = asRecord(payload);
  const data = asRecord(root?.data) ?? root;
  const eventType = text(root?.type) || text(data?.type);
  const emailId = text(data?.email_id) || text(data?.id);
  let inboundPayload = payload;

  if (eventType === "email.received") {
    const fetched = await fetchResendReceivedEmail(emailId, process.env.RESEND_API_KEY?.trim() ?? "");
    if (!fetched.ok || !root) {
      return NextResponse.json(
        { accepted: false, reason: "received_email_unavailable", real_inbound_e2e: "REAL_INBOUND_E2E_BLOCKED" },
        { status: 503, headers: NO_STORE },
      );
    }
    inboundPayload = payloadFromReceivedEmail({
      providerEventId: emailId,
      eventType,
      email: fetched.email,
    });
  }

  const prepared = prepareInboundEvent({
    payload: inboundPayload,
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
