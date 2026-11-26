import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { resolveCspEmailTemplate } from "@/lib/certified-sales-partner/email-templates";
import {
  evaluateCspMarketingSendGate,
  sendCspMarketingEmail,
} from "@/lib/certified-sales-partner/email-outbound/send-gate";
import { parseCspPortalView } from "@/lib/certified-sales-partner/portal-view";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * CSP marketing send — fail-closed.
 * Never logs message bodies or raw recipient. Owner must unlock CSP_MARKETING_EMAIL_SEND_ENABLED.
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

    // Never trust client-supplied partner_id.
    if (typeof body?.partner_id === "string" && body.partner_id.trim()) {
      return NextResponse.json({ found: false, error: "forbidden" }, { status: 403, headers: NO_STORE });
    }

    const templateId = typeof body?.template_id === "string" ? body.template_id : "";
    const productKey = typeof body?.product_key === "string" ? body.product_key : "";
    const locale = typeof body?.marketing_locale === "string" ? body.marketing_locale : "";
    const recipient = typeof body?.recipient === "string" ? body.recipient : "";
    const idempotencyKey =
      typeof body?.idempotency_key === "string" && body.idempotency_key.trim()
        ? body.idempotency_key.trim().slice(0, 120)
        : "";

    if (!templateId || !productKey || !locale || !recipient || !idempotencyKey) {
      return NextResponse.json({ found: false, error: "invalid_payload" }, { status: 400, headers: NO_STORE });
    }

    const overview = await callCspRpc(gate.access.supabase, "csp_get_partner_overview");
    if (!overview.ready) {
      const closed = failClosedJson(overview);
      return NextResponse.json(closed.body, { status: closed.status, headers: NO_STORE });
    }

    const view = parseCspPortalView(overview.data);
    const partnerStatus = String(view.overview.partnerStatus ?? "");
    const partnerActive = ["approved", "active", "certified", "in_academy"].includes(partnerStatus);
    const productCertified = view.overview.products.some(
      (p) => p.productKey === productKey && p.certificationStatus === "passed",
    );
    const activeLink = view.links.find((l) => l.active && l.code) ?? null;
    const referralUrl = activeLink?.code
      ? `https://aipify.ai/p/${activeLink.code}/${productKey}?channel=email&lang=${locale}`
      : "";

    const resolved = resolveCspEmailTemplate({
      templateId,
      locale,
      values: {
        seller_display_name: view.overview.displayName || "Seller",
        seller_avatar_url: "",
        seller_company: "Aipify Sales Partner",
        seller_contact: "",
        product_name: productKey,
        product_description: "Approved product description.",
        referral_url: referralUrl,
        company_branding: "Aipify",
      },
    });

    const sendGate = evaluateCspMarketingSendGate({
      partnerActive,
      productCertified,
      templateOk: resolved.ok,
      recipient,
      consentVerified: body?.consent_confirmed === true,
    });

    if (!resolved.ok) {
      return NextResponse.json(
        {
          found: true,
          status: "draft",
          gate_reason: "template_unavailable",
          message: "Template or locale is unavailable. Nothing was sent.",
        },
        { status: 422, headers: NO_STORE },
      );
    }

    const result = await sendCspMarketingEmail({
      to: recipient,
      subject: resolved.subject,
      html: resolved.htmlBody,
      text: resolved.textBody,
      idempotencyKey,
      gate: sendGate,
    });

    return NextResponse.json(
      {
        found: true,
        status: result.status,
        gate_reason: result.gateReason ?? sendGate.reason,
        provider_id: result.providerId ?? null,
        message:
          result.status === "accepted_by_provider"
            ? "Provider accepted the message. This is not proof of inbox delivery."
            : "Send blocked or failed. Preview remains available. Nothing claimed as delivered.",
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ error: "marketing_send_failed" }, { status: 500, headers: NO_STORE });
  }
}
