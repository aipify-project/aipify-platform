import type {
  HostsCertificationRow,
  HostsContractRow,
  HostsPerformanceReviewRow,
  HostsVendorCenterActionResult,
  HostsVendorCenterDashboard,
  HostsVendorRow,
  HostsVendorStats,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseVendors(data: unknown): HostsVendorRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        vendor_key: typeof d.vendor_key === "string" ? d.vendor_key : "",
        company_name: typeof d.company_name === "string" ? d.company_name : "",
        contact_person: typeof d.contact_person === "string" ? d.contact_person : "—",
        email: typeof d.email === "string" ? d.email : "—",
        phone_number: typeof d.phone_number === "string" ? d.phone_number : "—",
        service_category: typeof d.service_category === "string" ? d.service_category : "",
        coverage_area: typeof d.coverage_area === "string" ? d.coverage_area : "—",
        status: typeof d.status === "string" ? d.status : "",
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsVendorRow => r !== null);
}

function parseContracts(data: unknown): HostsContractRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        contract_key: typeof d.contract_key === "string" ? d.contract_key : "",
        vendor: typeof d.vendor === "string" ? d.vendor : "—",
        vendor_id: String(d.vendor_id ?? ""),
        contract_type: typeof d.contract_type === "string" ? d.contract_type : "",
        start_date: typeof d.start_date === "string" ? d.start_date : "",
        end_date: typeof d.end_date === "string" ? d.end_date : "",
        renewal_terms: typeof d.renewal_terms === "string" ? d.renewal_terms : "—",
        status: typeof d.status === "string" ? d.status : "",
      };
    })
    .filter((r): r is HostsContractRow => r !== null);
}

function parseCertifications(data: unknown): HostsCertificationRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        vendor_id: String(d.vendor_id ?? ""),
        vendor: typeof d.vendor === "string" ? d.vendor : "—",
        certification_type: typeof d.certification_type === "string" ? d.certification_type : "",
        document_name: typeof d.document_name === "string" ? d.document_name : "",
        expiry_date: typeof d.expiry_date === "string" ? d.expiry_date : null,
        verification_status: typeof d.verification_status === "string" ? d.verification_status : "",
      };
    })
    .filter((r): r is HostsCertificationRow => r !== null);
}

function parseReviews(data: unknown): HostsPerformanceReviewRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        vendor_id: String(d.vendor_id ?? ""),
        vendor: typeof d.vendor === "string" ? d.vendor : "—",
        review_frequency: typeof d.review_frequency === "string" ? d.review_frequency : "",
        reliability_score: Number(d.reliability_score ?? 0),
        response_time_score: Number(d.response_time_score ?? 0),
        quality_rating: Number(d.quality_rating ?? 0),
        cost_effectiveness: Number(d.cost_effectiveness ?? 0),
        overall_rating: Number(d.overall_rating ?? 0),
        review_notes: typeof d.review_notes === "string" ? d.review_notes : null,
        next_review_due: typeof d.next_review_due === "string" ? d.next_review_due : null,
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsPerformanceReviewRow => r !== null);
}

function parseStats(data: unknown): HostsVendorStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    active_vendors: Number(d.active_vendors ?? 0),
    contracts_expiring: Number(d.contracts_expiring ?? 0),
    certs_expiring: Number(d.certs_expiring ?? 0),
    reviews_due: Number(d.reviews_due ?? 0),
    suspended_vendors: Number(d.suspended_vendors ?? 0),
  };
}

export function parseAipifyHostsVendorCenterDashboard(data: unknown): HostsVendorCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "vendors",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    vendor_categories: asArray<string>(d.vendor_categories),
    vendor_statuses: asArray<string>(d.vendor_statuses),
    contract_statuses: asArray<string>(d.contract_statuses),
    contract_types: asArray<string>(d.contract_types),
    certification_statuses: asArray<string>(d.certification_statuses),
    review_frequencies: asArray<string>(d.review_frequencies),
    stats: parseStats(d.stats),
    vendors: parseVendors(d.vendors),
    contracts: parseContracts(d.contracts),
    service_agreements: parseContracts(d.service_agreements),
    certifications: parseCertifications(d.certifications),
    performance_reviews: parseReviews(d.performance_reviews),
  };
}

export function parseAipifyHostsVendorCenterActionResult(data: unknown): HostsVendorCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    vendor_id: d.vendor_id != null ? String(d.vendor_id) : undefined,
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
  };
}
