import { NextResponse } from "next/server";
import {
  callCspRpc,
  failClosedJson,
  validateCspRegistration,
} from "@/lib/certified-sales-partner";
import { assertPublicFormSubmission, logSuspiciousSubmission } from "@/lib/public-forms/bot-protection";
import { createClient } from "@/lib/supabase/server";

/**
 * CSP public registration — fail-closed until Core RPC accepts writes.
 * Feature owner: PLATFORM (approval) + PARTNERS (self-serve signup).
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const guard = assertPublicFormSubmission(request, body, "csp-register");
    if (!guard.ok) {
      if (guard.log) {
        logSuspiciousSubmission(
          "csp-register",
          guard.log,
          request.headers.get("x-forwarded-for") ?? "unknown",
        );
      }
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }

    const validated = validateCspRegistration({
      fullName: body.full_name ?? body.fullName,
      email: body.email,
      country: body.country,
      legalBusinessName: body.legal_business_name ?? body.legalBusinessName,
      businessRegistrationNumber:
        body.business_registration_number ?? body.businessRegistrationNumber,
      phone: body.phone,
      preferredLocale: body.preferred_locale ?? body.preferredLocale,
      address: body.address,
      registeredBusinessConfirmed:
        body.registered_business_confirmed ?? body.registeredBusinessConfirmed,
      termsAccepted: body.terms_accepted ?? body.termsAccepted,
      certificationUnderstood:
        body.certification_understood ?? body.certificationUnderstood,
      infoAccurateConfirmed:
        body.info_accurate_confirmed ?? body.infoAccurateConfirmed,
    });
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const supabase = await createClient();
    const result = await callCspRpc(supabase, "csp_register_partner_application", {
      p_payload: validated.payload,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(
        {
          ...closed.body,
          message:
            "Registration is prepared but Core CSP backend is not active yet. Application was not stored.",
        },
        { status: closed.status },
      );
    }
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "registration_failed" }, { status: 500 });
  }
}
