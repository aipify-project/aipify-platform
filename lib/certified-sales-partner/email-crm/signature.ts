import { buildCspPublicLinkPath } from "../attribution-policy";
import type { CspEmailTemplateLocale } from "../email-templates/types";

const PUBLIC_AVATAR_HOSTS = new Set(["aipify.ai", "www.aipify.ai", "app.aipify.ai"]);

/** Email clients cannot use the private portal avatar pointer. Public Aipify https only. */
export function publicEmailAvatarUrl(value: string | null | undefined): string {
  if (!value) return "";
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return "";
    if (!PUBLIC_AVATAR_HOSTS.has(url.hostname.toLowerCase())) return "";
    return url.toString();
  } catch {
    return "";
  }
}

export function buildSalesReferralUrl(input: {
  code: string | null | undefined;
  productKey: string;
  locale: CspEmailTemplateLocale;
}): string {
  if (!input.code) return "";
  const path = buildCspPublicLinkPath({
    code: input.code,
    productKey: input.productKey,
    channel: "email",
  });
  if (!path) return "";
  return `https://aipify.ai${path}&lang=${input.locale}`;
}

/** CSP legal name first. Auth metadata is only a fallback. APP customer profiles are not read. */
export function resolveSellerCompany(input: {
  legalBusinessName?: string | null;
  metadataCompany?: string | null;
}): string {
  const legal = input.legalBusinessName?.trim() ?? "";
  if (legal) return legal;
  return input.metadataCompany?.trim() ?? "";
}

export function readProfileSignature(input: {
  displayName: string | null;
  company: string | null;
  contactEmail: string | null;
  avatarUrl: string | null;
}): { ok: true; displayName: string; company: string; contact: string; avatarUrl: string } | { ok: false; code: "profile_incomplete" } {
  const displayName = input.displayName?.trim() ?? "";
  const company = input.company?.trim() ?? "";
  const contact = input.contactEmail?.trim().toLowerCase() ?? "";
  if (!displayName || !company || !contact.includes("@")) {
    return { ok: false, code: "profile_incomplete" };
  }
  return {
    ok: true,
    displayName,
    company,
    contact,
    avatarUrl: publicEmailAvatarUrl(input.avatarUrl),
  };
}
