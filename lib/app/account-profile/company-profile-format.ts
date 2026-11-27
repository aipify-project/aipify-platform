export function cleanCompanyText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function cleanCompanyWebsite(value: unknown): string | null {
  const trimmed = cleanCompanyText(value);
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) return null;
  return trimmed;
}

export function formatCompanyAddressLines(input: {
  street: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
}): string | null {
  const line1 = input.street;
  const line2 = [input.postalCode, input.city].filter(Boolean).join(" ").trim() || null;
  const line3 = input.country;
  const lines = [line1, line2, line3].filter(Boolean);
  return lines.length > 0 ? lines.join("\n") : null;
}

export function companyWebsiteHref(website: string | null): string | null {
  const value = cleanCompanyWebsite(website);
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) return `https://${value}`;
  return null;
}
