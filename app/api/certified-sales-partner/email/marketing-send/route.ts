import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { getCspEmailTemplateById, resolveCspEmailTemplate } from "@/lib/certified-sales-partner/email-templates";
import { cspMarketingProductDescription } from "@/lib/certified-sales-partner/email-templates/product-copy";
import type { CspEmailPlaceholderValues, CspEmailTemplateLocale } from "@/lib/certified-sales-partner/email-templates/types";
import { isCspEmailTemplateLocale } from "@/lib/certified-sales-partner/email-templates/resolve";
import {
  evaluateCspMarketingSendGate,
  salesEmailReplyDomain,
  sendCspMarketingEmail,
} from "@/lib/certified-sales-partner/email-outbound/send-gate";
import { createReplyToken, hashReplyToken } from "@/lib/certified-sales-partner/email-crm/token";
import { readProfileSignature, buildSalesReferralUrl } from "@/lib/certified-sales-partner/email-crm/signature";
import { parseCspPortalView } from "@/lib/certified-sales-partner/portal-view";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" } as const;
const ACTIVE = ["approved", "active", "certified", "in_academy"];

function metaString(meta: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = meta[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

/**
 * Canonical marketing send. Preview stays available when the gate is closed.
 * A provider accept is not inbox delivery. A send never creates commission.
 */
export async function POST(request: Request) {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;

    const body = (await request.json().catch(() => null)) as {
      template_id?: string;
      product_key?: string;
      marketing_locale?: string;
      recipient?: string;
      consent_confirmed?: boolean;
      idempotency_key?: string;
      partner_id?: string;
    } | null;

    if (typeof body?.partner_id === "string" && body.partner_id.trim()) {
      return NextResponse.json({ found: false, error: "forbidden" }, { status: 403, headers: NO_STORE });
    }

    const templateId = typeof body?.template_id === "string" ? body.template_id : "";
    const productKey = typeof body?.product_key === "string" ? body.product_key : "";
    const locale = typeof body?.marketing_locale === "string" ? body.marketing_locale : "";
    const recipient = typeof body?.recipient === "string" ? body.recipient.trim().toLowerCase() : "";
    const idempotencyKey =
      typeof body?.idempotency_key === "string" && body.idempotency_key.trim()
        ? body.idempotency_key.trim().slice(0, 120)
        : "";

    if (!templateId || !productKey || !isCspEmailTemplateLocale(locale) || !recipient || idempotencyKey.length < 8) {
      return NextResponse.json({ found: false, error: "invalid_payload" }, { status: 400, headers: NO_STORE });
    }

    const overview = await callCspRpc(gate.access.supabase, "csp_get_partner_overview");
    if (!overview.ready) {
      const closed = failClosedJson(overview);
      return NextResponse.json(closed.body, { status: closed.status, headers: NO_STORE });
    }

    const view = parseCspPortalView(overview.data);
    const { data: userData } = await gate.access.supabase.auth.getUser();
    const meta = (userData.user?.user_metadata ?? {}) as Record<string, unknown>;
    const signature = readProfileSignature({
      displayName: view.overview.displayName,
      company: metaString(meta, "company_name", "company"),
      contactEmail: userData.user?.email ?? null,
      avatarUrl: metaString(meta, "avatar_url", "profile_image_url", "picture"),
    });
    if (!signature.ok || !view.overview.partnerId) {
      return NextResponse.json(
        { found: true, status: "draft", gate_reason: "profile_incomplete", createsSale: false, createsCommission: false },
        { status: 409, headers: NO_STORE },
      );
    }

    const activeLink = view.links.find((link) => link.active && link.code) ?? null;
    const referralUrl = buildSalesReferralUrl({
      code: activeLink?.code,
      productKey,
      locale,
    });
    const templateVersion = getCspEmailTemplateById(templateId)?.version ?? 1;
    const values: CspEmailPlaceholderValues = {
      seller_display_name: signature.displayName,
      seller_avatar_url: signature.avatarUrl,
      seller_company: signature.company,
      seller_contact: signature.contact,
      product_name: productKey,
      product_description: cspMarketingProductDescription(productKey),
      referral_url: referralUrl,
      company_branding: "Aipify",
    };
    const resolved = resolveCspEmailTemplate({
      templateId,
      locale: locale as CspEmailTemplateLocale,
      values,
    });
    const partnerActive = ACTIVE.includes(String(view.overview.partnerStatus ?? ""));
    const productCertified = view.overview.products.some(
      (product) => product.productKey === productKey && product.certificationStatus === "passed",
    );
    const sendGate = evaluateCspMarketingSendGate({
      partnerActive,
      productCertified,
      templateOk: resolved.ok && Boolean(referralUrl),
      recipient,
      consentVerified: body?.consent_confirmed === true,
    });
    if (!sendGate.allowed || !resolved.ok) {
      return NextResponse.json(
        {
          found: true,
          status: "draft",
          gate_reason: resolved.ok ? sendGate.reason : "template_unavailable",
          message: "Send blocked. Preview remains available. Nothing was sent.",
          createsSale: false,
          createsCommission: false,
        },
        { status: 409, headers: NO_STORE },
      );
    }

    const sendId = crypto.randomUUID();
    const tokenSecret = process.env.CSP_SALES_EMAIL_TOKEN_SECRET?.trim() ?? "";
    const replyDomain = salesEmailReplyDomain();
    const token = createReplyToken(
      {
        sendId,
        partnerId: view.overview.partnerId,
        tenantId: "aipify_internal",
        productKey,
        recipient,
      },
      tokenSecret,
    );
    const replyTo = `Aipify <reply+${token}@${replyDomain}>`;
    const recorded = await callCspRpc<{
      ok?: boolean;
      code?: string;
      duplicate?: boolean;
      send_id?: string;
      delivery_status?: string;
    }>(gate.access.supabase, "csp_sales_email_record_send", {
      p_input: {
        send_id: sendId,
        product_key: productKey,
        template_id: templateId,
        template_version: templateVersion,
        locale,
        recipient,
        idempotency_key: idempotencyKey,
        referral_url: referralUrl,
        token_hash: hashReplyToken(token),
        token_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toISOString(),
      },
    });
    if (!recorded.ready) {
      return NextResponse.json(
        {
          found: true,
          status: "draft",
          gate_reason: "persistence_not_ready",
          message: "Send blocked. Nothing was sent.",
          createsSale: false,
          createsCommission: false,
        },
        { status: 503, headers: NO_STORE },
      );
    }
    if (recorded.data.ok !== true) {
      return NextResponse.json(
        {
          found: true,
          status: "draft",
          gate_reason: recorded.data.code ?? "persistence_not_ready",
          message: "Send blocked. Nothing was sent.",
          createsSale: false,
          createsCommission: false,
        },
        { status: 409, headers: NO_STORE },
      );
    }
    if (recorded.data.duplicate) {
      return NextResponse.json(
        {
          found: true,
          status: recorded.data.delivery_status ?? "queued",
          gate_reason: "duplicate_idempotency",
          send_id: recorded.data.send_id ?? null,
          message: "This idempotency key was already recorded. Nothing new was sent.",
          createsSale: false,
          createsCommission: false,
        },
        { headers: NO_STORE },
      );
    }

    const sent = await sendCspMarketingEmail({
      to: recipient,
      subject: resolved.subject,
      html: resolved.htmlBody,
      text: resolved.textBody,
      idempotencyKey,
      replyTo,
      gate: sendGate,
    });
    await callCspRpc(gate.access.supabase, "csp_sales_email_mark_send_result", {
      p_input: {
        send_id: sendId,
        delivery_status: sent.status === "accepted_by_provider" ? "accepted_by_provider" : "failed",
        provider_message_id: sent.providerId ?? null,
      },
    });

    return NextResponse.json(
      {
        found: true,
        status: sent.status,
        gate_reason: sent.gateReason ?? null,
        provider_id: sent.providerId ?? null,
        send_id: sendId,
        message:
          sent.status === "accepted_by_provider"
            ? "Provider accepted the message. This is not proof of inbox delivery."
            : "Send blocked or failed. Nothing is claimed as delivered.",
        createsSale: false,
        createsCommission: false,
      },
      { status: sent.status === "accepted_by_provider" ? 200 : 502, headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ error: "marketing_send_failed" }, { status: 500, headers: NO_STORE });
  }
}
