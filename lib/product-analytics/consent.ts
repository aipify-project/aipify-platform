import { getBrowserAuthCookieOptions } from "@/lib/supabase/auth-cookies";

/** First-party analytics consent — no fingerprinting, no user id. */
export const ANALYTICS_CONSENT_COOKIE_NAME = "aipify-analytics-consent";

export const ANALYTICS_CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type AnalyticsConsentDecision = "granted" | "denied";

export type AnalyticsConsentState = "unknown" | AnalyticsConsentDecision;

export type AnalyticsConsentLabels = {
  bannerTitle: string;
  necessaryCookies: string;
  analyticsCookies: string;
  acceptAnalytics: string;
  declineAnalytics: string;
  privacyLink: string;
  privacySettingsOpen: string;
  privacySettingsManageTitle: string;
  privacySettingsClose: string;
};

export function buildAnalyticsConsentLabels(t: (key: string) => string): AnalyticsConsentLabels {
  const prefix = "analyticsConsent";
  return {
    bannerTitle: t(`${prefix}.banner.title`),
    necessaryCookies: t(`${prefix}.banner.necessaryCookies`),
    analyticsCookies: t(`${prefix}.banner.analyticsCookies`),
    acceptAnalytics: t(`${prefix}.banner.acceptAnalytics`),
    declineAnalytics: t(`${prefix}.banner.declineAnalytics`),
    privacyLink: t(`${prefix}.banner.privacyLink`),
    privacySettingsOpen: t(`${prefix}.privacySettings.open`),
    privacySettingsManageTitle: t(`${prefix}.privacySettings.manageTitle`),
    privacySettingsClose: t(`${prefix}.privacySettings.close`),
  };
}

export function parseAnalyticsConsentCookieValue(
  raw: string | null | undefined
): AnalyticsConsentState {
  if (!raw) return "unknown";
  const normalized = raw.trim().toLowerCase();
  if (normalized === "granted") return "granted";
  if (normalized === "denied") return "denied";
  return "unknown";
}

export function readAnalyticsConsentFromCookieString(cookieHeader: string): AnalyticsConsentState {
  const escaped = ANALYTICS_CONSENT_COOKIE_NAME.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  const raw = match?.[1] ? decodeURIComponent(match[1]) : null;
  return parseAnalyticsConsentCookieValue(raw);
}

/** Analytics is allowed only after explicit grant. Unknown and denied are blocked. */
export function isAnalyticsConsentAllowed(state: AnalyticsConsentState): boolean {
  return state === "granted";
}

export function isAnalyticsConsentBlocked(state: AnalyticsConsentState): boolean {
  return !isAnalyticsConsentAllowed(state);
}

export function formatAnalyticsConsentCookie(decision: AnalyticsConsentDecision): string {
  const options = getBrowserAuthCookieOptions();
  const parts = [
    `${ANALYTICS_CONSENT_COOKIE_NAME}=${decision}`,
    `max-age=${ANALYTICS_CONSENT_COOKIE_MAX_AGE_SECONDS}`,
    `path=${options.path}`,
    `SameSite=${options.sameSite}`,
  ];
  if (options.secure) parts.push("Secure");
  if (options.domain) parts.push(`Domain=${options.domain}`);
  return parts.join("; ");
}

export function writeAnalyticsConsentCookie(decision: AnalyticsConsentDecision): void {
  if (typeof document === "undefined") return;
  document.cookie = formatAnalyticsConsentCookie(decision);
}

export function readAnalyticsConsentFromDocument(): AnalyticsConsentState {
  if (typeof document === "undefined") return "unknown";
  return readAnalyticsConsentFromCookieString(document.cookie);
}
