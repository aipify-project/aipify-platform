import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  buildPasswordResetRedirectUrl,
  readRequestHostFromHeaders,
} from "@/lib/auth/auth-redirect-urls";
import {
  isForgotPasswordUnknownAccountMessage,
  logForgotPasswordFailure,
  mapForgotPasswordProviderError,
  normalizeForgotPasswordEmail,
} from "@/lib/auth/forgot-password";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "request_failed" },
        { status: 400, headers: NO_STORE },
      );
    }

    const email = normalizeForgotPasswordEmail(
      body && typeof body === "object" && !Array.isArray(body)
        ? (body as Record<string, unknown>).email
        : null,
    );

    if (!email) {
      return NextResponse.json(
        { error: "email_required" },
        { status: 400, headers: NO_STORE },
      );
    }

    const supabase = await createClient();
    const headerStore = await headers();
    const redirectTo = buildPasswordResetRedirectUrl({
      requestHost: readRequestHostFromHeaders(headerStore),
    });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      // Anti-enumeration: unknown account must look like success publicly.
      if (isForgotPasswordUnknownAccountMessage(error.message)) {
        return NextResponse.json(
          { ok: true, redirectToHost: new URL(redirectTo).host },
          { headers: NO_STORE },
        );
      }

      const code = mapForgotPasswordProviderError(error.message);
      logForgotPasswordFailure({
        code,
        status: 400,
        providerMessageLength: error.message?.length,
      });
      return NextResponse.json({ error: code }, { status: 400, headers: NO_STORE });
    }

    return NextResponse.json(
      { ok: true, redirectToHost: new URL(redirectTo).host },
      { headers: NO_STORE },
    );
  } catch {
    logForgotPasswordFailure({ code: "request_failed", status: 500 });
    return NextResponse.json(
      { error: "request_failed" },
      { status: 500, headers: NO_STORE },
    );
  }
}
