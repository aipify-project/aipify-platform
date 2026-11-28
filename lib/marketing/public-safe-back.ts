/**
 * Safe public-page back navigation.
 * Prefer same-origin browser history; otherwise fall back to the public Aipify home.
 */

export const PUBLIC_AIPIFY_HOME_HREF = "/" as const;

export function isSameOriginReferrer(
  referrer: string | null | undefined,
  currentOrigin: string,
): boolean {
  const raw = typeof referrer === "string" ? referrer.trim() : "";
  if (!raw || !currentOrigin) return false;
  try {
    return new URL(raw).origin === currentOrigin;
  } catch {
    return false;
  }
}

/** True when history.back() is preferred over navigating to the fallback href. */
export function shouldUseHistoryBack(input: {
  referrer: string | null | undefined;
  currentOrigin: string;
  historyLength: number;
}): boolean {
  if (input.historyLength < 2) return false;
  return isSameOriginReferrer(input.referrer, input.currentOrigin);
}

export function resolvePublicSafeBackHref(input?: {
  fallbackHref?: string;
}): string {
  const fallback = input?.fallbackHref?.trim();
  if (fallback && fallback.startsWith("/") && !fallback.startsWith("//")) {
    return fallback;
  }
  return PUBLIC_AIPIFY_HOME_HREF;
}
