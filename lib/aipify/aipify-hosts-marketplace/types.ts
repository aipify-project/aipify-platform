export type HostsMarketplaceServiceCategoryKey =
  | "cleaning"
  | "laundry"
  | "maintenance"
  | "plumbing"
  | "electrical"
  | "locksmith"
  | "landscaping"
  | "snow_removal"
  | "photography"
  | "interior_styling"
  | "property_inspections"
  | "guest_transport"
  | "concierge";

export type HostsMarketplaceRequestStatus =
  | "requested"
  | "accepted"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export type HostsMarketplaceModuleKey =
  | "provider_search"
  | "favorites"
  | "service_requests"
  | "provider_comparison"
  | "work_reviews"
  | "provider_verification"
  | "provider_operations"
  | "service_network_governance";

export type HostsMarketplaceServiceCategory = {
  key: HostsMarketplaceServiceCategoryKey | string;
  label: string;
};

export type HostsMarketplaceModule = {
  key: HostsMarketplaceModuleKey | string;
  label: string;
  description: string;
};

export type HostsMarketplaceProvider = {
  id: string;
  provider_key: string;
  company_name: string;
  service_categories: string[];
  coverage_area: string;
  contact_email: string | null;
  contact_phone: string | null;
  rating_avg: number;
  rating_count: number;
  verification_status: string;
  availability_status: string;
  publication_status: string;
  profile_summary: string | null;
  is_favorite: boolean;
};

export type HostsMarketplaceRequest = {
  id: string;
  request_key: string;
  provider_id: string;
  property_id: string | null;
  service_category: string;
  status: HostsMarketplaceRequestStatus | string;
  summary: string;
  scheduled_at: string | null;
  completion_evidence: unknown[];
  created_at: string;
  updated_at: string;
  provider_name?: string;
};

export type HostsMarketplacePerformance = {
  average_provider_rating: number;
  verified_provider_count: number;
  completed_jobs: number;
  on_time_completion_pct: number;
};

export type HostsMarketplaceApproval = {
  key: string;
  company_name: string;
  verification_status: string;
  publication_status: string;
};

export type AipifyHostsMarketplaceDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  human_oversight_required: boolean;
  positioning: string;
  service_categories: HostsMarketplaceServiceCategory[];
  modules: HostsMarketplaceModule[];
  governance: {
    principle: string;
    approval_required: boolean;
    audit_required: boolean;
    verification_required: boolean;
    payments_enabled: boolean;
    commission_ready: boolean;
  };
  commercial: {
    phase: string;
    payments_enabled: boolean;
    commission_ready: boolean;
    future_opportunities: string[];
  };
  knowledge_categories: string[];
  providers: HostsMarketplaceProvider[];
  favorites: HostsMarketplaceProvider[];
  open_requests: HostsMarketplaceRequest[];
  upcoming_services: HostsMarketplaceRequest[];
  provider_performance: HostsMarketplacePerformance;
  outstanding_approvals: HostsMarketplaceApproval[];
  host_capabilities: string[];
  provider_capabilities: string[];
  operational_statuses: string[];
};

export type AipifyHostsMarketplaceCard = {
  has_customer: boolean;
  enabled?: boolean;
  package_key?: string;
  open_requests?: number;
  human_oversight_required?: boolean;
  positioning?: string;
  route?: string;
};

export type ToggleMarketplaceFavoriteResult = {
  success: boolean;
  is_favorite: boolean;
  provider_id: string;
};

export type CreateMarketplaceRequestResult = {
  success: boolean;
  request?: HostsMarketplaceRequest;
};
