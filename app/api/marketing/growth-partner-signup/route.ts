import { NextResponse } from "next/server";
import {
  CSP_SELLER_EXISTS_CODE,
  detectOwnCspPartnerPresence,
  guardGrowthPartnerSignupAgainstCsp,
  isCspSellerExistsPayload,
  PARTNERS_PORTAL_REDIRECT,
} from "@/lib/growth-partner-bridge";
import { assertPublicFormSubmission, logSuspiciousSubmission } from "@/lib/public-forms/bot-protection";
import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(value: unknown, max = 500): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;

    const guard = assertPublicFormSubmission(request, body, "growth-partner-signup");
    if (!guard.ok) {
      if (guard.log) {
        logSuspiciousSubmission(
          "growth-partner-signup",
          guard.log,
          request.headers.get("x-forwarded-for") ?? "unknown",
        );
      }
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }

    // Dual-registration guard (app-layer): CSP identity is authoritative.
    const cspPresence = await detectOwnCspPartnerPresence(supabase);
    if (cspPresence.known) {
      const blocked = guardGrowthPartnerSignupAgainstCsp({ cspPartnerId: cspPresence.partnerId });
      if (blocked.blocked) {
        return NextResponse.json(
          {
            ok: false,
            error: blocked.code,
            code: blocked.code,
            redirect_path: blocked.redirectPath,
            csp_partner_id: cspPresence.partnerId,
          },
          { status: 409 },
        );
      }
    }

    const email = sanitize(body.email, 254)?.toLowerCase();
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const payload = {
      full_name: sanitize(body.full_name, 120),
      company_name: sanitize(body.company_name, 200),
      business_registration_number: sanitize(body.business_registration_number, 80) ?? "",
      country: sanitize(body.country, 8),
      address: sanitize(body.address, 500),
      phone_country_code: sanitize(body.phone_country_code, 8) ?? "+47",
      phone_number: sanitize(body.phone_number, 40),
      email,
      registered_business_confirmed: body.registered_business_confirmed === true,
      certification_understood: body.certification_understood === true,
      info_accurate_confirmed: body.info_accurate_confirmed === true,
      terms_accepted: body.terms_accepted === true,
    };

    const { data, error } = await supabase.rpc("complete_growth_partner_public_signup", {
      p_payload: payload,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (isCspSellerExistsPayload(data)) {
      return NextResponse.json(
        {
          ok: false,
          error: CSP_SELLER_EXISTS_CODE,
          code: CSP_SELLER_EXISTS_CODE,
          redirect_path: PARTNERS_PORTAL_REDIRECT,
          ...(data && typeof data === "object" ? (data as Record<string, unknown>) : {}),
        },
        { status: 409 },
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to complete Growth Partner registration" }, { status: 500 });
  }
}
