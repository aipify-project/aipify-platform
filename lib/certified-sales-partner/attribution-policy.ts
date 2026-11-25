/**
 * CSP attribution policy helpers — pure.
 */
import {
  CSP_ATTRIBUTION_WINDOW_DAYS,
  CSP_CHANNEL_ORIGINS,
  type CspChannelOrigin,
} from "./constants";
import { isWithinAttributionWindow } from "./commission-rules";

const CHANNEL_ALIASES: Record<string, CspChannelOrigin> = {
  fb: "facebook",
  meta: "facebook",
  ig: "instagram",
  insta: "instagram",
  twitter: "x",
  "x.com": "x",
  tt: "tiktok",
  snap: "snapchat",
  li: "linkedin",
  mail: "email",
  newsletter: "email",
  qrcode: "qr",
  "qr_code": "qr",
  referral: "referral_link",
  link: "referral_link",
  code: "partner_code",
  manual: "manual_platform_assignment",
};

export function normalizeChannel(raw: string | null | undefined): CspChannelOrigin {
  const key = String(raw ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (!key) return "other";
  if ((CSP_CHANNEL_ORIGINS as readonly string[]).includes(key)) return key as CspChannelOrigin;
  return CHANNEL_ALIASES[key] ?? CHANNEL_ALIASES[key.replace(/_/g, "")] ?? "other";
}

/** A partner can never earn from their own account. Missing ids are never treated as self. */
export function isSelfReferral(input: {
  partnerAuthUserId?: string | null;
  customerAuthUserId?: string | null;
}): boolean {
  const p = input?.partnerAuthUserId;
  const c = input?.customerAuthUserId;
  return typeof p === "string" && p.length > 0 && p === c;
}

export type CspFirstTouchDecision = {
  winner: "existing" | "new";
  firstTouchAt: string;
};

/**
 * First valid touch wins: an existing touch is kept while it is still inside the
 * attribution window relative to the new touch; otherwise the new touch wins.
 */
export function firstValidTouchWins(input: {
  existingFirstTouchAt?: Date | string | null;
  newTouchAt: Date | string;
  windowDays?: number;
}): CspFirstTouchDecision {
  const newIso = new Date(input.newTouchAt).toISOString();
  if (input.existingFirstTouchAt == null) return { winner: "new", firstTouchAt: newIso };
  const existing = new Date(input.existingFirstTouchAt);
  if (Number.isNaN(existing.getTime())) return { winner: "new", firstTouchAt: newIso };
  if (isWithinAttributionWindow(existing, input.newTouchAt, input.windowDays ?? CSP_ATTRIBUTION_WINDOW_DAYS)) {
    return { winner: "existing", firstTouchAt: existing.toISOString() };
  }
  return { winner: "new", firstTouchAt: newIso };
}

const BOT_UA_RE =
  /bot|crawler|spider|crawling|slurp|headless|phantomjs|puppeteer|playwright|selenium|curl\/|wget\/|python-requests|httpclient|facebookexternalhit|preview|monitor|scrapy|okhttp\/|go-http-client/i;

/** Simple heuristic — an empty user agent is treated as bot-like (fail-closed for attribution). */
export function isBotLikeUserAgent(ua: string | null | undefined): boolean {
  const s = String(ua ?? "").trim();
  if (!s) return true;
  return BOT_UA_RE.test(s);
}

/** Core-issued link codes look like `csp-` + 12 lowercase hex characters (see `csp_create_attribution_link`). */
const CSP_LINK_CODE_RE = /^csp-[a-z0-9]{12}$/;

export function isCspLinkCode(value: string | null | undefined): boolean {
  return typeof value === "string" && CSP_LINK_CODE_RE.test(value);
}

/**
 * Public marketing destination for a CSP product slug — allowlist only, never an open redirect.
 *  - `kompis_web`: the root sales page IS the Kompis Web page.
 *  - `kompis_bedrift`: no public product page yet → demo booking.
 *  - anything else (incl. future `aipify_voice`): `null` → caller fails closed to `/`.
 */
export function resolveCspProductDestination(productSlug: string | null | undefined): string | null {
  switch (String(productSlug ?? "").trim().toLowerCase().replace(/-/g, "_")) {
    case "kompis_web":
      return "/";
    case "kompis_bedrift":
      return "/book-demo";
    default:
      return null;
  }
}

/**
 * Public path for a Core-issued link. Core returns the placeholder `/r/<code>`; the APP remaps it to the
 * canonical `/p/{code}/{productKey}` attribution route.
 */
export function buildCspPublicLinkPath(input: {
  code: string;
  productKey: string;
  channel: string;
}): string | null {
  if (!isCspLinkCode(input.code) || resolveCspProductDestination(input.productKey) === null) return null;
  const channel = encodeURIComponent(input.channel);
  return `/p/${input.code}/${input.productKey.trim().toLowerCase().replace(/-/g, "_")}?channel=${channel}`;
}
