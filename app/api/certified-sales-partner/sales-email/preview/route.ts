import { NextResponse } from "next/server";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";
import { isSalesEmailLocale } from "@/lib/certified-sales-partner/sales-email/catalog";
import { loadSalesEmailActor, previewSalesEmailForActor, templateOrNull } from "@/lib/certified-sales-partner/sales-email/server-context";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function GET(request: Request) {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;
    const { data, error } = await gate.access.supabase.auth.getUser();
    if (error || !data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });

    const url = new URL(request.url);
    const template = templateOrNull(url.searchParams.get("template") ?? "");
    const locale = url.searchParams.get("locale") ?? "";
    if (!template || !isSalesEmailLocale(locale)) {
      return NextResponse.json({ error: "invalid_template" }, { status: 400, headers: NO_STORE });
    }
    const actor = await loadSalesEmailActor(gate.access.supabase, data.user);
    const preview = previewSalesEmailForActor({
      actor,
      template,
      locale,
      recipient: url.searchParams.get("recipient"),
      idempotencyKey: url.searchParams.get("idempotencyKey"),
    });
    return NextResponse.json(
      {
        from: preview.rendered.ok ? preview.rendered.from : null,
        subject: preview.rendered.ok ? preview.rendered.subject : null,
        html: preview.rendered.ok ? preview.rendered.html : null,
        text: preview.rendered.ok ? preview.rendered.text : null,
        referralUrl: preview.rendered.ok ? preview.rendered.referralUrl : null,
        avatarMode: preview.rendered.ok ? preview.rendered.avatarMode : null,
        seller: {
          displayName: actor.seller.displayName,
          company: actor.seller.company,
          contact: actor.seller.contact,
        },
        localeStatus: template.locales[locale].status,
        send: preview.send,
        realInboundE2e: "REAL_INBOUND_E2E_BLOCKED",
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ error: "preview_failed" }, { status: 500, headers: NO_STORE });
  }
}
