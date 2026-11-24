import { NextResponse } from "next/server";
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
 * Fail-closed to marketing home when partner/product is inactive or unresolved.
 * Does not invent open redirects — destination allowlist stays in resolvePartnerLinkDestination.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ partnerSlug: string; productSlug: string }> },
) {
  const { partnerSlug, productSlug } = await context.params;
  const url = new URL(request.url);
  const channel = url.searchParams.get("channel") ?? "other";

  const supabase = await createClient();
  const { data: resolved, error } = await supabase.rpc("resolve_growth_partner_public_link", {
    p_slug: partnerSlug,
  });

  if (error || !resolved?.found) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const existingSession =
    request.headers.get("cookie")?.match(/aipify_gp_session=([^;]+)/)?.[1] ??
    crypto.randomUUID();

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

  const destination = resolvePartnerLinkDestination(productSlug, productSlug);
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
