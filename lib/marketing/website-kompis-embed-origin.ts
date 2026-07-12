/** Parse and normalize browser Origin request headers for Website Kompis embed gates. */

export const WEBSITE_KOMPIS_NULL_ORIGIN = "null" as const;

export function parseWebsiteKompisRequestOriginHostname(
  originHeader: string | null,
): string | null {
  if (!originHeader || originHeader.trim().toLowerCase() === WEBSITE_KOMPIS_NULL_ORIGIN) {
    return null;
  }

  try {
    const parsed = new URL(originHeader);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    const hostname = parsed.hostname.trim().toLowerCase();
    if (!hostname || !/^[a-z0-9.-]+$/.test(hostname) || hostname.includes("..")) {
      return null;
    }
    return hostname;
  } catch {
    return null;
  }
}

export function isWebsiteKompisAllowedDevOriginHostname(hostname: string): boolean {
  if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production") {
    return false;
  }
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".vercel.app")
  );
}

export function websiteKompisOriginHostnamesMatch(
  originHostname: string,
  registeredDomain: string,
): boolean {
  return originHostname.trim().toLowerCase() === registeredDomain.trim().toLowerCase();
}

export function buildWebsiteKompisCorsHeaders(validatedOrigin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": validatedOrigin,
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
  };
}
