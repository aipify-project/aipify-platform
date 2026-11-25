import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  isAuthLifecycleEmailConfigured,
  sendAuthLifecycleEmail,
} from "@/lib/auth/auth-lifecycle-email";
import { readRequestHostFromHeaders } from "@/lib/auth/auth-redirect-urls";
import {
  logForgotPasswordFailure,
  mapForgotPasswordProviderError,
  normalizeForgotPasswordEmail,
} from "@/lib/auth/forgot-password";
import { logAuthRecoveryEvent } from "@/lib/auth/auth-recovery-log";
import { createSecureRecoveryLink } from "@/lib/auth/secure-recovery-link";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Password reset — cross-device safe.
 * Uses admin generateLink + token_hash emailed via Resend (localized).
 * Avoids the browser-bound PKCE recovery request path that fails when the
 * email is opened on a different device than the one that started the request.
 */
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

    const bodyLocale =
      body && typeof body === "object" && !Array.isArray(body)
        ? (body as Record<string, unknown>).locale
        : null;

    if (!isAuthLifecycleEmailConfigured()) {
      logForgotPasswordFailure({ code: "delivery_failed", status: 400 });
      return NextResponse.json(
        { error: "delivery_failed" },
        { status: 400, headers: NO_STORE },
      );
    }

    const headerStore = await headers();
    const requestHost = readRequestHostFromHeaders(headerStore);
    const cookieLocale = headerStore.get("cookie")?.match(/(?:^|;\s*)aipify-locale=([^;]+)/)?.[1] ?? null;
    const localeHint =
      (typeof bodyLocale === "string" && bodyLocale.trim()) ||
      (cookieLocale ? decodeURIComponent(cookieLocale) : null);

    const link = await createSecureRecoveryLink({
      email,
      purpose: "password_reset",
      requestHost,
    });

    // Anti-enumeration: unknown account looks like success publicly.
    if (!link.ok && link.reason === "user_not_found") {
      logAuthRecoveryEvent("forgot_password_unknown_account", { pathname: "/api/auth/forgot-password" });
      return NextResponse.json({ ok: true }, { headers: NO_STORE });
    }

    if (!link.ok) {
      const code =
        link.reason === "service_unavailable" ? "request_failed" : "delivery_failed";
      logForgotPasswordFailure({ code, status: 400 });
      return NextResponse.json({ error: code }, { status: 400, headers: NO_STORE });
    }

    const delivery = await sendAuthLifecycleEmail({
      to: link.email,
      kind: "password_reset",
      locale: link.locale ?? localeHint,
      actionUrl: link.absoluteUrl,
      idempotencyKey: `auth-reset-${link.email}-${Date.now().toString(36).slice(0, 8)}`,
    });

    // Drop URL reference immediately — never retain in response.
    if (delivery.status === "not_configured" || delivery.status === "failed") {
      const code =
        delivery.status === "failed"
          ? mapForgotPasswordProviderError(delivery.error)
          : "delivery_failed";
      logForgotPasswordFailure({ code, status: 400 });
      return NextResponse.json({ error: code }, { status: 400, headers: NO_STORE });
    }

    logAuthRecoveryEvent("forgot_password_accepted", {
      pathname: "/api/auth/forgot-password",
      recoveryEstablished: false,
    });

    return NextResponse.json(
      { ok: true, redirectToHost: new URL(link.absoluteUrl).host },
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
