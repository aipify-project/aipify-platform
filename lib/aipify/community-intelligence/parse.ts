import type {
  CommunityIntelligenceCard,
  CommunityIntelligenceDashboard,
  CommunityIntelligenceAdmin,
  CommunityActionResult,
  CommunityBriefingResult,
} from "./types";

export function parseCommunityIntelligenceCard(data: unknown): CommunityIntelligenceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    health_score: d.health_score as number | undefined,
    contribution_score: d.contribution_score as number | undefined,
    pending_reviews: d.pending_reviews as number | undefined,
    philosophy: d.philosophy as string | undefined,
    participation_voluntary: d.participation_voluntary as boolean | undefined,
  };
}

export function parseCommunityIntelligenceDashboard(data: unknown): CommunityIntelligenceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    participation_enabled: d.participation_enabled as boolean | undefined,
    participation_voluntary: d.participation_voluntary as boolean | undefined,
    anonymization_required: d.anonymization_required as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    safety_note: d.safety_note as string | undefined,
    health_score: d.health_score as number | undefined,
    contribution_score: d.contribution_score as number | undefined,
    score_components: d.score_components as Record<string, number> | undefined,
    featured_insights: Array.isArray(d.featured_insights)
      ? (d.featured_insights as CommunityIntelligenceDashboard["featured_insights"])
      : [],
    best_practices: Array.isArray(d.best_practices)
      ? (d.best_practices as CommunityIntelligenceDashboard["best_practices"])
      : [],
    top_rated: Array.isArray(d.top_rated)
      ? (d.top_rated as CommunityIntelligenceDashboard["top_rated"])
      : [],
    recently_validated: Array.isArray(d.recently_validated)
      ? (d.recently_validated as CommunityIntelligenceDashboard["recently_validated"])
      : [],
    blueprint_discussions: Array.isArray(d.blueprint_discussions)
      ? (d.blueprint_discussions as CommunityIntelligenceDashboard["blueprint_discussions"])
      : [],
    briefings: Array.isArray(d.briefings)
      ? (d.briefings as CommunityIntelligenceDashboard["briefings"])
      : [],
    contribution_types: Array.isArray(d.contribution_types)
      ? (d.contribution_types as CommunityIntelligenceDashboard["contribution_types"])
      : [],
    approval_workflow: Array.isArray(d.approval_workflow)
      ? (d.approval_workflow as CommunityIntelligenceDashboard["approval_workflow"])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
  };
}

export function parseCommunityIntelligenceAdmin(data: unknown): CommunityIntelligenceAdmin {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    participation_enabled: d.participation_enabled as boolean | undefined,
    require_governance_review: d.require_governance_review as boolean | undefined,
    health_score: d.health_score as number | undefined,
    contribution_score: d.contribution_score as number | undefined,
    pending_reviews: Array.isArray(d.pending_reviews)
      ? (d.pending_reviews as CommunityIntelligenceAdmin["pending_reviews"])
      : [],
    contribution_queue: Array.isArray(d.contribution_queue)
      ? (d.contribution_queue as CommunityIntelligenceAdmin["contribution_queue"])
      : [],
    governance_flags: Array.isArray(d.governance_flags)
      ? (d.governance_flags as CommunityIntelligenceAdmin["governance_flags"])
      : [],
    intelligence_trends: Array.isArray(d.intelligence_trends)
      ? (d.intelligence_trends as CommunityIntelligenceAdmin["intelligence_trends"])
      : [],
    pending_count: d.pending_count as number | undefined,
    queue_count: d.queue_count as number | undefined,
  };
}

export function parseCommunityActionResult(data: unknown): CommunityActionResult {
  return (data ?? {}) as CommunityActionResult;
}

export function parseCommunityBriefingResult(data: unknown): CommunityBriefingResult {
  return (data ?? {}) as CommunityBriefingResult;
}
