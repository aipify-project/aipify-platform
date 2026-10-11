/**
 * Customer-facing site label from verified host — never "Www" from www.example.com.
 * Returns null when unknown so callers can use a neutral phrase ("nettstedet").
 */
export function siteLabelFromDomain(domain: string | null | undefined): string | null {
  if (!domain) return null;
  let host = domain.trim().toLowerCase();
  host = host.replace(/^https?:\/\//i, "");
  host = host.replace(/\/.*$/, "");
  host = host.replace(/:\d+$/, "");
  if (!host) return null;

  const parts = host.split(".").filter(Boolean);
  while (parts.length > 1 && (parts[0] === "www" || parts[0] === "m")) {
    parts.shift();
  }
  const label = parts[0]?.trim() ?? "";
  if (!label || label === "www" || label.length < 2) return null;
  return label.charAt(0).toUpperCase() + label.slice(1);
}
