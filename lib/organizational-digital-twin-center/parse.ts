import type { OrganizationalDigitalTwinCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalDigitalTwinCenter(raw: unknown): OrganizationalDigitalTwinCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            structural_nodes: Number(dash.structural_nodes ?? 0),
            relationships_mapped: Number(dash.relationships_mapped ?? 0),
            critical_dependencies: Number(dash.critical_dependencies ?? 0),
            workflow_health_score: Number(dash.workflow_health_score ?? 0),
            automation_coverage_pct: Number(dash.automation_coverage_pct ?? 0),
            knowledge_distribution_score: Number(dash.knowledge_distribution_score ?? 0),
            complexity_index: Number(dash.complexity_index ?? 0),
            dependency_risk_score: Number(dash.dependency_risk_score ?? 0),
            workflow_maturity_score: Number(dash.workflow_maturity_score ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
            companion_usefulness_rating: Number(dash.companion_usefulness_rating ?? 0),
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
          };
        })
      : [],
    nodes: Array.isArray(row.nodes)
      ? row.nodes.map((n) => {
          const item = asRecord(n);
          return {
            node_key: String(item.node_key ?? ""),
            node_type: String(item.node_type ?? ""),
            label: String(item.label ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "active"),
          };
        })
      : [],
    relationships: Array.isArray(row.relationships)
      ? row.relationships.map((r) => {
          const item = asRecord(r);
          return {
            relationship_key: String(item.relationship_key ?? ""),
            from_node_key: String(item.from_node_key ?? ""),
            to_node_key: String(item.to_node_key ?? ""),
            relationship_type: String(item.relationship_type ?? ""),
            summary: String(item.summary ?? ""),
          };
        })
      : [],
    dependencies: Array.isArray(row.dependencies)
      ? row.dependencies.map((d) => {
          const item = asRecord(d);
          return {
            dependency_key: String(item.dependency_key ?? ""),
            label: String(item.label ?? ""),
            systems_involved: Array.isArray(item.systems_involved)
              ? item.systems_involved.map(String)
              : [],
            risk_level: String(item.risk_level ?? "medium"),
            summary: String(item.summary ?? ""),
          };
        })
      : [],
    visualizations: Array.isArray(row.visualizations)
      ? row.visualizations.map((v) => {
          const item = asRecord(v);
          return {
            visualization_key: String(item.visualization_key ?? ""),
            viz_type: String(item.viz_type ?? ""),
            title: String(item.title ?? ""),
            description: String(item.description ?? ""),
          };
        })
      : [],
    impact_scenarios: Array.isArray(row.impact_scenarios)
      ? row.impact_scenarios.map((s) => {
          const item = asRecord(s);
          return {
            scenario_key: String(item.scenario_key ?? ""),
            question: String(item.question ?? ""),
            affected_areas: Array.isArray(item.affected_areas) ? item.affected_areas.map(String) : [],
            impact_summary: String(item.impact_summary ?? ""),
            confidence: String(item.confidence ?? "moderate"),
          };
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            snapshot_type: String(item.snapshot_type ?? ""),
            label: String(item.label ?? ""),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          };
        })
      : [],
    comparisons: Array.isArray(row.comparisons)
      ? row.comparisons.map((c) => {
          const item = asRecord(c);
          return {
            comparison_key: String(item.comparison_key ?? ""),
            before_label: String(item.before_label ?? ""),
            after_label: String(item.after_label ?? ""),
            finding: String(item.finding ?? ""),
            trend: String(item.trend ?? "stable"),
          };
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          };
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          };
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
          };
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            complexity_indicator: String(exec.complexity_indicator ?? ""),
            dependency_risks: String(exec.dependency_risks ?? ""),
            workflow_maturity: String(exec.workflow_maturity ?? ""),
            structural_opportunities: String(exec.structural_opportunities ?? ""),
            executive_priorities: String(exec.executive_priorities ?? ""),
          }
        : null,
    links: row.links && typeof row.links === "object" ? (row.links as Record<string, string>) : null,
    can_manage: Boolean(row.can_manage),
    can_contribute: Boolean(row.can_contribute),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
