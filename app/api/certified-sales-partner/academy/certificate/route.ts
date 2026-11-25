import { NextResponse } from "next/server";
import {
  buildCertificateMeta,
  buildCertificatePdfText,
  callCspRpc,
  deriveCspCertificateId,
  failClosedJson,
  parsePartnerOverview,
} from "@/lib/certified-sales-partner";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";

const CERTIFIED_PRODUCT_KEY = "kompis_web";

function pdfResponse(bytes: Uint8Array, certificateId: string) {
  return new NextResponse(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="aipify-certificate-${certificateId}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

/**
 * Certificate download — `GET /api/certified-sales-partner/academy/certificate[?id=&locale=]`.
 *
 * LIVE ISSUE requires a Core certification row: the partner's name, product and pass date come from
 * `csp_get_partner_overview` (certifications[].status = 'passed'), never from the client. The
 * optional `id` must equal the server-derived certificate id. Fails closed (503) when Core is not
 * ready, 403 when the partner has not passed, and blocks when the issuer org number is missing.
 *
 * PREVIEW (`?preview=1&name=…`) exists ONLY outside production for layout testing; it is refused
 * in production and is not a certification.
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const requestedId = url.searchParams.get("id");
    const localeParam = url.searchParams.get("locale");
    const locale =
      localeParam && (LOCALES as readonly string[]).includes(localeParam) ? localeParam : DEFAULT_LOCALE;

    if (url.searchParams.get("preview") === "1") {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "preview_not_available" }, { status: 403 });
      }
      const meta = buildCertificateMeta({
        fullName: url.searchParams.get("name") ?? "Preview Partner",
        passedAt: new Date(),
        locale,
        derivationSeed: `preview|${user.id}`,
      });
      return pdfResponse(await buildCertificatePdfText(meta), meta.certificateId);
    }

    const overview = await callCspRpc(supabase, "csp_get_partner_overview");
    if (!overview.ready) {
      const closed = failClosedJson(overview);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    const parsed = parsePartnerOverview(overview.data);
    const passed = parsed.certifications.find(
      (c) => c.productKey === CERTIFIED_PRODUCT_KEY && c.status === "passed" && c.passedAt !== null,
    );
    if (!passed || !passed.passedAt || !parsed.partnerId || !parsed.displayName) {
      return NextResponse.json({ error: "certification_not_passed" }, { status: 403 });
    }

    const certificateId = deriveCspCertificateId(parsed.partnerId, CERTIFIED_PRODUCT_KEY);
    if (requestedId !== null && requestedId !== certificateId) {
      return NextResponse.json({ error: "certificate_not_found" }, { status: 404 });
    }

    // Throws (fail closed) when the issuer organization number is missing in COMPANY_CONFIG.
    const meta = buildCertificateMeta({
      fullName: parsed.displayName,
      passedAt: passed.passedAt,
      locale,
      certificateId,
    });
    return pdfResponse(await buildCertificatePdfText(meta), meta.certificateId);
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    if (message.startsWith("csp_certificate_blocked")) {
      return NextResponse.json({ error: message }, { status: 503 });
    }
    return NextResponse.json({ error: "certificate_failed" }, { status: 500 });
  }
}
