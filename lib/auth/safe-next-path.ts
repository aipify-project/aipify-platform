const CUSTOMER_PORTAL_PREFIXES = ["/app", "/dashboard"] as const;

/** Reject open redirects — allow same-origin relative paths only. */
export function sanitizeNextPath(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
  if (trimmed.includes("://") || trimmed.includes("\\")) return null;

  try {
    const parsed = new URL(trimmed, "https://app.aipify.ai");
    if (parsed.origin !== "https://app.aipify.ai") return null;
  } catch {
    return null;
  }

  return trimmed;
}

export function isCustomerPortalPath(pathname: string): boolean {
  return CUSTOMER_PORTAL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
