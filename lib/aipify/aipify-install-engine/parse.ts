import type {
  AipifyInstallEngineCard,
  AipifyInstallEngineDashboard,
  InstallDiscoveryResult,
  InstallPermissionReview,
  InstallRecommendation,
  InstallSummary,
  OrganizationInstallation,
} from "./types";

export function parseAipifyInstallEngineCard(data: unknown): AipifyInstallEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    completion_percentage: Number(d.completion_percentage ?? 0),
    installation_status: typeof d.installation_status === "string" ? d.installation_status : undefined,
    current_step: typeof d.current_step === "string" ? d.current_step : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

function parseInstallation(data: unknown): OrganizationInstallation | undefined {
  if (!data || typeof data !== "object") return undefined;
  const i = data as Record<string, unknown>;
  return {
    id: String(i.id ?? ""),
    organization_id: typeof i.organization_id === "string" ? i.organization_id : undefined,
    installation_status: typeof i.installation_status === "string" ? i.installation_status : undefined,
    current_step: typeof i.current_step === "string" ? i.current_step : undefined,
    completion_percentage: Number(i.completion_percentage ?? 0),
    system_type: typeof i.system_type === "string" ? i.system_type : null,
    domain: typeof i.domain === "string" ? i.domain : null,
    started_at: typeof i.started_at === "string" ? i.started_at : null,
    completed_at: typeof i.completed_at === "string" ? i.completed_at : null,
  };
}

function parseDiscovery(item: unknown): InstallDiscoveryResult {
  const d = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(d.id ?? ""),
    discovery_type: typeof d.discovery_type === "string" ? d.discovery_type : undefined,
    entity_key: typeof d.entity_key === "string" ? d.entity_key : undefined,
    entity_label: typeof d.entity_label === "string" ? d.entity_label : null,
    confidence_score: Number(d.confidence_score ?? 0),
    status: typeof d.status === "string" ? d.status : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseRecommendation(item: unknown): InstallRecommendation {
  const r = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    recommendation_type: typeof r.recommendation_type === "string" ? r.recommendation_type : undefined,
    recommendation_key: typeof r.recommendation_key === "string" ? r.recommendation_key : undefined,
    recommendation_label: typeof r.recommendation_label === "string" ? r.recommendation_label : null,
    priority: Number(r.priority ?? 0),
    status: typeof r.status === "string" ? r.status : undefined,
    rationale: typeof r.rationale === "string" ? r.rationale : null,
  };
}

function parsePermissionReview(item: unknown): InstallPermissionReview {
  const p = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(p.id ?? ""),
    permission_key: typeof p.permission_key === "string" ? p.permission_key : undefined,
    permission_label: typeof p.permission_label === "string" ? p.permission_label : null,
    risk_level: typeof p.risk_level === "string" ? p.risk_level : undefined,
    review_status: typeof p.review_status === "string" ? p.review_status : undefined,
    reviewed_at: typeof p.reviewed_at === "string" ? p.reviewed_at : null,
  };
}

function parseSummary(data: unknown): InstallSummary | undefined {
  if (!data || typeof data !== "object") return undefined;
  const s = data as Record<string, unknown>;
  return {
    completion_percentage: Number(s.completion_percentage ?? 0),
    installation_status: typeof s.installation_status === "string" ? s.installation_status : undefined,
    current_step: typeof s.current_step === "string" ? s.current_step : undefined,
    pending_permissions: Number(s.pending_permissions ?? 0),
    pending_recommendations: Number(s.pending_recommendations ?? 0),
    discoveries: Number(s.discoveries ?? 0),
  };
}

export function parseAipifyInstallEngineDashboard(data: unknown): AipifyInstallEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    install_engine_note: typeof d.install_engine_note === "string" ? d.install_engine_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    installation: parseInstallation(d.installation),
    steps: Array.isArray(d.steps) ? (d.steps as string[]) : undefined,
    summary: parseSummary(d.summary),
    discoveries: Array.isArray(d.discoveries) ? d.discoveries.map(parseDiscovery) : [],
    recommendations: Array.isArray(d.recommendations) ? d.recommendations.map(parseRecommendation) : [],
    permission_reviews: Array.isArray(d.permission_reviews)
      ? d.permission_reviews.map(parsePermissionReview)
      : [],
    install_engine_integration:
      typeof d.install_engine_integration === "object" && d.install_engine_integration
        ? (d.install_engine_integration as Record<string, unknown>)
        : undefined,
  };
}
