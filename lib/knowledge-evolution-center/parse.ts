import type {
  DomainMetric,
  EvolutionInsight,
  EvolutionRecommendation,
  GovernanceReview,
  KnowledgeAsset,
  KnowledgeEvolutionCenter,
  LifecycleStage,
  ReviewQueueItem,
  SmeAssignment,
  VersionHistoryItem,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseAsset(raw: unknown): KnowledgeAsset {
  const row = asRecord(raw);
  return {
    asset_key: String(row.asset_key ?? ""),
    domain: String(row.domain ?? ""),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    lifecycle_stage: String(row.lifecycle_stage ?? "published"),
    health_status: String(row.health_status ?? "healthy"),
    usage_count: Number(row.usage_count ?? 0),
    days_since_review: Number(row.days_since_review ?? 0),
    validation_status: String(row.validation_status ?? "validated"),
  };
}

export function parseKnowledgeEvolutionCenter(raw: unknown): KnowledgeEvolutionCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);
  const search = asRecord(row.search_optimization);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            total_assets: Number(dash.total_assets ?? 0),
            articles_requiring_review: Number(dash.articles_requiring_review ?? 0),
            outdated_indicators: Number(dash.outdated_indicators ?? 0),
            recently_improved: Number(dash.recently_improved ?? 0),
            knowledge_health_score: Number(dash.knowledge_health_score ?? 0),
            knowledge_health_label: String(dash.knowledge_health_label ?? "healthy"),
            review_completion_pct: Number(dash.review_completion_pct ?? 0),
            search_effectiveness_pct: Number(dash.search_effectiveness_pct ?? 0),
            utilization_rate_pct: Number(dash.utilization_rate_pct ?? 0),
            user_satisfaction: Number(dash.user_satisfaction ?? 0),
            executive_trust_indicator: Number(dash.executive_trust_indicator ?? 0),
          }
        : null,
    domain_metrics: Array.isArray(row.domain_metrics)
      ? row.domain_metrics.map((m) => {
          const item = asRecord(m);
          return {
            metric_key: String(item.metric_key ?? ""),
            domain: String(item.domain ?? ""),
            label: String(item.label ?? ""),
            value_label: String(item.value_label ?? ""),
            health_status: String(item.health_status ?? "healthy"),
          } satisfies DomainMetric;
        })
      : [],
    assets: Array.isArray(row.assets) ? row.assets.map(parseAsset) : [],
    review_queue: Array.isArray(row.review_queue)
      ? row.review_queue.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            asset_key: item.asset_key ? String(item.asset_key) : null,
            review_type: String(item.review_type ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
            status: String(item.status ?? "open"),
          } satisfies ReviewQueueItem;
        })
      : [],
    version_history: Array.isArray(row.version_history)
      ? row.version_history.map((v) => {
          const item = asRecord(v);
          return {
            version_key: String(item.version_key ?? ""),
            asset_key: String(item.asset_key ?? ""),
            version_label: String(item.version_label ?? ""),
            contributor_label: String(item.contributor_label ?? ""),
            change_summary: String(item.change_summary ?? ""),
            approval_status: String(item.approval_status ?? "approved"),
            recorded_at: item.recorded_at ? String(item.recorded_at) : null,
          } satisfies VersionHistoryItem;
        })
      : [],
    sme_assignments: Array.isArray(row.sme_assignments)
      ? row.sme_assignments.map((s) => {
          const item = asRecord(s);
          return {
            assignment_key: String(item.assignment_key ?? ""),
            asset_key: String(item.asset_key ?? ""),
            sme_label: String(item.sme_label ?? ""),
            validation_type: String(item.validation_type ?? ""),
            status: String(item.status ?? "pending"),
          } satisfies SmeAssignment;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies EvolutionInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies EvolutionRecommendation;
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
          } satisfies GovernanceReview;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            knowledge_maturity: String(exec.knowledge_maturity ?? ""),
            risk_indicators: String(exec.risk_indicators ?? ""),
            validation_participation: String(exec.validation_participation ?? ""),
            improvement_momentum: String(exec.improvement_momentum ?? ""),
          }
        : null,
    search_optimization:
      Object.keys(search).length > 0
        ? {
            discoverability_score: Number(search.discoverability_score ?? 0),
            related_recommendations_enabled: Boolean(search.related_recommendations_enabled),
            summary: String(search.summary ?? ""),
          }
        : null,
    knowledge_lifecycle: Array.isArray(row.knowledge_lifecycle)
      ? row.knowledge_lifecycle.map((s) => {
          const item = asRecord(s);
          return {
            stage: String(item.stage ?? ""),
            label: String(item.label ?? ""),
          } satisfies LifecycleStage;
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
