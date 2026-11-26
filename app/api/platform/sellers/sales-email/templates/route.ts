import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { createClient } from "@/lib/supabase/server";
import { SALES_EMAIL_TEMPLATES } from "@/lib/certified-sales-partner/sales-email/catalog";
import { validateTemplateSource } from "@/lib/certified-sales-partner/sales-email/render";
import { callCspRpc } from "@/lib/certified-sales-partner/core-rpc";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Reviewed Aipify catalog. Publish/withdraw stays closed until the SQL package is applied. */
export async function GET() {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;
    const status = await callCspRpc(supabase, "csp_sales_email_backend_status");
    return NextResponse.json(
      {
        found: true,
        persistenceReady: status.ready && Boolean(status.data && typeof status.data === "object" && (status.data as { ready?: unknown }).ready === true),
        templates: SALES_EMAIL_TEMPLATES,
        tenantId: "aipify_internal",
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ error: "templates_failed" }, { status: 500, headers: NO_STORE });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;
    const body = (await request.json().catch(() => null)) as {
      action?: unknown;
      subject?: unknown;
      body?: unknown;
      cta?: unknown;
    } | null;
    const subject = typeof body?.subject === "string" ? body.subject : "";
    const text = typeof body?.body === "string" ? body.body : "";
    const cta = typeof body?.cta === "string" ? body.cta : "";
    const valid = validateTemplateSource({ subject, body: text, cta });
    if (!valid.ok) return NextResponse.json({ ok: false, code: valid.code, detail: valid.detail ?? null }, { status: 400, headers: NO_STORE });
    const saved = await callCspRpc(supabase, "csp_sales_email_save_template_draft", {
      p_action: body?.action === "publish" ? "publish" : "draft",
    });
    if (!saved.ready) {
      return NextResponse.json({ ok: false, code: "persistence_not_ready", saved: false }, { status: 409, headers: NO_STORE });
    }
    return NextResponse.json({ ok: true, saved: true }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "template_save_failed" }, { status: 500, headers: NO_STORE });
  }
}
