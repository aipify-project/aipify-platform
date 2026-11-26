import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { callCspRpc } from "@/lib/certified-sales-partner/core-rpc";
import { authenticateInbound } from "@/lib/certified-sales-partner/sales-email/inbound-http";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Provider inbound webhook. Signature is required. Bodies are not logged.
 * Without a verified secret or the prepared SQL package the route stays closed
 * and does not claim that a reply became a lead.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const headers = Object.fromEntries(request.headers.entries());
  const hmacSecret = process.env.CSP_SALES_EMAIL_INBOUND_SECRET?.trim() || null;
  const svixSecret = process.env.RESEND_WEBHOOK_SECRET?.trim() || null;
  const auth = authenticateInbound({ rawBody, headers, hmacSecret, svixSecret });
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status, headers: NO_STORE });

  try {
    const admin = createServiceRoleClient();
    const ready = await callCspRpc(admin, "csp_sales_email_backend_status");
    if (!ready.ready || !(ready.data && typeof ready.data === "object" && (ready.data as { ready?: unknown }).ready === true)) {
      return NextResponse.json(
        { code: "persistence_not_ready", realInboundE2e: "REAL_INBOUND_E2E_BLOCKED" },
        { status: 503, headers: NO_STORE },
      );
    }
    const stored = await callCspRpc(admin, "csp_sales_email_ingest_reply", { p_event: JSON.parse(rawBody) });
    if (!stored.ready) {
      return NextResponse.json(
        { code: "persistence_not_ready", realInboundE2e: "REAL_INBOUND_E2E_BLOCKED" },
        { status: 503, headers: NO_STORE },
      );
    }
    const data = stored.data && typeof stored.data === "object" ? (stored.data as Record<string, unknown>) : {};
    return NextResponse.json(
      {
        outcome: data.outcome ?? "stored",
        leadId: data.lead_id ?? null,
        createsSale: false,
        createsCommission: false,
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json(
      { code: "persistence_not_ready", realInboundE2e: "REAL_INBOUND_E2E_BLOCKED" },
      { status: 503, headers: NO_STORE },
    );
  }
}
