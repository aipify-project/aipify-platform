import type {
  CapabilityItem,
  CapabilityMaturityCenter,
  CapabilityMilestone,
  MaturityInsight,
  MaturityLevel,
  MaturityRecommendation,
  MaturityReview,
  MaturitySnapshot,
  RoadmapItem,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseCapability(raw: unknown): CapabilityItem {
  const row = asRecord(raw);
  return {
    capability_key: String(row.capability_key ?? ""),
    domain: String(row.domain ?? ""),
    label: String(row.label ?? ""),
    summary: String(row.summary ?? ""),
    current_level: Number(row.current_level ?? 1),
    previous_level: Number(row.previous_level ?? 1),
    current_level_label: String(row.current_level_label ?? ""),
    previous_level_label: String(row.previous_level_label ?? ""),
    maturity_score: Number(row.maturity_score ?? 0),
    momentum: String(row.momentum ?? "stable"),
  };
}

export function parseCapabilityMaturityCenter(raw: unknown): CapabilityMaturityCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            overall_maturity_score: Number(dash.overall_maturity_score ?? 0),
            overall_maturity_level: String(dash.overall_maturity_level ?? "Developing"),
            capabilities_assessed: Number(dash.capabilities_assessed ?? 0),
            strongest_count: Number(dash.strongest_count ?? 0),
            developing_count: Number(dash.developing_count ?? 0),
            improving_count: Number(dash.improving_count ?? 0),
            improvement_opportunities: Number(dash.improvement_opportunities ?? 0),
            executive_confidence: Number(dash.executive_confidence ?? 0),
            participation_satisfaction: Number(dash.participation_satisfaction ?? 0),
          }
        : null,
    capabilities: Array.isArray(row.capabilities) ? row.capabilities.map(parseCapability) : [],
    milestones: Array.isArray(row.milestones)
      ? row.milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            capability_key: String(item.capability_key ?? ""),
            label: String(item.label ?? ""),
            achieved_at: item.achieved_at ? String(item.achieved_at) : null,
          } satisfies CapabilityMilestone;
        })
      : [],
    roadmap: Array.isArray(row.roadmap)
      ? row.roadmap.map((r) => {
          const item = asRecord(r);
          return {
            roadmap_key: String(item.roadmap_key ?? ""),
            priority_type: String(item.priority_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            related_domain: String(item.related_domain ?? ""),
            status: String(item.status ?? "open"),
          } satisfies RoadmapItem;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            label: String(item.label ?? ""),
            overall_score: Number(item.overall_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies MaturitySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies MaturityInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies MaturityRecommendation;
        })
      : [],
    governance_reviews: Array.isArray(row.governance_reviews)
      ? row.governance_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies MaturityReview;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            organizational_strengths: String(exec.organizational_strengths ?? ""),
            capability_gaps: String(exec.capability_gaps ?? ""),
            improvement_momentum: String(exec.improvement_momentum ?? ""),
            strategic_readiness: String(exec.strategic_readiness ?? ""),
          }
        : null,
    maturity_levels: Array.isArray(row.maturity_levels)
      ? row.maturity_levels.map((l) => {
          const item = asRecord(l);
          return {
            level: Number(item.level ?? 1),
            key: String(item.key ?? ""),
            label: String(item.label ?? ""),
            description: String(item.description ?? ""),
          } satisfies MaturityLevel;
        })
      : [],
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_contribute: Boolean(row.can_contribute),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
