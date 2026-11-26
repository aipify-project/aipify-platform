import { NextResponse } from "next/server";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";
import { isSalesEmailLocale } from "@/lib/certified-sales-partner/sales-email/catalog";
import { createReplyToken } from "@/lib/certified-sales-partner/sales-email/inbound";
import { sendSalesEmail } from "@/lib/certified-sales-partner/sales-email/send";
import { loadSalesEmailActor, previewSalesEmailForActor, templateOrNull } from "@/lib/certified-sales-partner/sales-email/server-context";
import { callCspRpc } from "@/lib/certified-sales-partner/core-rpc";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function POST(request: Request) {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;
    const { data, error } = await gate.access.supabase.auth.getUser();
    if (error || !data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });

    const body = (await request.json().catch(() => null)) as {
      templateId?: unknown;
      locale?: unknown;
      recipient?: unknown;
      idempotencyKey?: unknown;
      partnerId?: unknown;
    } | null;
    const template = templateOrNull(typeof body?.templateId === "string" ? body.templateId : "");
    const locale = typeof body?.locale === "string" ? body.locale : "";
    const recipient = typeof body?.recipient === "string" ? body.recipient : "";
    const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
    if (!template || !isSalesEmailLocale(locale)) {
      return NextResponse.json({ error: "invalid_template" }, { status: 400, headers: NO_STORE });
    }

    const actor = await loadSalesEmailActor(gate.access.supabase, data.user);
    if (typeof body?.partnerId === "string" && actor.partnerId && body.partnerId !== actor.partnerId) {
      return NextResponse.json({ ok: false, code: "partner_not_eligible" }, { status: 403, headers: NO_STORE });
    }
    const preview = previewSalesEmailForActor({ actor, template, locale, recipient, idempotencyKey });
    if (!preview.send.ok || !preview.rendered.ok || !actor.partnerId) {
      return NextResponse.json(
        { ok: false, code: preview.send.ok ? "referral_link_missing" : preview.send.code, deliveryStatus: "draft" },
        { status: 409, headers: NO_STORE },
      );
    }

    const replyDomain = process.env.CSP_SALES_EMAIL_REPLY_DOMAIN?.trim();
    const tokenSecret = process.env.CSP_SALES_EMAIL_TOKEN_SECRET?.trim() ?? "";
    const sendId = crypto.randomUUID();
    const token = createReplyToken(
      {
        sendId,
        partnerId: actor.partnerId,
        tenantId: "aipify_internal",
        productKey: template.productKey,
        recipient: recipient.trim().toLowerCase(),
      },
      tokenSecret,
    );
    const replyTo = `Aipify <reply+${token}@${replyDomain}>`;
    const queued = await callCspRpc(gate.access.supabase, "csp_sales_email_record_send", {
      p_send_id: sendId,
      p_template_id: template.id,
      p_locale: locale,
      p_recipient: recipient.trim().toLowerCase(),
      p_idempotency_key: idempotencyKey,
    });
    if (!queued.ready) {
      return NextResponse.json({ ok: false, code: "persistence_not_ready", deliveryStatus: "draft" }, { status: 409, headers: NO_STORE });
    }

    const sent = await sendSalesEmail({
      apiKey: process.env.RESEND_API_KEY ?? null,
      to: recipient,
      subject: preview.rendered.subject,
      html: preview.rendered.html,
      text: preview.rendered.text,
      replyTo,
      idempotencyKey,
      partnerId: actor.partnerId,
    });
    if (sent.status !== "accepted_by_provider") {
      return NextResponse.json({ ok: false, code: sent.status, deliveryStatus: "failed", sendId }, { status: 502, headers: NO_STORE });
    }
    return NextResponse.json(
      {
        ok: true,
        deliveryStatus: "accepted_by_provider",
        sendId,
        providerId: sent.providerId ?? null,
        duplicate: sent.duplicate,
        createsSale: false,
        createsCommission: false,
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 500, headers: NO_STORE });
  }
}
