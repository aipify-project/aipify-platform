import { NextResponse } from "next/server";
import { buildCspLoginUrl } from "@/lib/certified-sales-partner";
import { checkCspOnboardingEmailRateLimit } from "@/lib/certified-sales-partner/onboarding-email";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Re-requests the signup confirmation email for the signed-in applicant via the user session.
 * `accepted` means Supabase accepted the request — not that the message reached an inbox.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json(
        { status: "login_required", code: "login_required", login_url: buildCspLoginUrl("/certified-sales-partner/verify-email") },
        { status: 401, headers: NO_STORE },
      );
    }

    if (user.email_confirmed_at) {
      return NextResponse.json({ status: "already_verified", email_verified: true }, { headers: NO_STORE });
    }

    const limit = checkCspOnboardingEmailRateLimit("resend_verification", user.email);
    if (!limit.allowed) {
      return NextResponse.json(
        { status: "rate_limited", code: "rate_limited", retry_after_seconds: limit.retryAfterSeconds },
        { status: 429, headers: { ...NO_STORE, "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
    if (error) {
      const providerLimited = error.status === 429;
      return NextResponse.json(
        {
          status: providerLimited ? "rate_limited" : "failed",
          code: providerLimited ? "rate_limited" : "resend_failed",
        },
        { status: providerLimited ? 429 : 502, headers: NO_STORE },
      );
    }

    return NextResponse.json({ status: "accepted", email_verified: false }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ status: "failed", code: "resend_failed" }, { status: 500, headers: NO_STORE });
  }
}
