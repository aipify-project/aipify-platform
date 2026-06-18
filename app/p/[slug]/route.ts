import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  GROWTH_PARTNER_ATTRIBUTION_COOKIE,
  GROWTH_PARTNER_SESSION_COOKIE,
  resolvePartnerLinkDestination,
  serializeAttributionCookie,
} from "@/lib/growth-partner-attribution";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const url = new URL(request.url);
  const to = url.searchParams.get("to");
  const pack = url.searchParams.get("pack");
  const campaign = url.searchParams.get("campaign");
  const utmSource = url.searchParams.get("utm_source");
  const utmMedium = url.searchParams.get("utm_medium");
  const utmCampaign = url.searchParams.get("utm_campaign");

  const supabase = await createClient();
  const { data: resolved, error } = await supabase.rpc("resolve_growth_partner_public_link", {
    p_slug: slug,
  });

  if (error || !resolved?.found) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const existingSession = request.headers.get("cookie")?.match(/aipify_gp_session=([^;]+)/)?.[1]
    ?? crypto.randomUUID();

  const { data: captured } = await supabase.rpc("capture_growth_partner_attribution", {
    p_payload: {
      partner_slug: slug,
      session_key: existingSession,
      campaign_id: campaign ?? "",
      utm_source: utmSource ?? "",
      utm_medium: utmMedium ?? "",
      utm_campaign: utmCampaign ?? "",
      landing_page: url.pathname,
      referrer: request.headers.get("referer") ?? "",
      destination_key: to ?? pack ?? "home",
    },
  });

  const destination = resolvePartnerLinkDestination(to, pack);
  const redirectUrl = new URL(destination, request.url);

  if (campaign) redirectUrl.searchParams.set("gp_campaign", campaign);
  redirectUrl.searchParams.set("gp_ref", String(resolved.partner_public_id ?? ""));

  const response = NextResponse.redirect(redirectUrl);

  const now = new Date().toISOString();
  const cookiePayload = serializeAttributionCookie({
    partnerPublicId: String(resolved.partner_public_id ?? ""),
    partnerSlug: String(resolved.slug ?? slug),
    profileId: typeof resolved.profile_id === "string" ? resolved.profile_id : undefined,
    sessionKey: String(captured?.session_key ?? existingSession),
    campaignId: campaign ?? undefined,
    utmSource: utmSource ?? undefined,
    utmMedium: utmMedium ?? undefined,
    utmCampaign: utmCampaign ?? undefined,
    firstTouchAt: now,
    lastTouchAt: now,
  });

  response.cookies.set(GROWTH_PARTNER_ATTRIBUTION_COOKIE, cookiePayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  response.cookies.set(GROWTH_PARTNER_SESSION_COOKIE, String(captured?.session_key ?? existingSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}
