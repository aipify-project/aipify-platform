import { NextResponse } from "next/server";
import {
  isBotLikeUserAgent,
  isCspLinkCode,
  normalizeChannel,
  resolveCspProductDestination,
  CSP_ATTRIBUTION_COOKIE,
  CSP_SESSION_COOKIE,
  decideCspPublicCapture,
  newCspSessionKey,
  serializeCspAttributionCookie,
  CSP_CAPTURE_RPC,
} from "@/lib/certified-sales-partner";
import { appendAllowlistedShareLocale } from "@/lib/certified-sales-partner/share-locale";
import { createClient } from "@/lib/supabase/server";
import {
  GROWTH_PARTNER_ATTRIBUTION_COOKIE,
  GROWTH_PARTNER_SESSION_COOKIE,
  resolvePartnerLinkDestination,
  serializeAttributionCookie,
} from "@/lib/growth-partner-attribution";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

/**
 * Canonical CSP product attribution path: /p/{partnerSlug}/{productSlug}
 *
 * 1. Growth Partner slug → resolve_growth_partner_public_link + capture_growth_partner_attribution.
 * 2. Core CSP link code (`csp-<12 chars>`) → csp_capture_public_attribution_click when Core V6
 *    SQL is applied; otherwise land on product page without attribution (fail closed).
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ partnerSlug: string; productSlug: string }> },
) {
  const { partnerSlug, productSlug } = await context.params;
  const url = new URL(request.url);
  const channel = normalizeChannel(url.searchParams.get("channel"));
  const botLike = isBotLikeUserAgent(request.headers.get("user-agent"));

  const supabase = await createClient();
  const { data: resolved, error } = await supabase.rpc("resolve_growth_partner_public_link", {
    p_slug: partnerSlug,
  });

  if (error || !resolved?.found) {
    const cspDestination = isCspLinkCode(partnerSlug) ? resolveCspProductDestination(productSlug) : null;
    if (cspDestination === null) return NextResponse.redirect(new URL("/", request.url));

    const cookieHeader = request.headers.get("cookie") ?? "";
    const existingSession =
      cookieHeader.match(new RegExp(`${CSP_SESSION_COOKIE}=([^;]+)`))?.[1] ?? newCspSessionKey();

    let captureRecorded = false;
    if (!botLike) {
      const decision = decideCspPublicCapture({
        code: partnerSlug,
        productKey: productSlug,
        sessionKey: existingSession,
        userAgent: request.headers.get("user-agent"),
        rateKey: `${partnerSlug}:${productSlug}:${request.headers.get("x-forwarded-for") ?? "local"}`,
      });
      if (decision.ok) {
        const { data: captured, error: captureError } = await supabase.rpc(CSP_CAPTURE_RPC, {
          p_payload: decision.payload,
        });
        // Missing RPC (PREPARED_ONLY) → fail closed: no cookie credit, still redirect.
        if (!captureError && captured && typeof captured === "object") {
          const row = captured as { recorded?: boolean; duplicate?: boolean; error?: string };
          captureRecorded = row.recorded === true || row.duplicate === true;
        }
      }
    }

    const cspRedirect = new URL(cspDestination, request.url);
    cspRedirect.searchParams.set("csp_product", productSlug);
    cspRedirect.searchParams.set("csp_channel", channel);
    appendAllowlistedShareLocale(cspRedirect, url.searchParams.get("lang"));
    const response = NextResponse.redirect(cspRedirect);

    if (captureRecorded) {
      const now = new Date().toISOString();
      response.cookies.set(
        CSP_ATTRIBUTION_COOKIE,
        serializeCspAttributionCookie({
          code: partnerSlug,
          productKey: productSlug.trim().toLowerCase().replace(/-/g, "_"),
          sessionKey: existingSession,
          firstTouchAt: now,
          lastTouchAt: now,
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: COOKIE_MAX_AGE,
          path: "/",
        },
      );
      response.cookies.set(CSP_SESSION_COOKIE, existingSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });
    }

    return response;
  }

  const existingSession =
    request.headers.get("cookie")?.match(/aipify_gp_session=([^;]+)/)?.[1] ??
    crypto.randomUUID();

  if (!botLike) {
    await supabase.rpc("capture_growth_partner_attribution", {
      p_payload: {
        partner_slug: partnerSlug,
        session_key: existingSession,
        campaign_id: productSlug,
        utm_source: channel,
        utm_medium: "partner_link",
        utm_campaign: productSlug,
        landing_page: url.pathname,
        referrer: request.headers.get("referer") ?? "",
        destination_key: productSlug,
      },
    });
  }

  const destination =
    resolveCspProductDestination(productSlug) ?? resolvePartnerLinkDestination(productSlug, productSlug);
  const redirectUrl = new URL(destination, request.url);
  redirectUrl.searchParams.set("gp_ref", String(resolved.partner_public_id ?? ""));
  redirectUrl.searchParams.set("csp_product", productSlug);
  redirectUrl.searchParams.set("csp_channel", channel);
  appendAllowlistedShareLocale(redirectUrl, url.searchParams.get("lang"));

  const response = NextResponse.redirect(redirectUrl);
  const now = new Date().toISOString();
  response.cookies.set(
    GROWTH_PARTNER_ATTRIBUTION_COOKIE,
    serializeAttributionCookie({
      partnerPublicId: String(resolved.partner_public_id ?? ""),
      partnerSlug: String(resolved.slug ?? partnerSlug),
      profileId: typeof resolved.profile_id === "string" ? resolved.profile_id : undefined,
      sessionKey: existingSession,
      campaignId: productSlug,
      utmSource: channel,
      utmMedium: "partner_link",
      utmCampaign: productSlug,
      firstTouchAt: now,
      lastTouchAt: now,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    },
  );
  response.cookies.set(GROWTH_PARTNER_SESSION_COOKIE, existingSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return response;
}
