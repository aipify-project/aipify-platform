import { NextResponse } from "next/server";
import {
  isBotLikeUserAgent,
  isCspLinkCode,
  normalizeChannel,
  resolveCspProductDestination,
} from "@/lib/certified-sales-partner";
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
 * Two kinds of {partnerSlug}:
 *  1. Growth Partner slug (hybrid path, unchanged): resolved via `resolve_growth_partner_public_link`,
 *     attribution captured via `capture_growth_partner_attribution`.
 *  2. Core CSP link code (`csp-<12 chars>`, issued by `csp_create_attribution_link`): Core currently
 *     exposes NO public resolve/capture RPC for these codes, so no attribution is recorded and no
 *     attribution cookie is set — fail closed (nobody is credited). The visitor still lands on the
 *     product's marketing page. Wire CSP capture here once Core ships a public resolve/capture RPC.
 *
 * Destination: known product slugs use the CSP allowlist (`resolveCspProductDestination`); otherwise the
 * Growth Partner allowlist (`resolvePartnerLinkDestination`). Never an open redirect.
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
    // CSP link code: land on the product page, record nothing (see route doc).
    const cspRedirect = new URL(cspDestination, request.url);
    cspRedirect.searchParams.set("csp_product", productSlug);
    cspRedirect.searchParams.set("csp_channel", channel);
    return NextResponse.redirect(cspRedirect);
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
