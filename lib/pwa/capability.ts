/** Detect embedded / in-app browsers that cannot install PWAs reliably. */
export function isUnsupportedEmbeddedBrowser(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return (
    ua.includes("fbav") ||
    ua.includes("instagram") ||
    ua.includes("line/") ||
    ua.includes("micromessenger") ||
    ua.includes("linkedinapp")
  );
}

export function isStandaloneDisplayMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIosSafari(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) && ua.includes("safari") && !ua.includes("crios") && !ua.includes("fxios");
}

export function supportsBeforeInstallPrompt(userAgent: string): boolean {
  if (isUnsupportedEmbeddedBrowser(userAgent)) return false;
  // Chromium desktop/Android — beforeinstallprompt when SW + manifest present.
  return /chrome|crios|edg|samsungbrowser/i.test(userAgent) && !/iphone|ipad|ipod/i.test(userAgent);
}

export function supportsManualInstallHint(userAgent: string): boolean {
  return isIosSafari(userAgent) && !isUnsupportedEmbeddedBrowser(userAgent);
}

export function canOfferWebAppInstall(userAgent: string, standalone: boolean): boolean {
  if (standalone) return false;
  if (isUnsupportedEmbeddedBrowser(userAgent)) return false;
  return supportsBeforeInstallPrompt(userAgent) || supportsManualInstallHint(userAgent);
}
