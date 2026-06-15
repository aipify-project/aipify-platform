import type {
  AipifyHostsMarketplaceCard,
  AipifyHostsMarketplaceDashboard,
  CreateMarketplaceRequestResult,
  HostsMarketplaceApproval,
  HostsMarketplacePerformance,
  HostsMarketplaceProvider,
  HostsMarketplaceRequest,
  ToggleMarketplaceFavoriteResult,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseProvider(data: unknown): HostsMarketplaceProvider | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.id) return null;
  return {
    id: String(d.id),
    provider_key: typeof d.provider_key === "string" ? d.provider_key : "",
    company_name: typeof d.company_name === "string" ? d.company_name : "",
    service_categories: asArray<string>(d.service_categories),
    coverage_area: typeof d.coverage_area === "string" ? d.coverage_area : "",
    contact_email: typeof d.contact_email === "string" ? d.contact_email : null,
    contact_phone: typeof d.contact_phone === "string" ? d.contact_phone : null,
    rating_avg: Number(d.rating_avg ?? 0),
    rating_count: Number(d.rating_count ?? 0),
    verification_status: typeof d.verification_status === "string" ? d.verification_status : "pending",
    availability_status: typeof d.availability_status === "string" ? d.availability_status : "unavailable",
    publication_status: typeof d.publication_status === "string" ? d.publication_status : "draft",
    profile_summary: typeof d.profile_summary === "string" ? d.profile_summary : null,
    is_favorite: Boolean(d.is_favorite),
  };
}

function parseRequest(data: unknown): HostsMarketplaceRequest | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.id) return null;
  return {
    id: String(d.id),
    request_key: typeof d.request_key === "string" ? d.request_key : "",
    provider_id: typeof d.provider_id === "string" ? d.provider_id : "",
    property_id: typeof d.property_id === "string" ? d.property_id : null,
    service_category: typeof d.service_category === "string" ? d.service_category : "",
    status: typeof d.status === "string" ? d.status : "requested",
    summary: typeof d.summary === "string" ? d.summary : "",
    scheduled_at: typeof d.scheduled_at === "string" ? d.scheduled_at : null,
    completion_evidence: asArray(d.completion_evidence),
    created_at: typeof d.created_at === "string" ? d.created_at : "",
    updated_at: typeof d.updated_at === "string" ? d.updated_at : "",
    provider_name: typeof d.provider_name === "string" ? d.provider_name : undefined,
  };
}

function parsePerformance(data: unknown): HostsMarketplacePerformance {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    average_provider_rating: Number(d.average_provider_rating ?? 0),
    verified_provider_count: Number(d.verified_provider_count ?? 0),
    completed_jobs: Number(d.completed_jobs ?? 0),
    on_time_completion_pct: Number(d.on_time_completion_pct ?? 0),
  };
}

export function parseAipifyHostsMarketplaceDashboard(data: unknown): AipifyHostsMarketplaceDashboard | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.has_customer) return null;
  const commercial = (typeof d.commercial === "object" && d.commercial ? d.commercial : {}) as Record<string, unknown>;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_5",
    human_oversight_required: Boolean(d.human_oversight_required ?? true),
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    service_categories: asArray(d.service_categories),
    modules: asArray(d.modules),
    governance: (typeof d.governance === "object" && d.governance ? d.governance : {
      principle: "",
      approval_required: true,
      audit_required: true,
      verification_required: true,
      payments_enabled: false,
      commission_ready: true,
    }) as AipifyHostsMarketplaceDashboard["governance"],
    commercial: {
      phase: typeof commercial.phase === "string" ? commercial.phase : "foundation",
      payments_enabled: Boolean(commercial.payments_enabled),
      commission_ready: Boolean(commercial.commission_ready ?? true),
      future_opportunities: asArray<string>(commercial.future_opportunities),
    },
    knowledge_categories: asArray<string>(d.knowledge_categories),
    providers: asArray<unknown>(d.providers).map(parseProvider).filter(Boolean) as HostsMarketplaceProvider[],
    favorites: asArray<unknown>(d.favorites).map(parseProvider).filter(Boolean) as HostsMarketplaceProvider[],
    open_requests: asArray<unknown>(d.open_requests).map(parseRequest).filter(Boolean) as HostsMarketplaceRequest[],
    upcoming_services: asArray<unknown>(d.upcoming_services).map(parseRequest).filter(Boolean) as HostsMarketplaceRequest[],
    provider_performance: parsePerformance(d.provider_performance),
    outstanding_approvals: asArray<HostsMarketplaceApproval>(d.outstanding_approvals),
    host_capabilities: asArray<string>(d.host_capabilities),
    provider_capabilities: asArray<string>(d.provider_capabilities),
    operational_statuses: asArray<string>(d.operational_statuses),
  };
}

export function parseAipifyHostsMarketplaceCard(data: unknown): AipifyHostsMarketplaceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: d.enabled !== undefined ? Boolean(d.enabled) : undefined,
    package_key: typeof d.package_key === "string" ? d.package_key : undefined,
    open_requests: d.open_requests !== undefined ? Number(d.open_requests) : undefined,
    human_oversight_required: d.human_oversight_required !== undefined ? Boolean(d.human_oversight_required) : undefined,
    positioning: typeof d.positioning === "string" ? d.positioning : undefined,
    route: typeof d.route === "string" ? d.route : undefined,
  };
}

export function parseToggleMarketplaceFavoriteResult(data: unknown): ToggleMarketplaceFavoriteResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    is_favorite: Boolean(d.is_favorite),
    provider_id: typeof d.provider_id === "string" ? d.provider_id : "",
  };
}

export function parseCreateMarketplaceRequestResult(data: unknown): CreateMarketplaceRequestResult {
  const d = (data ?? {}) as Record<string, unknown>;
  const request = parseRequest(d.request);
  return {
    success: Boolean(d.success),
    request: request ?? undefined,
  };
}
