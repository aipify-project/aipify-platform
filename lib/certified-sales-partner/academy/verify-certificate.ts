/**
 * Public certificate verification — SERVER-ONLY.
 * Looks up a derived certificate id against passed, non-revoked Core certifications.
 * Returns minimal public fields only (no bank, commission, email, or private partner data).
 */
import { COMPANY_CONFIG } from "@/lib/company/company.config";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  CSP_CERTIFICATE_PRODUCT_LABEL,
  deriveCspCertificateId,
} from "./certificate";

const CERTIFICATE_ID_PATTERN = /^[0-9a-zA-Z-]{8,64}$/;
const PRODUCT_KEY = "kompis_web";
const MAX_SCAN = 500;

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

  try {
    const admin = createServiceRoleClient();
    const { data: product, error: productError } = await admin
      .from("csp_sales_products")
      .select("id")
      .eq("product_key", PRODUCT_KEY)
      .maybeSingle();
    if (productError || !product?.id) {
      return { ...base, status: "unavailable" };
    }

    const { data: rows, error } = await admin
      .from("csp_product_certifications")
      .select("partner_id, status, passed_at, score")
      .eq("product_id", product.id)
      .in("status", ["passed", "revoked"])
      .order("passed_at", { ascending: false })
      .limit(MAX_SCAN);

    if (error || !rows) {
      return { ...base, status: "unavailable" };
    }

    for (const row of rows) {
      const partnerId = typeof row.partner_id === "string" ? row.partner_id : "";
      if (!partnerId) continue;
      const derived = deriveCspCertificateId(partnerId, PRODUCT_KEY);
      if (derived !== id) continue;

      const issuedOn =
        typeof row.passed_at === "string" && row.passed_at.length >= 10
          ? row.passed_at.slice(0, 10)
          : null;

      if (row.status === "revoked") {
        return { ...base, status: "revoked", issuedOn };
      }

      const { data: partner } = await admin
        .from("csp_partner_profiles")
        .select("display_name, status")
        .eq("id", partnerId)
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
    }

    return { ...base, status: "not_found" };
  } catch {
    return { ...base, status: "unavailable" };
  }
}
