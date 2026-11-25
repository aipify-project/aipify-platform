/**
 * Public certificate verification — SERVER-ONLY.
 * Looks up a reversible certificate id (`{productKey}-{partnerUuid}`) with direct Core reads.
 * Returns minimal public fields only (no bank, commission, email, or private partner data).
 */
import { COMPANY_CONFIG } from "@/lib/company/company.config";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  CSP_CERTIFICATE_PRODUCT_LABEL,
  parseCspCertificateId,
} from "./certificate";

const CERTIFICATE_ID_PATTERN = /^[0-9a-zA-Z_-]{8,64}$/;
const PRODUCT_KEY = "kompis_web";

export type CspPublicCertificateStatus = "valid" | "revoked" | "not_found" | "unavailable";

export type CspPublicCertificateVerification = {
  status: CspPublicCertificateStatus;
  certificateId: string;
  productLabel: string;
  issuer: string;
  orgNumber: string;
  country: string;
  /** ISO date (YYYY-MM-DD) when valid/revoked; null when not found. */
  issuedOn: string | null;
  /** Privacy-limited display name (initials) when valid; never full legal name on public page. */
  holderInitials: string | null;
};

function initialsFromName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3);
  if (parts.length === 0) return "—";
  return parts.map((p) => p.charAt(0).toUpperCase()).join("·");
}

/**
 * Verifies a certificate id against Core. Fail-closed on config/service errors.
 * Uses direct partner+product lookup — no table scan.
 */
export async function verifyCspCertificatePublic(
  certificateId: string,
): Promise<CspPublicCertificateVerification> {
  const id = certificateId.trim();
  const base = {
    certificateId: id,
    productLabel: CSP_CERTIFICATE_PRODUCT_LABEL,
    issuer: COMPANY_CONFIG.legalCompanyName,
    orgNumber: COMPANY_CONFIG.organizationNumber,
    country: COMPANY_CONFIG.country,
    issuedOn: null as string | null,
    holderInitials: null as string | null,
  };

  if (!CERTIFICATE_ID_PATTERN.test(id)) {
    return { ...base, status: "not_found" };
  }
  if (!COMPANY_CONFIG.organizationNumber?.trim() || !COMPANY_CONFIG.legalCompanyName?.trim()) {
    return { ...base, status: "unavailable" };
  }

  const parsed = parseCspCertificateId(id);
  if (!parsed || parsed.productKey !== PRODUCT_KEY) {
    // Legacy UUID-shaped ids cannot be resolved without a persisted indexed column.
    // Do not scan the certifications table — return not_found until Core stores certificate_id.
    return { ...base, status: "not_found" };
  }

  try {
    const admin = createServiceRoleClient();
    const { data: product, error: productError } = await admin
      .from("csp_sales_products")
      .select("id")
      .eq("product_key", parsed.productKey)
      .maybeSingle();
    if (productError || !product?.id) {
      return { ...base, status: "unavailable" };
    }

    const { data: row, error } = await admin
      .from("csp_product_certifications")
      .select("partner_id, status, passed_at, score")
      .eq("product_id", product.id)
      .eq("partner_id", parsed.partnerId)
      .maybeSingle();

    if (error) {
      return { ...base, status: "unavailable" };
    }
    if (!row) {
      return { ...base, status: "not_found" };
    }

    const issuedOn =
      typeof row.passed_at === "string" && row.passed_at.length >= 10
        ? row.passed_at.slice(0, 10)
        : null;

    if (row.status === "revoked") {
      return { ...base, status: "revoked", issuedOn };
    }
    if (row.status !== "passed") {
      return { ...base, status: "not_found" };
    }

    const { data: partner } = await admin
      .from("csp_partner_profiles")
      .select("display_name, status")
      .eq("id", parsed.partnerId)
      .maybeSingle();

    const displayName =
      partner && typeof partner.display_name === "string" ? partner.display_name : "";
    const partnerStatus = partner && typeof partner.status === "string" ? partner.status : "";
    if (["suspended", "rejected", "terminated"].includes(partnerStatus)) {
      return { ...base, status: "revoked", issuedOn };
    }

    return {
      ...base,
      status: "valid",
      issuedOn,
      holderInitials: initialsFromName(displayName),
    };
  } catch {
    return { ...base, status: "unavailable" };
  }
}
