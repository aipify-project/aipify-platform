export type HostsVendorCenterSectionKey =
  | "vendors"
  | "contracts"
  | "service_agreements"
  | "certifications"
  | "performance_reviews";

export type HostsVendorRow = {
  id: string;
  vendor_key: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone_number: string;
  service_category: string;
  coverage_area: string;
  status: string;
  created_at: string;
};

export type HostsContractRow = {
  id: string;
  contract_key: string;
  vendor: string;
  vendor_id: string;
  contract_type: string;
  start_date: string;
  end_date: string;
  renewal_terms: string;
  status: string;
};

export type HostsCertificationRow = {
  id: string;
  vendor_id: string;
  vendor: string;
  certification_type: string;
  document_name: string;
  expiry_date: string | null;
  verification_status: string;
};

export type HostsPerformanceReviewRow = {
  id: string;
  vendor_id: string;
  vendor: string;
  review_frequency: string;
  reliability_score: number;
  response_time_score: number;
  quality_rating: number;
  cost_effectiveness: number;
  overall_rating: number;
  review_notes: string | null;
  next_review_due: string | null;
  created_at: string;
};

export type HostsVendorStats = {
  active_vendors: number;
  contracts_expiring: number;
  certs_expiring: number;
  reviews_due: number;
  suspended_vendors: number;
};

export type HostsVendorCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  vendor_categories: string[];
  vendor_statuses: string[];
  contract_statuses: string[];
  contract_types: string[];
  certification_statuses: string[];
  review_frequencies: string[];
  stats: HostsVendorStats;
  vendors: HostsVendorRow[];
  contracts: HostsContractRow[];
  service_agreements: HostsContractRow[];
  certifications: HostsCertificationRow[];
  performance_reviews: HostsPerformanceReviewRow[];
};

export type HostsVendorCenterActionResult = {
  success: boolean;
  vendor_id?: string;
  action_type?: string;
};
