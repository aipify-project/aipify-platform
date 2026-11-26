/**
 * Support firm signature — admin-editable model + safe HTML/text render.
 * Uses only COMPANY_CONFIG + official brand logo URL. No invented contact data.
 */

import { COMPANY_CONFIG } from "@/lib/company/company.config";

/** Official light logo already used by auth/onboarding email (verified public path). */
export const SUPPORT_SIGNATURE_LOGO_URL =
  "https://aipify.ai/website-kompis/design-v1/brand/aipify-logo-light.png" as const;

export const SUPPORT_SIGNATURE_LOGO_ALT = "Aipify" as const;

export type SupportSignatureDraft = {
  displayName: string;
  agentName: string;
  agentTitle: string;
  companyName: string;
  websiteUrl: string;
  supportEmail: string;
  phone: string;
  addressLine: string;
  logoUrl: string;
  includeLogo: boolean;
  active: boolean;
  version: number;
};

export function createDefaultSupportSignature(
  overrides: Partial<SupportSignatureDraft> = {},
): SupportSignatureDraft {
  return {
    displayName: "Aipify Support",
    agentName: "",
    agentTitle: "",
    companyName: COMPANY_CONFIG.legalCompanyName,
    websiteUrl: COMPANY_CONFIG.website,
    supportEmail: COMPANY_CONFIG.supportEmail,
    phone: "",
    addressLine: `${COMPANY_CONFIG.postalCode} ${COMPANY_CONFIG.city}, ${COMPANY_CONFIG.country}`,
    logoUrl: SUPPORT_SIGNATURE_LOGO_URL,
    includeLogo: true,
    active: true,
    version: 1,
    ...overrides,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHttpUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Plain-text signature for multipart/alternative and blocked-image clients. */
export function renderSupportSignatureText(draft: SupportSignatureDraft): string {
  const lines: string[] = [];
  const who = [draft.agentName.trim(), draft.agentTitle.trim()].filter(Boolean);
  if (who.length) lines.push(who.join(" · "));
  if (draft.displayName.trim()) lines.push(draft.displayName.trim());
  if (draft.companyName.trim()) lines.push(draft.companyName.trim());
  if (draft.supportEmail.trim()) lines.push(draft.supportEmail.trim());
  if (draft.phone.trim()) lines.push(draft.phone.trim());
  if (draft.addressLine.trim()) lines.push(draft.addressLine.trim());
  const site = sanitizeHttpUrl(draft.websiteUrl);
  if (site) lines.push(site);
  if (draft.includeLogo) {
    lines.push(`[${SUPPORT_SIGNATURE_LOGO_ALT}]`);
  }
  return lines.join("\n");
}

/**
 * Safe HTML signature — table layout, escaped text, no scripts/tracking.
 * Logo uses absolute HTTPS URL; alt text always present.
 */
export function renderSupportSignatureHtml(draft: SupportSignatureDraft): string {
  const rows: string[] = [];
  const agentBits = [draft.agentName.trim(), draft.agentTitle.trim()]
    .filter(Boolean)
    .map(escapeHtml);
  if (agentBits.length) {
    rows.push(
      `<div style="font-size:14px;font-weight:600;color:#111827;">${agentBits.join(" · ")}</div>`,
    );
  }
  if (draft.displayName.trim()) {
    rows.push(
      `<div style="font-size:13px;color:#374151;">${escapeHtml(draft.displayName.trim())}</div>`,
    );
  }
  if (draft.companyName.trim()) {
    rows.push(
      `<div style="font-size:13px;color:#111827;font-weight:600;">${escapeHtml(draft.companyName.trim())}</div>`,
    );
  }
  if (draft.supportEmail.trim()) {
    const email = escapeHtml(draft.supportEmail.trim());
    rows.push(
      `<div style="font-size:13px;"><a href="mailto:${email}" style="color:#4f46e5;text-decoration:none;">${email}</a></div>`,
    );
  }
  if (draft.phone.trim()) {
    rows.push(
      `<div style="font-size:13px;color:#374151;">${escapeHtml(draft.phone.trim())}</div>`,
    );
  }
  if (draft.addressLine.trim()) {
    rows.push(
      `<div style="font-size:12px;color:#6b7280;">${escapeHtml(draft.addressLine.trim())}</div>`,
    );
  }
  const site = sanitizeHttpUrl(draft.websiteUrl);
  if (site) {
    rows.push(
      `<div style="font-size:12px;"><a href="${escapeHtml(site)}" style="color:#4f46e5;text-decoration:none;">${escapeHtml(site.replace(/^https?:\/\//, ""))}</a></div>`,
    );
  }

  const logoUrl = sanitizeHttpUrl(draft.logoUrl) ?? SUPPORT_SIGNATURE_LOGO_URL;
  const logoBlock =
    draft.includeLogo
      ? `<tr><td style="padding-bottom:12px;"><img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(SUPPORT_SIGNATURE_LOGO_ALT)}" width="140" height="42" style="display:block;border:0;outline:none;text-decoration:none;max-width:140px;height:auto;" /></td></tr>`
      : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
${logoBlock}
<tr><td style="border-top:1px solid #e5e7eb;padding-top:12px;">${rows.join("")}</td></tr>
</table>`;
}

/** Persist gate — storage requires Core SQL candidate apply (Phase B). */
export const SUPPORT_SIGNATURE_PERSIST_CONFIGURED = false as const;
