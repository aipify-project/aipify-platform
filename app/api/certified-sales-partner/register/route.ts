import { NextResponse } from "next/server";
import {
  buildCspLoginUrl,
  callCspRpc,
  CSP_APPLY_NEXT_PATH,
  failClosedJson,
  isCspUnauthorizedCode,
  mapCspRegistrationRpcError,
  parseCspRegistrationApplication,
  validateCspRegistration,
} from "@/lib/certified-sales-partner";
import { notifyCspAdminsOfNewApplication } from "@/lib/certified-sales-partner/admin-notify";
import {
  deliverCspOnboardingEmailThrottled,
  type CspOnboardingEmailOutcome,
} from "@/lib/certified-sales-partner/onboarding-email";
import {
  assertPublicFormSubmission,
  logSuspiciousSubmission,
  resolvePublicFormGuardCode,
} from "@/lib/public-forms/bot-protection";
import { createClient } from "@/lib/supabase/server";

/** Opaque reference the customer can quote to support — carries no personal data. */
function newSupportRef(): string {
  return `CSP-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function loginRequiredResponse() {
  return NextResponse.json(
    {
      error: "login_required",
      code: "login_required",
      next: CSP_APPLY_NEXT_PATH,
      login_url: buildCspLoginUrl(),
    },
    { status: 401 },
  );
}

/**
 * CSP public registration — fail-closed until Core RPC accepts writes.
 * `csp_register_partner_application` requires `auth.uid()`, so anonymous submits get
 * 401 `login_required` and are never reported as stored.
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
      // Stable code for the UI; `error` mirrors it so no English sentence reaches the form.
      const guardCode = resolvePublicFormGuardCode(guard) ?? "submission_blocked";
      return NextResponse.json({ error: guardCode, code: guardCode }, { status: guard.status });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return loginRequiredResponse();

    const validated = validateCspRegistration({
      fullName: body.full_name ?? body.fullName,
      email: body.email,
      country: body.country,
      legalBusinessName: body.legal_business_name ?? body.legalBusinessName,
      businessRegistrationNumber:
        body.business_registration_number ?? body.businessRegistrationNumber,
      phone: body.phone,
      phoneDial: body.phone_dial ?? body.phoneDial,
      phoneNational: body.phone_national ?? body.phoneNational,
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
      return NextResponse.json({ error: validated.error, code: validated.error, field: validated.field }, { status: 400 });
    }

    const result = await callCspRpc(supabase, "csp_register_partner_application", {
      p_payload: validated.payload,
    });
    if (!result.ready) {
      if (result.error === "unauthorized" || isCspUnauthorizedCode(result.detail)) return loginRequiredResponse();
      // Core raised a known validation/confirmation error — report it as such, not as "backend closed".
      const mappedDetail = result.error === "rpc_error" ? mapCspRegistrationRpcError(result.detail) : null;
      if (mappedDetail) {
        return NextResponse.json(
          { error: mappedDetail.code, code: mappedDetail.code },
          { status: mappedDetail.status },
        );
      }
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

    // Core may answer an auth/confirmation problem as data — never report that as a stored application.
    const data = result.data;
    const coreError =
      data && typeof data === "object" && "error" in data ? (data as { error?: unknown }).error : null;
    if (typeof coreError === "string" && coreError) {
      const mapped = mapCspRegistrationRpcError(coreError);
      if (mapped?.code === "login_required") return loginRequiredResponse();
      const unmappedRef = mapped ? undefined : newSupportRef();
      if (unmappedRef) console.error("[csp-register] unmapped core error", { support_ref: unmappedRef });
      return NextResponse.json(
        {
          error: mapped?.code ?? "registration_failed",
          code: mapped?.code ?? "registration_failed",
          ...(unmappedRef ? { support_ref: unmappedRef } : {}),
        },
        { status: mapped?.status ?? 422 },
      );
    }

    const application = parseCspRegistrationApplication(data);

    // Application is already stored — email problems are reported, never turned into a failure.
    const emailVerified = Boolean(user.email_confirmed_at);
    const emailDelivery: {
      receipt: CspOnboardingEmailOutcome | "no_email";
      verify?: CspOnboardingEmailOutcome;
      admin?: CspOnboardingEmailOutcome | "no_recipients";
    } = {
      receipt: "no_email",
    };
    let emailWarning: "auth_email_used" | undefined;
    const locale = validated.payload.preferredLocale;
    if (user.email) {
      if (user.email.toLowerCase() !== validated.payload.email.toLowerCase()) emailWarning = "auth_email_used";
      const vars = { name: validated.payload.fullName, emailVerified };
      // Idempotent per user: retries must not spam receipt mail.
      emailDelivery.receipt = (
        await deliverCspOnboardingEmailThrottled({
          kind: "application_received",
          to: user.email,
          locale,
          vars,
          idempotencyKey: `csp-application_received-${user.id}`,
        })
      ).outcome;
      if (!emailVerified) {
        emailDelivery.verify = (
          await deliverCspOnboardingEmailThrottled({
            kind: "verify_email_nudge",
            to: user.email,
            locale,
            vars,
            idempotencyKey: `csp-verify_email_nudge-${user.id}`,
          })
        ).outcome;
      }
    }

    // Admin notify only on newly created applications (not existing resubmits).
    if (application.created && application.partnerId) {
      const adminNotify = await notifyCspAdminsOfNewApplication({
        partnerId: application.partnerId,
        displayName: validated.payload.fullName,
        country: validated.payload.country,
        locale,
      });
      emailDelivery.admin = adminNotify.outcome;
    }

    return NextResponse.json({
      ...(data && typeof data === "object" ? (data as Record<string, unknown>) : { data }),
      created: application.created,
      status: application.partnerStatus,
      email_verified: emailVerified,
      email_delivery: emailDelivery,
      ...(emailWarning ? { email_warning: emailWarning } : {}),
    });
  } catch (error) {
    const supportRef = newSupportRef();
    console.error("[csp-register] unexpected failure", {
      support_ref: supportRef,
      name: error instanceof Error ? error.name : "unknown",
    });
    return NextResponse.json(
      { error: "registration_failed", code: "registration_failed", support_ref: supportRef },
      { status: 500 },
    );
  }
}
